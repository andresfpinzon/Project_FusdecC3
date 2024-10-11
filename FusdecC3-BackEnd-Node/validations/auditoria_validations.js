const Joi = require('@hapi/joi');

const auditoriaSchemaValidation = Joi.object({
  auditoriaId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Validación para ObjectId
    .optional()
    .messages({
      'string.pattern.base': 'El auditoriaId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),

  fechaAuditoria: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha de auditoría debe ser una fecha válida',
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
    .pattern(/^[0-9a-fA-F]{24}$/) // Validación para ObjectId
    .required()
    .messages({
      'string.base': 'El certificadoId debe ser un texto',
      'string.empty': 'El certificadoId no puede estar vacío',
      'string.pattern.base': 'El certificadoId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El certificadoId es un campo requerido',
    }),
});

module.exports = auditoriaSchemaValidation;
