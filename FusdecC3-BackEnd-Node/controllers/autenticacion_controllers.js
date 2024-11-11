const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario_model');
require('dotenv').config();

const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Buscar el usuario por correo
        const usuario = await Usuario.findOne({ correo }).populate('roles');
        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(contraseña, usuario.contraseñaHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Extraer los nombres de los roles del usuario
        const roles = usuario.roles.map(rol => rol.nombreRol);

        try {
            const token = jwt.sign(
                { id: usuario._id,nombre: usuario.nombreUsuario,apellido: usuario.apellidoUsuario, roles }, 
                process.env.JWT_SECRET,
                { expiresIn: '12h' }
            );
            return res.json({ token });
        } catch (jwtError) {
            console.error('Error al generar el JWT:', jwtError);
            return res.status(500).json({ message: 'Error al generar el token' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { login };
