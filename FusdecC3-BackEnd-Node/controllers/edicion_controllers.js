const logic = require("../logic/edicion_logic");
const edicionSchemaValidation = require("../validations/edicion_validations");

// Controlador para crear una edicion
const crearEdicion = async (req, res) => {
    const body = req.body;
    const { error, value } = edicionSchemaValidation.validate({
        tituloEdicion: body.tituloEdicion,
        fechaInicioEdicion: body.fechaInicioEdicion,
        fechaFinEdicion: body.fechaFinEdicion,
        estadoEdicion: body.estadoEdicion,
        cursoId: body.cursoId,
        horarios: body.horarios,
        estudiantes: body.estudiantes,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    try {
      const nuevaEdicion = await logic.crearEdicion(value);
      res.status(201).json(nuevaEdicion);
    } catch (err) {
      if (err.message === "La edicion con este título ya existe") {
        return res.status(409).json({ error: err.message });
      }
      res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador para actualizar una edicion
const actualizarEdicion = async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const { error, value } = edicionSchemaValidation.validate({
        tituloEdicion: body.tituloEdicion,
        fechaInicioEdicion: body.fechaInicioEdicion,
        fechaFinEdicion: body.fechaFinEdicion,
        horarios: body.horarios,
        estudiantes: body.estudiantes,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    try {
      const edicionActualizada = await logic.actualizarEdicion(id, value);
      if (!edicionActualizada) {
        return res.status(404).json({ error: "edicion no encontrado" });
      }
      res.json(edicionActualizada);
    } catch (err) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador para desactivar una edicion
const desactivarEdicion = async (req, res) => {
    const { id } = req.params;
    try {
      const edicionDesactivada = await logic.desactivarEdicion(id);
      if (!edicionDesactivada) {
        return res.status(404).json({ error: "Edicion no encontrada" });
      }
      res.json(edicionDesactivada);
    } catch (err) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador para listar las ediciones activas
const listarEdicionesActivas = async (req, res) => {
    try {
      const edicionesActivas = await logic.listarEdicionesActivas();
      if (edicionesActivas.length === 0) {
        return res.status(204).send(); // 204 No Content
      }
      res.json(edicionesActivas);
    } catch (err) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Controlador para buscar una edicion por su ID
const obtenerEdicionPorId = async (req, res) => {
    const { id } = req.params;
    try {
      const edicion = await logic.buscarEdicionPorId(id);
      if (!edicion) {
        return res
          .status(404)
          .json({ error: `Edicion con ID ${id} no encontrado` });
      }
      res.json(edicion);
    } catch (err) {
      res
        .status(500)
        .json({
          error: `Error interno del servidor al buscar la edicion: ${err.message}`,
        });
    }
};

module.exports = {
    crearEdicion,
    actualizarEdicion,
    desactivarEdicion,
    listarEdicionesActivas,
    obtenerEdicionPorId
};