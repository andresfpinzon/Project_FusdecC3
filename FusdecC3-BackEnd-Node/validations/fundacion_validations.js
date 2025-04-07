const Joi = require('@hapi/joi');

const fundacionSchemaValidation = Joi.object({
    nombreFundacion: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': 'El nombre de la fundacion debe ser un texto', 
            'string.empty': 'El nombre de la fundacion no debe estar vacio', 
            'string.min': 'El nombre de la fundacion debe tener al menos 3 caracteres',
            'string.max': 'El nombre de la fundacion no debe exceder los 100 caracteres',
            'any.required': 'El nombre de la fundacion es un campo requerido',
        }),

    estadoFundacion: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'El estado de la fundacion debe ser un booleano',
        }),

});

module.exports = fundacionSchemaValidation;
