const jwt = require('jsonwebtoken');

// Middleware para verificar el JWT
const verifyJWT = (req, res, next) => {
    console.log("Encabezados recibidos:", req.headers);
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Decodificamos el token y obtenemos el id y los roles
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido' });
    }
};

// Middleware para verificar roles específicos
const verifyRole = (rolesPermitidos) => (req, res, next) => {
    const userRoles = req.user.roles;
    const hasRole = userRoles.some(role => rolesPermitidos.includes(role));

    if (!hasRole) {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
};

module.exports = { verifyJWT, verifyRole };
