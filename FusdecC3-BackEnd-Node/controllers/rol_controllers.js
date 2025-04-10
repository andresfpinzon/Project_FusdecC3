const Rol = require('../models/rol_model');
const logic = require('../logic/rol_logic');

// Controlador para obtener los roles del enum
const obtenerRolesEnum = (req, res) => {
    try {
        const rolesEnum = logic.obtenerRolesEnum();
        res.json(rolesEnum);
    } catch (err) {
        console.error('Error al obtener roles enum:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para listar todos los roles
const listarRoles = async (req, res) => {
    try {
        const roles = await Rol.find({ estadoRol: true });
        if (roles.length === 0) {
            return res.status(204).json({ message: 'No hay roles registrados' });
        }
        res.json(roles);
    } catch (err) {
        console.error('Error al listar roles:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para crear un rol
const crearRol = async (req, res) => {
    try {
        const { nombreRol } = req.body;
        
        // Verificar si el rol ya existe
        const rolExistente = await Rol.findOne({ nombreRol });
        if (rolExistente) {
            return res.status(409).json({ error: 'Ya existe un rol con este nombre' });
        }

        const nuevoRol = new Rol({
            nombreRol,
            estadoRol: true
        });

        await nuevoRol.save();
        res.status(201).json(nuevoRol);
    } catch (err) {
        console.error('Error al crear rol:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para actualizar un rol
const actualizarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreRol, estadoRol } = req.body;

        const rol = await Rol.findById(id);
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        // Verificar si el nuevo nombre ya existe para otro rol
        if (nombreRol) {
            const rolExistente = await Rol.findOne({ 
                nombreRol, 
                _id: { $ne: id } 
            });
            if (rolExistente) {
                return res.status(409).json({ error: 'Ya existe un rol con este nombre' });
            }
            rol.nombreRol = nombreRol;
        }

        if (estadoRol !== undefined) {
            rol.estadoRol = estadoRol;
        }

        await rol.save();
        res.json(rol);
    } catch (err) {
        console.error('Error al actualizar rol:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para eliminar (desactivar) un rol
const eliminarRol = async (req, res) => {
    try {
        const { id } = req.params;

        const rol = await Rol.findById(id);
        if (!rol) {
            return res.status(404).json({ error: 'Rol no encontrado' });
        }

        rol.estadoRol = false;
        await rol.save();

        res.json({ message: 'Rol desactivado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar rol:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    obtenerRolesEnum,
    listarRoles,
    crearRol,
    actualizarRol,
    eliminarRol
};
