const Joi = require('@hapi/joi');

const brigadaSchemaValidation = Joi.object({
  nombreBrigada: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre de la brigada debe tener al menos 3 caracteres',
      'string.max': 'El nombre de la brigada no puede tener más de 50 caracteres',
      'any.required': 'El nombre de la brigada es obligatorio'
    }),
  
  comandoId: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'El comando es obligatorio'
    }),
  
  estadoBrigada: Joi.boolean()
    .optional()
    .default(true),

  horario: Joi.string()
    .valid('mañana', 'tarde')
    .default('mañana')
    .messages({
      'any.only': 'El horario debe ser "mañana" o "tarde"'
    }),

  unidades: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) // Validación para ObjectId
    .optional()
    .messages({
      'array.base': 'Unidades debe ser un array',
      'string.pattern.base': 'Cada unidad debe tener un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),
});

module.exports = brigadaSchemaValidation; 
