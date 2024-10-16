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
    .required()
    .messages({
        'boolean.base': 'El estado de la fundacion debe ser un booleano',
        'any.required': 'El estado de la fundacion debe ser un campo requerido', 
    }),
    ubicacionFundacion:Joi.string()
    .min(3)
    .max(300)
    .required()
    .messages({
        'string.base': 'La ubicacion de la fundacion debe ser un texto',
        'string.empty': 'La ubicacion de la fundacion no puede estar vacia',
        'string.min': 'La ubicacacion debe de tener al menos 3 caracteres',
        'string.max': 'La ubicacion no puede exceder los 288 carateres',
        'any.required':'La ubicacion es un campo requerido',
    }),

    comando:Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // Validación para ObjectId
    .optional()
    .messages({
        'array.base': 'Comandos debe ser un array',
        'string.pattern.base':'Cada comando debe tener un objectId valido de MongoDB(24 caracteres hexadecimales)',
    }),

      brigadas:Joi.array()
      .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // Validación para ObjectId
    .optional()
    .messages({
      'array.base': 'Brigadas debe ser un array',
      'string.pattern.base': 'Cada brigada debe tener un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),

});
module.exports = fundacionSchemaValidation;
