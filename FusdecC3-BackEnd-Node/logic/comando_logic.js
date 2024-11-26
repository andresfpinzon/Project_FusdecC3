const Comando = require('../models/comando_model');
const Fundacion = require('../models/fundacion_model');
const comandoSchemaValidation = require('../validations/comando_validations');
const mongoose = require('mongoose');
const Brigada = require('../models/brigada_model');

// Función asíncrona para crear comandos
async function crearComando(body) {
    const { error } = comandoSchemaValidation.validate(body);
    if (error) {
        throw new Error(error.details[0].message);
    }

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

// Lógica para agregar brigada a un comando
async function agregarBrigadaAComando(comandoId, brigadasIds) {
    const comando = await Comando.findById(comandoId);
    if (!comando) {
        throw new Error('Comando no encontrado');
    }

    const nuevasBrigadas = brigadasIds.filter(brigadaId => !comando.brigadas.includes(brigadaId));
    
    if (nuevasBrigadas.length === 0) {
        return comando.populate('brigadas');
    }

    comando.brigadas.push(...nuevasBrigadas);
    
    await Brigada.updateMany(
        { _id: { $in: nuevasBrigadas } },
        { $set: { comandoId: comandoId } }
    );

    await comando.save();
    return comando.populate('brigadas');
}

module.exports = {
    crearComando,
    listarComandos,
    buscarComandoPorId,
    editarComando,
    desactivarComando,
    agregarBrigadaAComando,
};
