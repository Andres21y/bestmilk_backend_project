import User from '../models/User.model.js';    // Importar el modelo de usuario desde MongoDB
import bcrypt from 'bcryptjs';          // Librería para encriptar y comparar contraseñas
import jwt from 'jsonwebtoken';        // Librería para generar y verificar tokens JWT
import crypto from 'crypto';           // Módulo nativo de Node.js para generar tokens aleatorios seguros
import nodemailer from 'nodemailer';   // Librería para enviar correos electrónicos

export const signup = async (req, res) => {

    const { nit, name, last_name, email, password, phone, address } = req.body;

    try {
        // 1. Verificar si el usuario ya existe (por email o nit)
        let userExists = await User.findOne({ $or: [{ email }, { nit }] });

        if (userExists) {
            return res.status(400).json({ msg: "El usuario o NIT ya se encuentra registrado" });
        }

        // 2. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear el nuevo usuario
        const newUser = new User({
            nit,
            name,
            last_name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone,
            address,
            date_register: new Date()
        });

        // 4. Guardar en BD
        await newUser.save();

        // 5. Opcional: Generar token para loguearlo automáticamente tras el registro
        const token = jwt.sign({ id: newUser._id, rol: newUser.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            msg: "Usuario registrado exitosamente",
            token,
            user: {
                name: newUser.name,
                email: newUser.email,
                rol: newUser.rol
            }
        });

    } catch (err) {
        console.error(JSON.stringify(err, null, 2))
        res.status(500).json({ msg: "Error al registrar usuario", error: err.message });
    }

};

export const login = async (req, res) => {

    // Normalizamos el email (sin espacios y en minúsculas)
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    try {
        // Buscamos al usuario en la base de datos
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        if (user.state !== "ACTIVE") {
            return res.status(403).json({ msg: "Your account has not yet been approved by the administrator" });
        }

        // Comparamos la contraseña ingresada con la encriptada en la db
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credential" });

        // Generamos un token JWT con datos del usuario
        const token = jwt.sign(
            { id: user._id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '8h' } // El token expira en n hora
        );

        // Respondemos con el token y los datos del usuario
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                rol: user.rol,
                state: user.state
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ msg: "Server error" });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Verificamos si el usuario existe
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User does not exist" });

        // Generamos un token aleatorio y lo guardamos en el usuario
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hora de validez
        await user.save();

        // Configuramos el transporte de correo (ejemplo con Gmail)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // URL de recuperación 
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // Enviamos el correo con el enlace de recuperación
        await transporter.sendMail({
            to: user.email,
            subject: 'Password Recovery - BestMilk',
            text: `Reset your password here: ${resetUrl}`
        });

        res.json({ msg: "Email sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    try {
        // Buscamos al usuario con el token válido y no expirado
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

        // Encriptamos la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Limpiamos los campos de recuperación
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Guardamos los cambios
        await user.save();

        res.json({ msg: "Password successfully updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};