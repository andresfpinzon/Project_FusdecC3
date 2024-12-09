const Comando = require('../models/comando_model');
const Fundacion = require('../models/fundacion_model');
const brigadas = require('../models/brigada_model');

// Función asíncrona para crear comandos
async function crearComando(body) {
    const comando = new Comando({
        nombreComando: body.nombreComando,
        estadoComando: body.estadoComando,
        ubicacionComando: body.ubicacionComando,
        fundacionId: body.fundacionId || null,
        brigadas: body.brigadas || []
    });

    return await comando.save();
}

// Función asíncrona para listar comandos
async function listarComandos() {
    return await Comando.find()
        .populate('fundacionId')
        .populate('brigadas');
}

// Función asíncrona para buscar un comando por su ID
async function buscarComandoPorId(id) {
    const comando = await Comando.findById(id)
        .populate('fundacionId')
        .populate('brigadas');
    if (!comando) {
        throw new Error(`Comando con ID ${id} no encontrado`);
    }
    return comando;
}

// Función asíncrona para editar un comando
async function editarComando(id, body) {
    const comando = await Comando.findById(id);
    if (!comando) {
        throw new Error(`Comando con ID ${id} no encontrado`);
    }

    // Actualizar el comando
    comando.nombreComando = body.nombreComando || comando.nombreComando;
    comando.estadoComando = body.estadoComando !== undefined ? body.estadoComando : comando.estadoComando;
    comando.ubicacionComando = body.ubicacionComando || comando.ubicacionComando;
    comando.fundacionId = body.fundacionId || comando.fundacionId;
    comando.brigadas = body.brigadas || comando.brigadas;

    return await comando.save();
}

// Función asíncrona para desactivar un comando
async function desactivarComando(id) {
    const comando = await Comando.findByIdAndUpdate(id, { estadoComando: false }, { new: true });
    if (!comando) {
        throw new Error(`Comando con ID ${id} no encontrado`);
    }
    return comando;
}

module.exports = {
    crearComando,
    listarComandos,
    buscarComandoPorId,
    editarComando,
    desactivarComando
};
