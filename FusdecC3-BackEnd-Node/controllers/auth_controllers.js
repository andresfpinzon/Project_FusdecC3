const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario_model');

const login = async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        // Buscar el usuario por correo
        const user = await Usuario.findOne({ correo }).populate('roles');
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(contraseña, user.contraseñaHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Extraer los nombres de los roles del usuario
        const roles = user.roles.map(rol => rol.nombre);

        // Generar el JWT con los roles
        const token = jwt.sign(
            { id: user._id, roles }, // Incluye los roles del usuario
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Imprimir el token generado en la consola del servidor
        console.log('JWT generado:', token);

        return res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { login };
