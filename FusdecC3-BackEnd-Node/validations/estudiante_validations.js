const Joi = require('@hapi/joi');

const estudianteSchemaValidation = Joi.object({
  nombreEstudiante: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre del estudiante debe ser un texto',
      'string.empty': 'El nombre del estudiante no puede estar vacío',
      'string.min': 'El nombre del estudiante debe tener al menos 3 caracteres',
      'string.max': 'El nombre del estudiante no puede exceder los 100 caracteres',
      'any.required': 'El nombre del estudiante es un campo requerido',
    }),

  apellidoEstudiante: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El apellido del estudiante debe ser un texto',
      'string.empty': 'El apellido del estudiante no puede estar vacío',
      'string.min': 'El apellido del estudiante debe tener al menos 3 caracteres',
      'string.max': 'El apellido del estudiante no puede exceder los 100 caracteres',
      'any.required': 'El apellido del estudiante es un campo requerido',
    }),

  tipoDocumento: Joi.string()
    .valid('C.C', 'T.I', 'Otro')  
    .required()
    .messages({
      'string.base': 'El tipo de documento debe ser un texto',
      'any.only': 'El tipo de documento debe ser válido (C.C, T.I, Otro)',
      'any.required': 'El tipo de documento es un campo requerido',
    }),

  numeroDocumento: Joi.string()
    .min(7)
    .max(15)
    .required()
    .messages({
      'string.base': 'El número de documento debe ser un texto',
      'string.min': 'El número de documento debe tener al menos 7 caracteres',
      'string.max': 'El número de documento no puede exceder los 15 caracteres',
      'any.required': 'El número de documento es un campo requerido',
    }),

  fechaNacimiento: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha de nacimiento debe ser una fecha válida',
      'any.required': 'La fecha de nacimiento es un campo requerido',
    }),

  generoEstudiante: Joi.string()
    .valid('Masculino', 'Femenino', 'Otro')  
    .required()
    .messages({
      'string.base': 'El género debe ser un texto',
      'any.only': 'El género debe ser Masculino, Femenino o Otro',
      'any.required': 'El género es un campo requerido',
    }),

  unidadId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'El ID de la unidad debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El ID de la unidad es un campo requerido',
    }),

  colegioId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'El ID del colegio debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
      'any.required': 'El ID del colegio es un campo requerido',
    }),

  estadoEstudiante: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado del estudiante debe ser un booleano',
    }),

  ediciones: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      'array.base': 'Ediciones debe ser un array',
      'string.pattern.base': 'Cada edición debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),

  calificaciones: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      'array.base': 'Calificaciones debe ser un array',
      'string.pattern.base': 'Cada calificación debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),

  asistencias: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      'array.base': 'Asistencias debe ser un array',
      'string.pattern.base': 'Cada asistencia debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),

  certificados: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .messages({
      'array.base': 'Certificados debe ser un array',
      'string.pattern.base': 'Cada certificado debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)',
    }),
});

module.exports = estudianteSchemaValidation;
