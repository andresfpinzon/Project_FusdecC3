const Joi = require('@hapi/joi');

const asistenciaSchemaValidation = Joi.object({
  tituloAsistencia: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El título de la asistencia debe ser un texto',
      'string.empty': 'El título de la asistencia no puede estar vacío',
      'string.min': 'El título de la asistencia debe tener al menos 3 caracteres',
      'string.max': 'El título de la asistencia no puede exceder los 100 caracteres',
      'any.required': 'El título de la asistencia es un campo requerido',
    }),

  fechaAsistencia: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha de asistencia debe ser una fecha válida',
      'date.empty': 'La fecha de asistencia no puede estar vacía',
      'any.required': 'La fecha de asistencia es un campo requerido',
    }),

  usuarioId: Joi.string()
    .max(450)
    .required()
    .messages({
      'string.base': 'El ID del usuario debe ser un texto',
      'string.max': 'El ID del usuario no puede exceder los 450 caracteres',
    }),

  estudiantes: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) 
    .optional()
    .messages({
      'array.base': 'Estudiantes debe ser un array',
      'string.pattern.base': 'Cada estudiante debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),
});

module.exports = asistenciaSchemaValidation;
