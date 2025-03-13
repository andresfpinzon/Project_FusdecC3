const logic = require('../logic/usuario_logic');
const { usuarioSchemaValidation, crearSchemaValidation } = require('../validations/usuario_validations');


// Controlador para listar todos los usuarios
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await logic.listarUsuarios();
    if (usuarios.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para crear un usuario
const crearUsuario = async (req, res) => {
  const body = req.body;
  const { error, value } = crearSchemaValidation.validate({
    nombreUsuario: body.nombreUsuario,
    apellidoUsuario: body.apellidoUsuario,
    numeroDocumento: body.numeroDocumento,
    correo: body.correo,
    password: body.password,
    roles: body.roles
    
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevoUsuario = await logic.crearUsuario(value);
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    if (err.message) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const body = req.body;


  // Validamos la entrada, sin incluir la contraseña en la validación a menos que esté presente
  const { error, value } = usuarioSchemaValidation.validate({
    nombreUsuario: body.nombreUsuario,
    apellidoUsuario: body.apellidoUsuario,
    numeroDocumento: body.numeroDocumento,
    correo: body.correo,
    roles: body.roles,
    estadoUsuario: body.estadoUsuario,
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const usuarioActualizado = await logic.actualizarUsuario(id, body);
    
    if (!usuarioActualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuarioActualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// Controlador para desactivar un usuario
const toggleStateController = async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioDesactivado = await logic.togglerStateLogic(id);
    if (!usuarioDesactivado) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuarioDesactivado);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para obtener un usuario por su ID
const obtenerUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await logic.obtenerUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: `Usuario con ID ${id} no encontrado` });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
  toggleStateController
};
