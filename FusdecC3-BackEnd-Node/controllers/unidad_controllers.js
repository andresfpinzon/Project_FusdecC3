const logic = require('../logic/unidad_logic');
const unidadSchemaValidation = require('../validations/unidad_validations');
const Unidad = require('../models/unidad_model');
const Brigada = require('../models/brigada_model');

// Controlador para listar unidades
const listarUnidades = async (req, res) => {
    try {
        const unidades = await Unidad.find(); // Asegúrate de que esto devuelva un array
        res.json(unidades);
    } catch (error) {
        console.error('Error al cargar las unidades:', error); // Agrega esto para depuración
        res.status(500).json({ error: 'Error al cargar las unidades' });
    }
};

// Controlador para crear una unidad
const crearUnidad = async (req, res) => {
    try {
        // Validar los datos de entrada
        const { error, value } = unidadSchemaValidation.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { nombreUnidad, estadoUnidad, brigadaId, usuarioId} = value; 
        const unidad = new Unidad({
            nombreUnidad,
            estadoUnidad,
            brigadaId,
            usuarioId,
        });
        
        // Guardar la unidad
        const savedUnidad = await unidad.save();
        
        // Si hay una brigada asignada, actualizar la brigada también
        if (brigadaId) {
            await Brigada.findByIdAndUpdate(
                brigadaId,
                { $push: { unidades: savedUnidad._id } },
                { new: true }
            );
        }

        res.status(201).json(savedUnidad);
    } catch (error) {
        console.error(error); // Registrar el error en el log
        res.status(500).json({ message: 'Error al crear unidad', details: error.message });
    }
};

// Controlador para actualizar una unidad
const actualizarUnidad = async (req, res) => {
    const { id } = req.params;
    const { error, value } = unidadSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const unidadActualizada = await logic.editarUnidad(id, value);
        if (!unidadActualizada) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.json(unidadActualizada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para desactivar una unidad
const desactivarUnidad = async (req, res) => {
    const { id } = req.params;
    try {
        const unidadDesactivada = await logic.desactivarUnidad(id);
        if (!unidadDesactivada) {
            return res.status(404).json({ error: 'Unidad no encontrada' });
        }
        res.json(unidadDesactivada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener una unidad por su ID
const obtenerUnidadPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const unidad = await logic.buscarUnidadPorId(id);
        if (!unidad) {
            return res.status(404).json({ error: `Unidad con ID ${id} no encontrada` });
        }
        res.json(unidad); // Ahora incluirá estudiantes
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar la unidad', details: err.message });
    }
};

// Controlador para buscar unidades por brigadaId
const buscarUnidadesPorBrigadaId = async (req, res) => {
    const { brigadaId } = req.params;
    try {
        const unidades = await logic.buscarUnidadesPorBrigadaId(brigadaId);
        if (!unidades || unidades.length === 0) {
            return res.status(404).json({ error: `No se encontraron unidades para la brigada con ID ${brigadaId}` });
        }
        res.json(unidades);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar unidades por brigada', details: err.message });
    }
};

// Controlador para buscar unidades por usuarioId
const buscarUnidadesPorUsuarioId = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const unidades = await logic.buscarUnidadesPorUsuarioId(usuarioId);
        if (!unidades || unidades.length === 0) {
            return res.status(404).json({ error: `No se encontraron unidades para el usuario con ID ${usuarioId}` });
        }
        res.json(unidades);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar unidades por usuario', details: err.message });
    }
};

const obtenerEstudiantesPorUnidad = async (req, res) => {
    try {
        const { id } = req.params;
        const unidad = await Unidad.findById(id).populate('estudiantes');
        
        if (!unidad) {
            return res.status(404).json({ mensaje: "Unidad no encontrada" });
        }

        res.json(unidad.estudiantes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener estudiantes", error: error.message });
    }
};

// Exportar los controladores
module.exports = {
    listarUnidades,
    crearUnidad,
    actualizarUnidad,
    desactivarUnidad,
    obtenerUnidadPorId,
    buscarUnidadesPorBrigadaId,
    buscarUnidadesPorUsuarioId,
    obtenerEstudiantesPorUnidad
};
