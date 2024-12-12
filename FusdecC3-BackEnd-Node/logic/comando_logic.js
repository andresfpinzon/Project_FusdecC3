const Comando = require('../models/comando_model');
const comandoSchemaValidation = require('../validations/comando_validations');

// Función para listar comandos
const listarComandos = async () => {
    return await Comando.find().populate('fundacionId').populate('brigadas');
};

// Función para crear un comando
const crearComando = async (body) => {
    const comando = new Comando({
        nombreComando: body.nombreComando,
        estadoComando: body.estadoComando,
        ubicacionComando: body.ubicacionComando,
        fundacionId: body.fundacionId || null,
        brigadas: body.brigadas || []
    });
    return await comando.save();
};

// Función para actualizar un comando
const actualizarComando = async (id, body) => {
    const comando = await Comando.findById(id);
    if (!comando) {
        throw new Error(`Comando con ID ${id} no encontrado`);
    }

    // Actualizar solo los campos que se proporcionan
    if (body.nombreComando) comando.nombreComando = body.nombreComando;
    if (body.estadoComando !== undefined) comando.estadoComando = body.estadoComando;
    if (body.ubicacionComando) comando.ubicacionComando = body.ubicacionComando;
    comando.fundacionId = body.fundacionId && body.fundacionId.trim() !== "" ? body.fundacionId : null;
    comando.brigadas = body.brigadas || comando.brigadas;

    return await comando.save();
};

// Función para desactivar un comando
const desactivarComando = async (id) => {
    const comando = await Comando.findByIdAndUpdate(id, { estadoComando: false }, { new: true });
    if (!comando) {
        throw new Error(`Comando con ID ${id} no encontrado`);
    }
    return comando;
};

// Función para buscar un comando por su ID
const buscarComandoPorId = async (id) => {
    const comando = await Comando.findById(id).populate('fundacionId').populate('brigadas');
    if (!comando) {
        throw new Error(`Comando con ID ${id} no encontrado`);
    }
    return comando;
};

// Función para agregar brigadas a un comando
const agregarBrigadasAComandos = async (id, brigadaIds) => {
    const comando = await Comando.findById(id);
    if (!comando) {
        throw new Error(`Comando con ID ${id} no encontrado`);
    }
    comando.brigadas.push(...brigadaIds);
    return await comando.save();
};

module.exports = {
    listarComandos,
    crearComando,
    actualizarComando,
    desactivarComando,
    buscarComandoPorId,
    agregarBrigadasAComandos
};
