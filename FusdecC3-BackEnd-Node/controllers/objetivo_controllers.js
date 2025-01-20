const logic = require("../logic/objetivo_logic");
const objetivoSchemaValidation = require("../validations/objetivo_validations");

// Controlador para crear un objetivo
const crearObjetivo = async (req, res) => {
  const body = req.body;
  const { error, value } = objetivoSchemaValidation.validate({
    tituloObjetivo: body.tituloObjetivo,
    descripcionObjetivo: body.descripcionObjetivo,
    estadoObjetivo: body.estadoObjetivo,
    cursoId: body.cursoId,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const nuevoObjetivo = await logic.crearObjetivo(value);
    res.status(201).json(nuevoObjetivo);
  } catch (err) {
    if (err.message === "El objetivo con este título ya existe") {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para actualizar un objetivo
const actualizarObjetivo = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { error, value } = objetivoSchemaValidation.validate({
    tituloObjetivo: body.tituloObjetivo,
    descripcionObjetivo: body.descripcionObjetivo,
    estadoObjetivo: body.estadoObjetivo,
    cursoId: body.cursoId,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    const objetivoActualizado = await logic.actualizarObjetivo(id, value);
    if (!objetivoActualizado) {
      return res.status(404).json({ error: "Objetivo no encontrado" });
    }
    res.json(objetivoActualizado);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para desactivar un objetivo
const desactivarObjetivo = async (req, res) => {
  const { id } = req.params;
  try {
    const objetivoDesactivado = await logic.desactivarObjetivo(id);
    if (!objetivoDesactivado) {
      return res.status(404).json({ error: "Objetivo no encontrado" });
    }
    res.json(objetivoDesactivado);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para listar los objetivos activos
const listarObjetivosActivos = async (req, res) => {
  try {
    const ObjetivosActivos = await logic.listarObjetivosActivos();
    if (objetivosActivos.length === 0) {
      return res.status(204).send(); // 204 No Content
    }
    res.json(objetivosActivos);
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Controlador para guardar una colección de objetivos
const guardarColeccionObjetivos = async (req, res) => {
    const objetivos = req.body;

    // Validación de cada objetivo en la colección
    for (let objetivo of objetivos) {
        const { error } = objetivoSchemaValidation.validate({
            titulo: objetivo.tituloObjetivo,
            descripcion: objetivo.descripcionObjetivo,
            Objetivo: objetivo.estadoObjetivo,
            cursoId: objetivo.cursoId,
        });
        if (error) {
            return res.status(400).json({ error: `Error en objetivo "${objetivo.titulo}": ${error.details[0].message}` });
        }
    }
    try {
        // Guardar la colección de objetivos
        const resultados = await logic.guardarObjetivos(objetivos);
        res.status(201).json({ message: 'Objetivos guardados exitosamente', objetivos: resultados });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al guardar objetivos', details: err.message });
    }
};


// Controlador para buscar un horario por su ID
const obtenerObjetivoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const objetivo = await logic.buscarObjetivoPorId(id);
    if (!objetivo) {
      return res
        .status(404)
        .json({ error: `Objetivo con ID ${id} no encontrado` });
    }
    res.json(objetivo);
  } catch (err) {
    res.status(500).json({
      error: `Error interno del servidor al buscar el objetivo: ${err.message}`,
    });
  }
};

module.exports = {
  crearObjetivo,
  actualizarObjetivo,
  desactivarObjetivo,
  listarObjetivosActivos,
  guardarColeccionObjetivos,
  obtenerObjetivoPorId,
};