const Rol = require('../models/rol_model');

// Función asíncrona para crear un rol, verificando que el nombre sea único
async function crearRol(body) {
    // Verificar si el nombre del rol ya existe
    const rolExistente = await Rol.findOne({ rolName: body.rolName });
    if (rolExistente) {
        throw new Error('El nombre del rol ya existe');
    }

    let rol = new Rol({
        rolName: body.rolName,
    });

    return await rol.save();
}

// Función asíncrona para actualizar un rol sin permitir duplicados en el nombre
async function actualizarRol(id, body) {
    let rol = await Rol.findById(id);
    if (!rol) {
        throw new Error('Rol no encontrado');
    }

    // Verificar si el nombre del nuevo rol ya existe, excepto el propio rol
    const rolExistente = await Rol.findOne({ rolName: body.rolName });
    if (rolExistente && rolExistente._id.toString() !== id) {
        throw new Error('El nombre del rol ya existe');
    }
    rol.rolName = body.rolName || rol.rolName;

    await rol.save();
    return rol;
}

// Función para obtener todos los roles
async function listarRoles() {
    return await Rol.find({});
}

// Función para obtener un rol específico por su ID
async function obtenerRolPorId(id) {
    const rol = await Rol.findById(id);
    if (!rol) {
        throw new Error('Rol no encontrado');
    }
    return rol;
}

// Función para desactivar un rol cambiando su estado a false
async function desactivarRol(id) {
    let rol = await Rol.findByIdAndUpdate(id, { estadoRol: false }, { new: true });
    if (!rol) {
        throw new Error('Rol no encontrado');
    }
    return rol;
}

module.exports = {
    crearRol,
    actualizarRol,
    listarRoles,
    obtenerRolPorId,
    desactivarRol
};