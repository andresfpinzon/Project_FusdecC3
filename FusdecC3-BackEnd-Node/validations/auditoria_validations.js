const Joi = require('@hapi/joi');

const auditoriaSchemaValidation = Joi.object({
  fechaAuditoria: Joi.date()
    .iso() // Asegura que la fecha esté en formato ISO 8601
    .required()
    .messages({
      'date.base': 'La fecha de auditoría debe ser una fecha válida',
      'date.iso': 'La fecha de auditoría debe estar en formato ISO 8601',
      'any.required': 'La fecha de auditoría es un campo requerido',
    }),

  nombreEmisor: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre del emisor debe ser un texto',
      'string.empty': 'El nombre del emisor no puede estar vacío',
      'string.min': 'El nombre del emisor debe tener al menos 3 caracteres',
      'string.max': 'El nombre del emisor no puede exceder los 100 caracteres',
      'any.required': 'El nombre del emisor es un campo requerido',
    }),

  certificadoId: Joi.string()
    .length(24) // Asegura que el certificadoId tenga exactamente 24 caracteres
    .hex() // Asegura que solo contenga caracteres hexadecimales
    .required()
    .messages({
      'string.base': 'El certificadoId debe ser un texto',
      'string.empty': 'El certificadoId no puede estar vacío',
      'string.length': 'El certificadoId debe tener exactamente 24 caracteres',
      'string.hex': 'El certificadoId debe contener solo caracteres hexadecimales',
      'any.required': 'El certificadoId es un campo requerido',
    }),
  
  estadoAuditoria: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado de la auditoria debe ser verdadero o falso',
    }),
});

module.exports = auditoriaSchemaValidation;
