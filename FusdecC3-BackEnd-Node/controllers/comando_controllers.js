const logic = require('../logic/comando_logic');
const comandoSchemaValidation = require('../validations/comando_validations');
const Comando = require('../models/comando_model');

// Controlador para listar comandos
const listarComandos = async (_req, res) => {
    try {
        const comandos = await logic.listarComandos();
        if (comandos.length === 0) {
            return res.status(204).send(); // 204 No Content
        }
        res.json(comandos);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
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
    const { nombreComando, estadoComando, ubicacionComando, fundacionId, brigadas } = req.body;

    try {
        const comando = await Comando.findById(id);
        if (!comando) {
            return res.status(404).json({ error: 'Comando no encontrado' });
        }

        comando.nombreComando = nombreComando;
        comando.estadoComando = estadoComando;
        comando.ubicacionComando = ubicacionComando;

        if (fundacionId && fundacionId.trim() !== "") {
            comando.fundacionId = fundacionId;
        } else {
            comando.fundacionId = null;
        }

        comando.brigadas = brigadas;

        await comando.save();
        return res.status(200).json(comando);
    } catch (error) {
        console.error("Error al actualizar comando:", error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Controlador para desactivar un comando
const desactivarComando = async (req, res) => {
    const { id } = req.params;
    try {
        const comandoDesactivado = await logic.desactivarComando(id);
        if (!comandoDesactivado) {
            return res.status(404).json({ error: 'Comando no encontrado' });
        }
        res.json(comandoDesactivado);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor', details: err.message });
    }
};

// Controlador para obtener un comando por su ID
const obtenerComandoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const comando = await logic.buscarComandoPorId(id);
        if (!comando) {
            return res.status(404).json({ error: `Comando con ID ${id} no encontrado` });
        }
        res.json(comando);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor al buscar el comando', details: err.message });
    }
};
// Controlador para agregar unidades a una brigada
const agregarBrigadasAComandos = async (req, res) => {
    try {
        const { id } = req.params;
        const { brigadaIds } = req.body;

        const comando = await Comando.findById(id);
        if (!comando) {
            return res.status(404).json({ mensaje: 'comando no encontrado' });
        }

        // Agregar las nuevas unidades al array existente
        comando.brigadas = [...new Set([...comando.brigadas, ...brigadaIds])];
        
        await comando.save();

        res.status(200).json(comando);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al agregar brigadas a la comando', error: error.message });
    }
};



  // Exportar los controladores
    module.exports = {
    listarComandos,
    crearComando,
    actualizarComando,
    desactivarComando,
    obtenerComandoPorId,
    agregarBrigadasAComandos
};

























/*
// Controlador para agregar brigadas a un comando
const agregarBrigadas = async (req, res) => {
    const { comandoId } = req.params;
    const { brigadasIds } = req.body;

    if (!Array.isArray(brigadasIds) || brigadasIds.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array de IDs de brigadas' });
    }

    try {
        const comandoActualizado = await logic.agregarBrigadaAComando(comandoId, brigadasIds);
        return res.status(200).json({
            message: 'Brigadas agregadas con éxito',
            comando: comandoActualizado
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
*/