const logic = require('../logic/comando_logic');
const comandoSchemaValidation = require('../validations/comando_validations');

// Controlador para listar comandos
const listarComandos = async (_req, res) => {
    try {
        const comandos = await logic.listarComandos();
        
        if (comandos.length === 0) {
            return res.status(204).send(); // 204 No Content
        }
        
        res.json(comandos);
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar los comandos', details: error.message });
    }
};

// Controlador para crear un comando
const crearComando = async (req, res) => {
    const { error, value } = comandoSchemaValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const nuevoComando = await logic.crearComando(value);
        res.status(201).json(nuevoComando);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para actualizar un comando
const actualizarComando = async (req, res) => {
    const { id } = req.params;
    try {
        const comandoActualizado = await logic.actualizarComando(id, req.body);
        res.status(200).json(comandoActualizado);
    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para desactivar un comando
const desactivarComando = async (req, res) => {
    const { id } = req.params;
    try {
        const comandoDesactivado = await logic.desactivarComando(id);
        res.json(comandoDesactivado);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener un comando por su ID
const obtenerComandoPorId = async (req, res) => {
    try {
        const comando = await Comando.findById(req.params.id)
            .populate({
                path: 'fundacionId',
                select: 'nombreFundacion' // Mostrar solo el nombre de la fundación
            })
            .populate({
                path: 'brigadas',
                select: 'nombreBrigada' // Mostrar solo el nombre de las brigadas
            });
        
        if (!comando) {
            return res.status(404).json({ error: 'Comando no encontrado' });
        }

        res.json(comando);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el comando' });
    }
};

// Controlador para agregar unidades a una brigada
const agregarBrigadasAComandos = async (req, res) => {
    const { id } = req.params;
    const { brigadaIds } = req.body;

    if (!Array.isArray(brigadaIds)) {
        return res.status(400).json({ 
            mensaje: 'brigadaIds debe ser un array de IDs' 
        });
    }

    try {
        const comandoActualizado = await logic.agregarBrigadasAComandos(id, brigadaIds);
        res.status(200).json({
            mensaje: 'Brigadas agregadas exitosamente',
            comando: comandoActualizado
        });
    } catch (error) {
        res.status(500).json({ 
            mensaje: 'Error al agregar brigadas al comando', 
            error: error.message 
        });
    }
};

// Controlador para obtener fundaciones asignadas a comandos
const obtenerFundacionesAsignadas = async (req, res) => {
    try {
        const comandos = await Comando.find()
            .populate('fundaciones', 'nombreFundacion');
        
        const result = comandos.map(comando => ({
            comandoId: comando._id,
            fundacionIds: comando.fundaciones.map(f => f._id),
            fundaciones: comando.fundaciones
        }));

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Exportar los controladores
module.exports = {
    crearComando,
    listarComandos,
    obtenerComandoPorId,
    actualizarComando,
    desactivarComando,
    agregarBrigadasAComandos,
    obtenerFundacionesAsignadas
};