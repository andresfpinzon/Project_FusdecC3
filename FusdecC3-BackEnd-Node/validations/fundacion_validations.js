const Joi= require('@hapi/joi');

const fundacionSchemaValidation =Joi.object({
    nombreFundacion: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
        'string.base': 'El nombre de la fundacion debe ser un texto', 
        'string.empty': 'El nombre de la fundacion no debe esstar vacio', 
        'string.min':'El nombre de la fundacion debe tener al menos 3 caracteres',
        'string.max':'El nombre de la fundacion no debe exceder los 100 caracteres',
        'any.required': 'El nombre de la fundacion es un campo requerido',
    }),

    estadoFundacion:Joi.boolean()
    .default(true)
    .messages({
        'boolean.base': 'El estado de la fundacion debe ser un booleano',
    }),

    comando:Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // Validación para ObjectId
    .optional()
    .messages({
        'array.base': 'Comandos debe ser un array',
        'string.pattern.base':'Cada comando debe tener un objectId valido de MongoDB(24 caracteres hexadecimales)',
    }),

});
module.exports = fundacionSchemaValidation;
