const Fundacion = require('../models/fundacion_model');
const Comando = require('../models/comando_model'); 
fundacionSchemaValiadation = require('..validations/fundacion_validations');
// Fundacion asincrona para crear fundaciones
async function crearFundacion( body ) {// validar los datos de entrada 
    const {error} = fundacionSchemaValidation.validate(body); 
    if (error){
        throw new Error(error.details[0].message);
    }

    const fundacion = new Fundacion({

        nombreFundacion: body.nombreFundacion,
        estadoFundacion: body.estadoFundacion,
        comando : body.comando ||[] // asegurarse que comando sea un array 
    });
    return await fundacion.save();
}
// Funcion asincrona para alistar fundaciones 
async  function listarFundacion(){
    return await Fundacion.find()
    .populate('Comandos');

}
//funcion asincrona para buscar una fundacion por su id 
async function buscarFundacionPorId(id){
    const Fundacion = await Fundacion.findById(id)
    .populate('Comandos');
    if(!fundacion){
        throw new Error('Fundacion con ID ${id} no encontrado');
    }
    return fundacion;
    }


    // Logica para agregar comandos a fundacion 
     async  function agregarComando(fundacionId, comandoId) {
        try{
              const fundacion = await Fundacion.findOne({ fundacionId });
              if (!fundacion){
                 throw new Error('Fundacion no encontrada');
              }            
        } catch(Error){
            throw new Error('Fundacion no encontrada');
        }

     }


    //Funcion asincrona para editar una fundacion
    async function editarFundacion(id, body){
        const fundacion = await Fundacion.findByIdAndUpdate(id, body, { new : true })
        .populate('Comandos');
         if (!fundacion){
            throw new Error('Fundacion con ID ${ID} no encotrado');
         }
         return fundacion; 
        }
        //Fundacion asincrona para desactivar un comando 
        async function desactivarFundacion(id){
            const fundacion = await Fundacion.findByIdAndUpdate(id, {/*no se actualiza el esstado*/},{ new : true }); 
            if(!fundacion){
                throw new Error('Fundacion con ID ${ID} no encontrado'); 
            }
                return fundacion; 
     }
     module.exports={
        crearFundacion,
        buscarFundacionPorId,
        agregarComando,
        editarFundacion,
        desactivarFundacion,
     };