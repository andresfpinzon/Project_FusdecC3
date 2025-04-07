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
    estudiantes: body.estudiantes,
  });
  if (error) {
    return res.status(400).json({ 
      error: `Error de validación: ${error.details[0].message}` 
    });
  }
  try {
    const nuevoColegio = await logic.crearColegio(value);
    res.status(201).json(nuevoColegio);
  } catch (err) {
    if (err.message === "El colegio con este título ya existe") {
      return res.status(409).json({ 
        error: "Ya existe un colegio con este nombre o email" 
      });
    }
    console.error("Error al crear colegio:", err);
    res.status(500).json({ 
      error: "Error interno del servidor al crear el colegio" 
    });
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
    estudiantes: body.estudiantes,
  });
  if (error) {
    return res.status(400).json({ 
      error: `Error de validación: ${error.details[0].message}` 
    });
  }
  try {
    const colegioActualizado = await logic.actualizarColegio(id, value);
    if (!colegioActualizado) {
      return res.status(404).json({ 
        error: "No se encontró el colegio para actualizar" 
      });
    }
    res.json(colegioActualizado);
  } catch (err) {
    console.error("Error al actualizar colegio:", err);
    res.status(500).json({ 
      error: "Error interno del servidor al actualizar el colegio" 
    });
  }
};

// Controlador para desactivar un colegio
const desactivarColegio = async (req, res) => {
  const { id } = req.params;
  try {
    const colegioDesactivado = await logic.desactivarColegio(id);
    if (!colegioDesactivado) {
      return res.status(404).json({ 
        error: "No se encontró el colegio para desactivar" 
      });
    }
    res.json(colegioDesactivado);
  } catch (err) {
    console.error("Error al desactivar colegio:", err);
    res.status(500).json({ 
      error: "Error interno del servidor al desactivar el colegio" 
    });
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
    console.error("Error al listar colegios:", err);
    res.status(500).json({ 
      error: "Error interno del servidor al listar los colegios" 
    });
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
        .json({ 
          error: `No se encontró el colegio con ID ${id}` 
        });
    }
    res.json(colegio);
  } catch (err) {
    console.error("Error al buscar colegio:", err);
    res.status(500).json({ 
      error: "Error interno del servidor al buscar el colegio" 
    });
  }
};

// Controlador para agregar estudiantes a un colegio
const agregarEstudianteAColegio = async (req, res) => {
  const { colegioId } = req.params;
  const { estudiantes } = req.body;

  if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
      return res.status(400).json({ 
        error: 'Se requiere un array de IDs de estudiantes' 
      });
  }

  try {
      const colegioActualizado = await logic.agregarEstudianteAColegio(colegioId, estudiantes);
      res.json({ colegio: colegioActualizado });
  } catch (error) {
      console.error("Error al agregar estudiantes:", error);
      res.status(500).json({ 
        error: "Error interno del servidor al agregar estudiantes" 
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
  agregarEstudianteAColegio
};
