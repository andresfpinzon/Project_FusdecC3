const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar el JWT
//const verifyJWT = async (req, res, next) => {
//    // Verificar token
//    const token = req.header('Authorization')?.replace('Bearer ', '');
//    if (!token) {
//        return res.status(401).json({ message: 'Token no proporcionado' });
//    }
//    try {
//        const decoded = jwt.verify(token, process.env.JWT_SECRET);
//        req.user = decoded;

//        next();
//    } catch (error) {
//        return res.status(401).json({ message: 'Token no válido' });
//    }
//};

const verifyJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Convertir los roles del token a formato backend (ej. ROLE_ROOT -> Root)
        const rolesConvertidos = decoded.roles.map(role => {
            return role.replace('ROLE_', '').charAt(0).toUpperCase() + role.slice(6).toLowerCase();
        });

        req.user = {
            ...decoded,
            roles: rolesConvertidos
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token no válido' });
    }
};

// Middleware para verificar roles específicos
const verifyRole = (rolesPermitidos) =>{ 
    return (req, res, next) => {
    const usuario  = req.user;

    if (!usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    
    const tienePermiso = rolesPermitidos.some(role => usuario.roles.includes(role));


    if (!tienePermiso) {
        return res.status(403).json({ message: 'No tiene permisos para realizar esta operación. Acceso denegado' });
    }
    next();
}
};

module.exports = { verifyJWT, verifyRole };
