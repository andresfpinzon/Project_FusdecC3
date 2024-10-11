const Joi = require("@hapi/joi");

const horarioSchemaValidation = Joi.object({
  tituloHorario: Joi.string().min(3).max(100).required().messages({
    "string.base": "El título del horario debe ser un texto",
    "string.empty": "El título del horario no puede estar vacío",
    "string.min": "El título del horario debe tener al menos 3 caracteres",
    "string.max": "El título del horario no puede exceder los 100 caracteres",
    "any.required": "El título del horario es un campo requerido",
  }),

  horaInicio: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // Formato HH:mm
    .required()
    .messages({
      "string.base": "La hora de inicio debe ser un texto",
      "string.empty": "La hora de inicio no puede estar vacía",
      "string.pattern.base":
        "La hora de inicio debe tener el formato HH:mm, ejemplo: 12:00",
      "any.required": "La hora de inicio es un campo requerido",
    }),

  horaFin: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // Formato HH:mm
    .required()
    .messages({
      "string.base": "La hora de fin debe ser un texto",
      "string.empty": "La hora de fin no puede estar vacía",
      "string.pattern.base":
        "La hora de fin debe tener el formato HH:mm, ejemplo: 12:00",
      "any.required": "La hora de fin es un campo requerido",
    }),

  estadoHorario: Joi.boolean().optional().messages({
    "boolean.base": "El estado del horario debe estar activo o inactivo",
  }),
});

module.exports = horarioSchemaValidation;
