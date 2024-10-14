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
    .required()
    .messages({
      'boolean.base': 'El estado de la unidad debe ser un booleano',
      'any.required': 'El estado de la unidad es un campo requerido',
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
    .max(450)
    .required()
    .messages({
      'string.base': 'El ID del usuario debe ser un texto',
      'string.max': 'El ID del usuario no puede exceder los 450 caracteres',
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
