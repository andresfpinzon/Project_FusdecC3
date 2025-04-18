const logic = require("../logic/colegio_logic");
const {
  colegioSchemaValidation,
} = require("../validations/colegio_validations");

// Controlador para crear un colegio
const crearColegio = async (req, res) => {
  const body = req.body;
  const { error, value } = colegioSchemaValidation.validate({
    nombreColegio: body.nombreColegio,
    emailColegio: body.emailColegio,
    estadoColegio: body.estadoColegio,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevoColegio = await logic.crearColegio(value);
    res.status(201).json(nuevoColegio);
  } catch (err) {
    if (err.message === "El colegio con este título ya existe") {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para actualizar un colegio
const actualizarColegio = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { error, value } = colegioSchemaValidation.validate({
    nombreColegio: body.nombreColegio,
    emailColegio: body.emailColegio,
    estadoColegio: body.estadoColegio,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const colegioActualizado = await logic.actualizarColegio(id, value);
    if (!colegioActualizado) {
      return res.status(404).json({ error: "Colegio no encontrado" });
    }
    res.json(colegioActualizado);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para desactivar un colegio
const desactivarColegio = async (req, res) => {
  const { id } = req.params;
  try {
    const colegioDesactivado = await logic.desactivarColegio(id);
    if (!colegioDesactivado) {
      return res.status(404).json({ error: "Colegio no encontrado" });
    }
    res.json(colegioDesactivado);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para listar los cursos activos
const listarColegiosActivos = async (req, res) => {
  try {
    const colegiosActivos = await logic.listarColegios();
    if (colegiosActivos.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(colegiosActivos);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para buscar un curso por su ID
const obtenerColegiosPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const colegio = await logic.buscarColegiosPorId(id);
    if (!colegio) {
      return res
        .status(404)
        .json({ error: `Colegio con ID ${id} no encontrado` });
    }
    res.json(colegio);
  } catch (err) {
    res.status(500).json({
      error: `Error interno del servidor al buscar el colegio: ${err.message}`,
    });
  }
};

// Exportar los controladores
module.exports = {
  crearColegio,
  actualizarColegio,
  desactivarColegio,
  listarColegiosActivos,
  obtenerColegiosPorId,
};
