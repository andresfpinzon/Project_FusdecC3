const Fundacion = require('../models/fundacion_model');
const Comando = require('../models/comando_model'); 
fundacionSchemaValidation = require('../validations/fundacion_validations');
// Funcion asincrona para crear fundaciones
async function crearFundacion( body ) {
    try {
        
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
    } catch (error) {
        console.error('Error al crear la fundacion (fundacion_logic):', error);
        throw error;
    }
}


// Funcion asincrona para listar fundaciones 
async  function listarFundaciones(){
    try {
     
    return await Fundacion.find()
    .populate('comando');   
    } catch (error) {
        console.error('Error al listar las fundaciones (fundacion_logic):', error);
        throw error;
    }

}

//funcion asincrona para buscar una fundacion por su id 
async function buscarFundacionPorId(id){
    try {
        const fundacion = await Fundacion.findById(id).populate('comando');
        if(!fundacion){
            throw new Error('Fundacion con ID ${id} no encontrada');
        }
        return fundacion;
    } catch (error) {
        console.error('Error al buscar la fundacion (fundacion_logic):', error);
        throw error;
    }
    
}

    //Funcion asincrona para editar una fundacion
async function editarFundacion(id, body){
    try {
        const fundacion = await Fundacion.findByIdAndUpdate(id, body, { new : true })
        .populate('comando');
         if (!fundacion){
            throw new Error('Fundacion con ID ${ID} no encotrada');
         }
         return fundacion;
    } catch (error) {
        console.error('Error al editar la fundacion (fundacion_logic):', error);
        throw error;
    }

}





async function desactivarFundacion(id){
    try {
        const fundacion = await Fundacion.findByIdAndUpdate(id, { estadoFundacion: false},{ new : true }); 
        if(!fundacion) throw new Error('Fundacion con ID ${ID} no encontrada'); 
        return fundacion; 
    } catch (error) {
        console.error('Error al desactivar la fundacion (fundacion_logic):', error);
        throw error;
    }
            
}
module.exports={
        crearFundacion,
        listarFundaciones,
        buscarFundacionPorId,
        editarFundacion,
        desactivarFundacion,
};

