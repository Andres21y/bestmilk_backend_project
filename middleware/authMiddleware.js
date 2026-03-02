const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    // Obtenemos el token desde el encabezado "Authorization"
    // Es común que venga en el formato: "Bearer <token>"

    const token = req.header('Authorization');

    // Si no se proporciona un token, devolvemos un error 401 (No autorizado)
    if (!token) {
        return res.status(401).json({ msg: "Access denied, token not provided" });
    }

    try {
        // Eliminamos el prefijo "Bearer " si existe y verificamos el token con la clave secreta
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        /**
         * Guardamos la información decodificada del token en req.user
        esto permite acceder a los datos del usuario en los siguientes controladores
         *  */
        req.user = decoded;

        // Si todo está correcto, pasamos al siguiente middleware o controlador
        next();

    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};

module.exports = verifyToken;