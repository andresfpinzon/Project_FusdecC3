const Fundacion = require('../models/Fundacion_model');
const Comando = require('../models/Comando_model'); 
// fundacionSchemaValiadation = require('..validations/fundacion_validations');
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
        editarFundacion,
        desactivarFundacion,
     }; 


        
        




