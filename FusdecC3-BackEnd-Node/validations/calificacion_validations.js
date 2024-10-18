const Joi = require("@hapi/joi");

const CalificacionSchemaValidation = Joi.object({
  tituloCalificacion: Joi.string().min(3).max(30).required().messages({
    "string.base": "El título de la nota debe ser un texto",
    "string.empty": "El título de la nota no puede estar vacío",
    "string.min": "El título de la nota debe tener al menos 3 caracteres",
    "string.max": "El título de la nota no puede exceder los 30 caracteres",
    "any.required": "El título de la nota es un campo requerido",
  }),

  aprobado: Joi.boolean()
  .required()
  .messages({
    "boolean.base": "la calificacion debe ser aprobo o no aprobo",
    "any.required": "El estado de aprobación es un campo requerido",
  }),

  usuarioId: Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/) // Validación para ObjectId
    .required()
    .messages({
      'string.base': 'El id del usuario debe ser un texto',
      'string.empty': 'El id del usuario no puede estar vacío',
      'string.pattern.base': 'El id del usuario debe tener un id válido (24 caracteres hexadecimales)',
      'any.required': 'El id del usuario es un campo requerido',
  }),

estadoCalificacion: Joi.boolean()
  .default(true)
  .messages({
    'boolean.base': 'El estado de la calificacion debe ser un booleano',
  }),
  estudiantes: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      "array.base": "Estudiantes debe ser un array",
      "string.pattern.base": "Cada estudiante debe tener un id válido (24 caracteres hexadecimales)",
    }),
});

module.exports = CalificacionSchemaValidation;
