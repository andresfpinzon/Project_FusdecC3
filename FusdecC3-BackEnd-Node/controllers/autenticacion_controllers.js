const { loginServices } = require('../logic/auth_logic.js'); // Desestructura la función

const login = async (req, res) => {
    try {
        console.log(req.body);
        const user = await loginServices(req.body); // Usa la función aquí
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: user.token });
    } catch (error) {
        console.error('Error en login_controllers.js:', error.message);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

module.exports = { login };