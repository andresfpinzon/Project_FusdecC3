const Joi = require('@hapi/joi');

const unidadSchemaValidation = Joi.object({

  nombreUnidad: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre de la unidad debe ser un texto',
      'string.empty': 'El nombre de la unidad no puede estar vacío',
      'string.min': 'El nombre de la unidad debe tener al menos 3 caracteres',
      'string.max': 'El nombre de la unidad no puede exceder los 100 caracteres',
      'any.required': 'El nombre de la unidad es un campo requerido',
    }),

  estadoUnidad: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado de la unidad debe ser un booleano',
    }),

  brigadaId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Validación para ObjectId
    .required()
    .messages({
      'string.base': 'El brigadaId debe ser un texto',
      'string.empty': 'El brigadaId no puede estar vacío',
      'string.pattern.base': 'El brigadaId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El brigadaId es un campo requerido',
    }),
  
  usuarioId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Corregido a 24 caracteres para ObjectId
    .required()
    .messages({
      'string.base': 'El usuarioId debe ser un texto',
      'string.empty': 'El usuarioId no puede estar vacío',
      'string.pattern.base': 'El usuarioId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El usuarioId es un campo requerido',
    }),

  estudiantes: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // Validación para ObjectId
    .optional()
    .messages({
      'array.base': 'Estudiantes debe ser un array',
      'string.pattern.base': 'Cada estudiante debe tener un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),
});

module.exports = unidadSchemaValidation;
