const Joi = require("@hapi/joi");

const objetivoSchemaValidation = Joi.object({
  TituloObjetivo: Joi.string().min(3).max(30).required().messages({
    "string.base": "El título del objetivo debe ser un texto",
    "string.empty": "El título del objetivo no puede estar vacío",
    "string.min": "El título del objetivo debe tener al menos 3 caracteres",
    "string.max": "El título del objetivo no puede exceder los 30 caracteres",
    "any.required": "El título del objetivo es un campo requerido",
    }),

  descripcionObjetivo: Joi.string().min(20).max(1000).required().messages({
      "string.base": "La descripción del objetivo debe ser un texto",
      "string.empty": "La descripción del objetivo no puede estar vacía",
      "string.min": "La descripción del objetivo debe tener al menos 20 caracteres",
      "string.max": "La descripción del objetivo no puede exceder los 1000 caracteres",
      "any.required": "La descripción del objetivo es un campo requerido",
    }),

  cursoId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'El ID del curso debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El ID del curso es un campo requerido',
    }),

  estadoObjetivo: Joi.boolean().default(true).messages({
    "boolean.base": "El estado del objetivo debe ser un booleano",
  }),
});

module.exports = objetivoSchemaValidation;