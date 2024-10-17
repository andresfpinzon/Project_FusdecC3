const Joi = require('@hapi/joi');

const brigadaSchemaValidation = Joi.object({
  nombreBrigada: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre de la brigada debe ser un texto',
      'string.empty': 'El nombre de la brigada no puede estar vacío',
      'string.min': 'El nombre de la brigada debe tener al menos 3 caracteres',
      'string.max': 'El nombre de la brigada no puede exceder los 100 caracteres',
      'any.required': 'El nombre de la brigada es un campo requerido',
    }),

  ubicacionBrigada: Joi.string()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.base': 'La ubicación de la brigada debe ser un texto',
      'string.empty': 'La ubicación de la brigada no puede estar vacía',
      'string.min': 'La ubicación de la brigada debe tener al menos 3 caracteres',
      'string.max': 'La ubicación de la brigada no puede exceder los 200 caracteres',
      'any.required': 'La ubicación de la brigada es un campo requerido',
    }),

  estadoBrigada: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'El estado de la brigada debe ser un booleano',
      'any.required': 'El estado de la brigada es un campo requerido',
    }),

  comandoId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/) // Validación para ObjectId
    .required()
    .messages({
      'string.base': 'El comandoId debe ser un texto',
      'string.empty': 'El comandoId no puede estar vacío',
      'string.pattern.base': 'El comandoId debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El comandoId es un campo requerido',
    }),

  unidades: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // Validación para ObjectId
    .optional()
    .messages({
      'array.base': 'Unidades debe ser un array',
      'string.pattern.base': 'Cada unidad debe tener un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),
});

module.exports = brigadaSchemaValidation; // Asegúrate de que se esté exportando
