import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Obtenemos el header Authorization
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        console.warn("Authorization header missing");
        return res.status(401).json({ msg: "Access denied: No token provided" }); 
    }

    // Separamos el header en partes: "Bearer <token>"
    const partes = authHeader.split(" ");

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        console.warn("Invalid Authorization format");
        return res.status(401).json({ msg: "Invalid token format. Use: Bearer <token>" });
    }

    const token = partes[1].trim();

    try {
        // Verificamos el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();

    } catch (err) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ msg: "Invalid token" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ msg: "Restricted access: Administrator permissions required" });
    }
};

