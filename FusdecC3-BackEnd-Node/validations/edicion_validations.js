const Joi = require('@hapi/joi');

const edicionSchemaValidation = Joi.object({

  tituloEdicion: Joi.string()
    .min(3)
    .max(10)
    .required()
    .messages({
      'string.base': 'El título de la edición debe ser un texto',
      'string.empty': 'El título de la edición no puede estar vacío',
      'string.min': 'El título de la edición debe tener al menos 3 caracteres',
      'string.max': 'El título de la edición no puede exceder los 10 caracteres',
      'any.required': 'El título de la edición es un campo requerido',
    }),

  fechaInicioEdicion: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha de inicio de la edición debe ser una fecha válida',
      'any.required': 'La fecha de inicio de la edición es un campo requerido',
    }),

  fechaFinEdicion: Joi.date()
    .greater(Joi.ref('fechaInicioEdicion')) // Asegura que la fecha de fin sea posterior a la de inicio
    .required()
    .messages({
      'date.base': 'La fecha de fin de la edición debe ser una fecha válida',
      'date.greater': 'La fecha de fin debe ser posterior a la fecha de inicio',
      'any.required': 'La fecha de fin de la edición es un campo requerido',
    }),

  estadoEdicion: Joi.boolean()
    .optional()
    .messages({
      'boolean.base': 'El estado de la edición debe estar activo o inactivo',
    }),

  cursoId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'El id del curso debe ser un id válido (24 caracteres hexadecimales)',
    }),

  horarios: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      'array.base': 'Horarios debe ser un array',
      'string.pattern.base': 'Cada horario debe ser un id válido (24 caracteres hexadecimales)',
    }),

  estudiantes: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      'array.base': 'Estudiantes debe ser un array',
      'string.pattern.base': 'Cada estudiante debe ser un id válido (24 caracteres hexadecimales)',
    }),
});

module.exports = edicionSchemaValidation;