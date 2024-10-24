const Comando = require('../models/comando_model');
const Fundacion = require('../models/fundacion_model');
const comandoSchemaValidation = require('../validations/comando_validations');

// Función asíncrona para crear comandos
async function crearComando(body) {
    // Validar los datos de entrada
    const { error } = comandoSchemaValidation.validate(body);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const comando = new Comando({
        nombreComando: body.nombreComando,
        estadoComando: body.estadoComando,
        ubicacionComando: body.ubicacionComando,
        fundacionId: body.fundacionId,
        brigadas: body.brigadas || [] // Asegurarse de que brigadas sea un array
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
    const comando = await Comando.findByIdAndUpdate(id, body, { new: true })
        .populate('fundacionId')
        .populate('brigadas');
    if (!comando) {
        throw new Error(`Comando con ID ${id} no encontrado`);
    }
    return comando;
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