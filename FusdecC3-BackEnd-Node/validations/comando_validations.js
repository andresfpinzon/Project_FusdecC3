const Joi = require('@hapi/joi');

const comandoSchemaValidation = Joi.object({

  nombreComando: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre del comando debe ser un texto',
      'string.empty': 'El nombre del comando no puede estar vacío',
      'string.min': 'El nombre del comando debe tener al menos 3 caracteres',
      'string.max': 'El nombre del comando no puede exceder los 100 caracteres',
      'any.required': 'El nombre del comando es un campo requerido',
    }),

  estadoComando: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'El estado del comando debe ser un booleano',
      'any.required': 'El estado del comando es un campo requerido',
    }),

  ubicacionComando: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.base': 'La ubicación del comando debe ser un texto',
      'string.empty': 'La ubicación del comando no puede estar vacía',
      'string.min': 'La ubicación del comando debe tener al menos 3 caracteres',
      'string.max': 'La ubicación del comando no puede exceder los 200 caracteres',
      'any.required': 'La ubicación del comando es un campo requerido',
    }),

  fundacionId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Validación para ObjectId
    .required()
    .messages({
      'string.base': 'El fundacionId debe ser un texto',
      'string.empty': 'El fundacionId no puede estar vacío',
      'string.pattern.base': 'El fundacionId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El fundacionId es un campo requerido',
    }),

  brigadas: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // Validación para ObjectId
    .optional()
    .messages({
      'array.base': 'Brigadas debe ser un array',
      'string.pattern.base': 'Cada brigada debe tener un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),
});

module.exports = comandoSchemaValidation;