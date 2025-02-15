const { loginServices } = require('../logic/auth_logic.js'); 

const login = async (req, res) => {
    try {
        const user = await loginServices(req.body); 
        res.status(200).json({ message: 'Inicio de sesión exitoso', token: user.token });
    } catch (error) {
        console.error('Error en Autenticacion_controllers.js:', error.message);
        return res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

module.exports = { login };