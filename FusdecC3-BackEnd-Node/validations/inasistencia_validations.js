const Joi = require('@hapi/joi');

const inasistenciaSchemaValidation = Joi.object({
  tituloInasistencia: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El título de la inasistencia debe ser un texto',
      'string.empty': 'El título de la inasistencia no puede estar vacío',
      'string.min': 'El título de la inasistencia debe tener al menos 3 caracteres',
      'string.max': 'El título de la inasistencia no puede exceder los 100 caracteres',
      'any.required': 'El título de la inasistencia es un campo requerido',
    }),

  observacion: Joi.string()
    .min(5)
    .max(500)
    .required()
    .messages({
      'string.base': 'La observación debe ser un texto',
      'string.empty': 'La observación no puede estar vacía',
      'string.min': 'La observación debe tener al menos 5 caracteres',
      'string.max': 'La observación no puede exceder los 500 caracteres',
      'any.required': 'La observación es un campo requerido',
    }),

  usuarioId: Joi.string()
    .max(450)
    .required()
    .messages({
      'string.base': 'El ID del usuario debe ser un texto',
      'string.max': 'El ID del usuario no puede exceder los 450 caracteres',
    }),
    
  idAsistencia: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) 
    .required()
    .messages({
      'string.base': 'El ID de la asistencia debe ser un texto',
      'string.empty': 'El ID de la asistencia no puede estar vacío',
      'string.pattern.base': 'El ID de la asistencia debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El ID de la asistencia es un campo requerido',
    }),
  estadoInasistencia: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado de la inasistencia debe ser un booleano',
    }),

  estudiantes: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) 
    .optional()
    .messages({
      'array.base': 'Estudiantes debe ser un array',
      'string.pattern.base': 'Cada estudiante debe tener un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),
});

module.exports = inasistenciaSchemaValidation;
