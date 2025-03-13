const Usuario = require('../models/usuario_model');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10; // Número de rondas de sal para el hash

// Función asíncrona para crear un usuario
async function crearUsuario(body) {
    // EXtraigo del body el correo y el numero de documento para validar
    const {correo, numeroDocumento, password, roles, estadoUsuario, nombreUsuario, apellidoUsuario} = body;
    try {
     // Buscar si ya existe un usuario con el mismo correo o documento, y ejecutar con exec()
    const existingUser = await Usuario.findOne({ $or: [{correo },{ numeroDocumento }]}).exec()
    // Si ya existe un usuario con el mismo correo o documento, lanza un error
    if(existingUser) throw new Error(`El ${existingUser.email === correo ? 'correo': 'documento'} ya esta registrado`);
    // Hashear la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(SALT_ROUNDS).catch(err => {throw new Error('Error al generar la sal', err)});
    const passwordHash = await bcrypt.hash(password, salt).catch(err => {throw new Error('Error al hashear la contraseña', err)});
    // Crear el nuevo usuario y reemplazamos el password por el hash
    const newUser = new Usuario({...body, password: passwordHash});
    // Guardar el nuevo usuario
    await newUser.save();
    // Devolver el nuevo usuario
    return newUser;
    } catch (error) {
        console.error('Error al crear el usuario (usuario_logic):', error);
        throw error;
    }

}

async function actualizarUsuario(id, body) {
    const {password} = body
    try {
        // Buscar el usuario por su ID
        const usuario = await Usuario.findById(id);
        // Verificar si el usuario existe
        if (!usuario) throw new Error('Usuario no encontrado')
        if(password){
            const salt = await bcrypt.genSalt(SALT_ROUNDS).catch(err => {throw new Error('Error al generar la sal', err)});
            body.password = await bcrypt.hash(password, salt).catch(err => {throw new Error('Error al hashear la contraseña', err)});
        }
        // Actualizar los campos del usuario y reemplazamos el password por el hash
        const updateUser = await Usuario.findByIdAndUpdate(id, body, { new: true }).exec();
        if(!updateUser) throw new Error('Error al actualizar el usuario')
        return updateUser
    } catch (error) {
        console.error('Error al actualizar el usuario (usuario_logic):', error);
        throw error;
    }
}


// Función para obtener todos los usuarios
async function listarUsuarios() {
    try {
        return await Usuario.find();
    } catch (error) {
     console.error('Error al listar los usuarios (usuario_logic):', error);
     throw error;   
    }
}

// Función para obtener un usuario específico por su ID
async function obtenerUsuarioPorId(id) {
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) throw new Error('Usuario no encontrado');
        return usuario;
    } catch (error) {
        console.error('Error al obtener el usuario por ID (usuario_logic):', error);
        throw error;
    }
}

// Función para desactivar un usuario 
async function togglerStateLogic(id) {
    try {
       const usuario = await Usuario.findById(id);
       if (!usuario) throw new Error('Usuario no encontrado');
       const newState = !usuario.estadoUsuario;
       const updatedUser = await Usuario.findByIdAndUpdate(id, { estadoUsuario: newState }, { new: true }).exec();
       if(!updatedUser) throw new Error('Error al desactivar el usuario');
       return updatedUser;
    } catch (error) {
        console.error('Error al desactivar el usuario (usuario_logic):', error);        
        throw error;
    }
}

module.exports = {
    crearUsuario,
    actualizarUsuario,
    listarUsuarios,
    obtenerUsuarioPorId,
    togglerStateLogic
};
