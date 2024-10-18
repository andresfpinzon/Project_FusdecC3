const Joi = require("@hapi/joi");

const colegioSchemaValidation = Joi.object({
  nombreColegio: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre del colegio debe ser un texto",
    "string.empty": "El nombre del colegio no puede estar vacío",
    "string.min": "El nombre del colegio debe tener al menos 3 caracteres",
    "string.max": "El nombre del colegio no puede exceder los 100 caracteres",
    "any.required": "El nombre del colegio es un campo requerido",
  }),

  emailColegio: Joi.string().email().required().messages({
    "string.email": "El correo debe ser un correo electrónico válido",
    "string.empty": "El correo no puede estar vacío",
    "any.required": "El correo es un campo requerido",
  }),
  estadoColegio: Joi.boolean()
  .default(true)
  .messages({
    'boolean.base': 'El estado del colegio debe ser un booleano',
  }),

  estudiantes: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      "array.base": "Estudiantes debe ser un array",
      "string.pattern.base":
        "Cada estudiante debe tener un id válido (24 caracteres hexadecimales)",
    }),
});

module.exports = colegioSchemaValidation;
