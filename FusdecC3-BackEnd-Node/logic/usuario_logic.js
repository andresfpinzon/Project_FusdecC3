const Usuario = require('../models/usuario_model');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10; // Número de rondas de sal para el hash

// Función asíncrona para crear un usuario
async function crearUsuario(body) {
    const usuarioExistente = await Usuario.findOne({
        $or: [
            { correo: body.correo },
            { numeroDocumento: body.numeroDocumento }
        ]
    });
    
    if (usuarioExistente) {
        if (usuarioExistente.correo === body.correo) {
            throw new Error('El correo electrónico ya está registrado');
        }
        if (usuarioExistente.numeroDocumento === body.numeroDocumento) {
            throw new Error('El número de documento ya está registrado');
        }
    }
    

    // Hashear la contraseña antes de guardarla
    const contraseñaHash = await bcrypt.hash(body.contraseñaHash, SALT_ROUNDS).catch(err => {
    throw new Error('Error al hashear la contraseña');
    });


    let usuario = new Usuario({
        nombreUsuario: body.nombreUsuario,
        apellidoUsuario: body.apellidoUsuario,
        numeroDocumento: body.numeroDocumento,
        correo: body.correo,
        contraseñaHash: contraseñaHash, // Guardar el hash en lugar de la contraseña real
        roles: body.roles || [],// Si hay roles en el cuerpo de la solicitud, se agregan
        estadoUsuario: body.estadoUsuario,
        creadoEn: body.creadoEn,
         
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
    // Solo actualizar el hash de la contraseña si se proporciona una nueva contraseña
    if (body.contraseñaHash) {
        usuario.contraseñaHash = await bcrypt.hash(body.contraseñaHash, SALT_ROUNDS);
    }
    usuario.estadoUsuario = body.estadoUsuario || usuario.estadoUsuario;
    usuario.creadoEn = body.creadoEn || usuario.estadoUsuario;

    // Si se están pasando roles, evitamos duplicados
    if (body.roles && body.roles.length > 0) {
        const nuevosRoles = body.roles.filter(rolId => !usuario.roles.includes(rolId));
        usuario.roles.push(...nuevosRoles); 
    }

    await usuario.save();
    return Usuario.findById(id).populate('roles');
}

// Función para obtener todos los usuarios
async function listarUsuarios() {
    return await Usuario.find({}).populate('roles');
}

// Función para obtener un usuario específico por su ID
async function obtenerUsuarioPorId(id) {
    const usuario = await Usuario.findById(id)
    .populate('roles');
    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }
    return usuario;
}

// Función para desactivar un usuario 
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
