const logic = require("../logic/horario_logic");
const {
  horarioSchemaValidation,
} = require("../validations/horario_validation");

// Controlador para crear un horario
const crearHorario = async (req, res) => {
  const body = req.body;
  const { error, value } = horarioSchemaValidation.validate({
    tituloHorario: body.tituloHorario,
    horaInicio: body.horaInicio,
    horaFin: body.horaFin,
    estadoHorario: body.estadoHorario,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevoHorario = await logic.crearHorario(value);
    res.status(201).json(nuevoHorario);
  } catch (err) {
    if (err.message === "El horario con este título ya existe") {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para actualizar un horario
const actualizarHorario = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { error, value } = horarioSchemaValidation.validate({
    tituloHorario: body.tituloHorario,
    horaInicio: body.horaInicio,
    horaFin: body.horaFin,
    estadoHorario: body.estadoHorario
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const horarioActualizado = await logic.actualizarHorario(id, value);
    if (!horarioActualizado) {
      return res.status(404).json({ error: "Horario no encontrado" });
    }
    res.json(horarioActualizado);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para desactivar un horario
const desactivarHorario = async (req, res) => {
  const { id } = req.params;
  try {
    const horarioDesactivado = await logic.desactivarHorario(id);
    if (!horarioDesactivado) {
      return res.status(404).json({ error: "Horario no encontrado" });
    }
    res.json(horarioDesactivado);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para listar los cursos activos
const listarHorariosActivos = async (req, res) => {
  try {
    const horariosActivos = await logic.listarHorariosActivos();
    if (horariosActivos.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(horariosActivos);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para guardar una colección de horarios
const guardarColeccionHorarios = async (req, res) => {
  const horarios = req.body;

  // Validación de cada horario en la colección
  for (let horario of horario) {
    const { error } = horarioSchemaValidation.validate({
      tituloHorario: body.tituloHorario,
      horaInicio: body.horaInicio,
      horaFin: body.horaFin,
      estadoHorario: body.estadoHorario,
    });
    if (error) {
      return res.status(400).json({
        error: `Error en horario "${horario.tituloHorario}": ${error.details[0].message}`,
      });
    }
  }
  try {
    // Guardar la colección de horarios
    const resultados = await logic.guardarHorarios(horarios);
    res
      .status(201)
      .json({
        message: "Horarios guardados exitosamente",
        horarios: resultados,
      });
  } catch (err) {
    res.status(500).json({
      error: "Error interno del servidor al guardar horarios",
      details: err.message,
    });
  }
};

// Controlador para buscar un horario por su ID
const obtenerHorarioPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const horario = await logic.buscarHorarioPorId(id);
    if (!horario) {
      return res
        .status(404)
        .json({ error: `Horario con ID ${id} no encontrado` });
    }
    res.json(horario);
  } catch (err) {
    res.status(500).json({
      error: `Error interno del servidor al buscar el horario: ${err.message}`,
    });
  }
};

module.exports = {
  crearHorario,
  actualizarHorario,
  desactivarHorario,
  listarHorariosActivos,
  guardarColeccionHorarios,
  obtenerHorarioPorId,
};