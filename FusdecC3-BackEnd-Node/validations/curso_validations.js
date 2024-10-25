const Joi = require("@hapi/joi");

const cursoSchemaValidation = Joi.object({
  nombreCurso: Joi.string().min(3).max(100).required().messages({
    "string.base": "El nombre del curso debe ser un texto",
    "string.empty": "El nombre del curso no puede estar vacío",
    "string.min": "El nombre del curso debe tener al menos 3 caracteres",
    "string.max": "El nombre del curso no puede exceder los 100 caracteres",
    "any.required": "El nombre del curso es un campo requerido",
  }),

  descripcionCurso: Joi.string().optional().allow("").messages({
    "string.base": "La descripción del curso debe ser un texto",
  }),

  intensidadHorariaCurso: Joi.string().min(1).max(50).required().messages({
    "string.base": "La intensidad horaria del curso debe ser un texto",
    "string.empty": "La intensidad horaria del curso no puede estar vacía",
    "string.min":
      "La intensidad horaria del curso debe tener al menos 1 carácter",
    "string.max":
      "La intensidad horaria del curso no puede exceder los 50 caracteres",
    "any.required": "La intensidad horaria del curso es un campo requerido",
  }),

  estadoCurso: Joi.boolean().default(true).messages({
    "boolean.base": "El estado del curso debe ser un booleano",
  }),

  fundacionId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .allow(null)
    .messages({
      "string.pattern.base":
        "EL id de la funcacion debe ser un id válido (24 caracteres hexadecimales)",
    }),

  ediciones: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      "array.base": "Ediciones debe ser un array",
      "string.pattern.base":
        "Cada edición debe tener un id válido (24 caracteres hexadecimales)",
    }),
});

module.exports = { cursoSchemaValidation };
