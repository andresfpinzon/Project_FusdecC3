const Joi = require('@hapi/joi');

const rolSchemaValidation = Joi.object({
  nombreRol: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/) 
    .messages({
      'string.base': 'El nombre del rol debe ser un texto',
      'string.empty': 'El nombre del rol no puede estar vacío',
      'string.min': 'El nombre del rol debe tener al menos 3 caracteres',
      'string.max': 'El nombre del rol no puede exceder los 30 caracteres',
      'string.pattern.base': 'El nombre del rol solo puede contener letras y espacios',
      'any.required': 'El nombre del rol es un campo requerido',
    }),

    estadoRol: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado del usuario debe ser un booleano',
    }),

});

module.exports = rolSchemaValidation;
