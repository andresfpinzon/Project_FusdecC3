const Joi = require('@hapi/joi');

const certificadoSchemaValidation = Joi.object({

  fechaEmision: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha de emisión debe ser una fecha válida',
      'date.empty': 'La fecha de emisión no puede estar vacía',
      'any.required': 'La fecha de emisión es un campo requerido',
    }),
  
  codigoVerificacion: Joi.string()
    .min(5)
    .max(20)
    .required()
    .messages({
      'string.base': 'El código de verificación debe ser un texto',
      'string.empty': 'El código de verificación no puede estar vacío',
      'string.min': 'El código de verificación debe tener al menos 5 caracteres',
      'string.max': 'El código de verificación no puede exceder los 20 caracteres',
      'any.required': 'El código de verificación es un campo requerido',
    }),
  nombreEmisorCertificado: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre del emisor del certificado debe ser un texto',
      'string.empty': 'El nombre del emisor del certificado no puede estar vacío',
      'string.min': 'El nombre del emisor del certificado debe tener al menos 3 caracteres',
      'string.max': 'El nombre del emisor del certificado debe exceder los 100 caracteres',
      'any.required': 'El nombre del emisor del certificado es un campo requerido',
    }),
  estadoCertificado: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado del certificado debe ser un booleano',
    }),
  estudianteId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Validación para ObjectId
    .required()
    .messages({
      'string.base': 'El estudianteId debe ser un texto',
      'string.empty': 'El estudianteId no puede estar vacío',
      'string.pattern.base': 'El estudianteId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),
  cursoId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Validación para ObjectId
    .required()
    .messages({
      'string.base': 'El cursoId debe ser un texto',
      'string.empty': 'El cursoId no puede estar vacío',
      'string.pattern.base': 'El cursoId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El cursoId es un campo requerido',
    }),
  usuarioId: Joi.string()
    .max(450)
    .required()
    .messages({
      'string.base': 'El ID del usuario debe ser un texto',
      'string.max': 'El ID del usuario no puede exceder los 450 caracteres',
    }),
});

module.exports = certificadoSchemaValidation;
