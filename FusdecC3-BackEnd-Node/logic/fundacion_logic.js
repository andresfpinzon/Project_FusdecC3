const Fundacion = require('../models/fundacion_model');
const Comando = require('../models/comando_model'); 
fundacionSchemaValidation = require('../validations/fundacion_validations');
// Funcion asincrona para crear fundaciones
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
// Funcion asincrona para listar fundaciones 
async  function listarFundaciones(){
    return await Fundacion.find()
    .populate('comando');

}
//funcion asincrona para buscar una fundacion por su id 
async function buscarFundacionPorId(id){
    const fundacion = await Fundacion.findById(id)
    .populate('comando');
    if(!fundacion){
        throw new Error('Fundacion con ID ${id} no encontrada');
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
        .populate('comando');
         if (!fundacion){
            throw new Error('Fundacion con ID ${ID} no encotrada');
         }
         return fundacion; 
        }
        //Fundacion asincrona para desactivar un comando 
        async function desactivarFundacion(id){
            const fundacion = await Fundacion.findByIdAndUpdate(id, { estadoFundacion: false},{ new : true }); 
            if(!fundacion){
                throw new Error('Fundacion con ID ${ID} no encontrada'); 
            }
                return fundacion; 
     }
     module.exports={
        crearFundacion,
        listarFundaciones,
        buscarFundacionPorId,
        agregarComando,
        editarFundacion,
        desactivarFundacion,
     };

