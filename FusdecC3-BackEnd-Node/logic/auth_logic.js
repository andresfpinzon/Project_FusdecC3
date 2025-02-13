const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario_model');

require('dotenv').config();

const loginServices = async (data) => {
    const { correo, password } = data;
    try {
        // Buscar el usuario por correo
        const usuario = await Usuario.findOne({ correo }).exec();
        if (!usuario) {
            throw new Error('Email incorrecto... Usuario no encontrado');
        }

        // Verificar si la contraseña coincide
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario._id, roles: usuario.roles },
            process.env.JWT_SECRET  ,
            { expiresIn: '12h' }
        );

        return { token };
    } catch (error) {
        console.error('Error en auth_logic.js:', error.message);
        throw error; // Re-lanza el error para manejarlo en el controlador
    }
};

module.exports = { loginServices }; // Exporta como parte de un objeto