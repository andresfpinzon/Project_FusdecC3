const logic = require('../logic/fundacion_logic');
const fundacionSchemaValidation = require('../validations/fundacion_validations');

// Controlador para listar fundaciones 
const listarFundaciones = async (_req, res) => {
    try {
        const fundaciones = await logic.listarFundaciones();
        if (fundaciones.length === 0) {
            return res.status(204).send(); // 204 No Content
        }
        res.json(fundaciones);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para crear una fundacion
const crearFundacion = async (req, res) => {
    const { error, value } = fundacionSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const nuevaFundacion = await logic.crearFundacion(value);
        res.status(201).json(nuevaFundacion);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};


// Controlador para desactivar una fundacion
const desactivarFundacion = async (req, res) => {
    const { id } = req.params;
    try {
        const fundacionDesactivada = await logic.desactivarFundacion(id);
        if (!fundacionDesactivada) {
            return res.status(404).json({ error: 'Fundacion no encontrada' });
        }
        res.json(fundacionDesactivada);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener una fundacion por su ID
const obtenerFundacionPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const  fudacion = await logic.buscarFundacionPorId(id);
        if (!fundacion) {
            return res.status(404).json({ error: 'Fundacion con ID ${id} no encontrada' });
        }
        res.json(fundacion);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar la fundacion', details: err.message });
    }
};

// Controlador para buscar comandos por fundacionId
const buscarComandoPorFundacionId = async (req, res) => {
    const { fundacionId } = req.params;
    try {
        const  comandos  = await logic.buscarComandosPorFundacionId(fundacionId);
        if (!brigadas || comandos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron comandos para la fundacion con ID ${fundacionId}' });
                
        }
        res.json(comandos);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar comandos por fundacion', details: err.message });
    }
};


// Exportar los controladores
module.exports = {
    listarFundaciones,
    crearFundacion,
    desactivarFundacion,
    obtenerFundacionPorId,
    buscarComandoPorFundacionId,
    
};
