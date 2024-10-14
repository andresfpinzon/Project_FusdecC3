const Usuario = require('../models/usuario_model');

// Función asíncrona para crear un usuario
async function crearUsuario(body) {
    // Verificar si el correo ya está registrado
    const usuarioExistente = await Usuario.findOne({ correo: body.correo });
    if (usuarioExistente) {
        throw new Error('El correo electrónico ya está registrado');
    }

    let usuario = new Usuario({
        nombreUsuario: body.nombreUsuario,
        apellidoUsuario: body.apellidoUsuario,
        numeroDocumento: body.numeroDocumento,
        correo: body.correo,
        contraseñaHash: body.contraseñaHash,
        roles: body.roles || [], // Si hay roles en el cuerpo de la solicitud, se agregan
    });

    return await usuario.save();
}

// Función asíncrona para actualizar un usuario sin permitir modificar el email
async function actualizarUsuario(id, body) {
    let usuario = await Usuario.findById(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    usuario.nombreUsuario = body.nombreUsuario || usuario.nombreUsuario;
    usuario.apellidoUsuario = body.apellidoUsuario || usuario.apellidoUsuario;
    usuario.numeroDocumento = body.numeroDocumento || usuario.numeroDocumento;
    usuario.contraseñaHash = body.contraseñaHash || usuario.contraseñaHash;

    // Si se están pasando roles, evitamos duplicados
    if (body.roles && body.roles.length > 0) {
        const nuevosRoles = body.roles.filter(rolId => !usuario.roles.includes(rolId));
        usuario.roles.push(...nuevosRoles); 
    }

    await usuario.save();
    return usuario;
}

// Función para obtener todos los usuarios
async function listarUsuarios() {
    return await Usuario.find({});
}

// Función para obtener un usuario específico por su ID
async function obtenerUsuarioPorId(id) {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    return usuario;
}

// Función para eliminar (desactivar) un usuario cambiando su estado a false
async function desactivarUsuario(id) {
    let usuario = await Usuario.findByIdAndUpdate(id, { estadoUsuario: false }, { new: true });
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    return usuario;
}

module.exports = {
    crearUsuario,
    actualizarUsuario,
    listarUsuarios,
    obtenerUsuarioPorId,
    desactivarUsuario
};
