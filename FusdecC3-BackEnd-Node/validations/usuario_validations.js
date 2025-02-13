const Joi = require('@hapi/joi');
const { ERoles } = require('../enums/rolesEnum');

const usuarioSchemaValidation = Joi.object({
  nombreUsuario: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El nombre del usuario debe ser un texto',
      'string.empty': 'El nombre del usuario no puede estar vacío',
      'string.min': 'El nombre del usuario debe tener al menos 3 caracteres',
      'string.max': 'El nombre del usuario no puede exceder los 100 caracteres',
      'any.required': 'El nombre del usuario es un campo requerido',
    }),

  apellidoUsuario: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'El apellido del usuario debe ser un texto',
      'string.empty': 'El apellido del usuario no puede estar vacío',
      'string.min': 'El apellido del usuario debe tener al menos 3 caracteres',
      'string.max': 'El apellido del usuario no puede exceder los 100 caracteres',
      'any.required': 'El apellido del usuario es un campo requerido',
    }),

  numeroDocumento: Joi.string()
    .min(7)
    .max(15)
    .required()
    .messages({
      'string.base': 'El número de documento debe ser un texto',
      'string.empty': 'El número de documento no puede estar vacío',
      'string.min': 'El número de documento debe tener al menos 7 caracteres',
      'string.max': 'El número de documento no puede exceder los 15 caracteres',
      'any.required': 'El número de documento es un campo requerido',
    }),

  correo: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El correo debe ser un correo electrónico válido',
      'string.empty': 'El correo no puede estar vacío',
      'any.required': 'El correo es un campo requerido',
    }),

  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.base': 'La contraseña debe ser un texto',
      'string.empty': 'La contraseña no puede estar vacía',
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es un campo requerido',
    }),

  roles: Joi.array()
    .items(Joi.string().valid(...Object.values(ERoles)))
    .optional()
    .messages({
      'array.base': 'Roles debe ser un array',
      'any.only': 'Cada rol debe ser uno de los siguientes: ' + Object.values(ERoles).join(', '),
    }),

  estadoUsuario: Joi.boolean()
    .default(true)
    .messages({
      'boolean.base': 'El estado del usuario debe ser un booleano',
    }),

  creadoEn: Joi.date()
    .default(() => new Date())
    .optional()
    .messages({
      'date.base': 'La fecha de creación debe ser una fecha válida',
    }),
});

// Para el mensaje específico de actualización
const crearSchemaValidation = usuarioSchemaValidation.fork(['password'], (field) =>
  field.required()
);

module.exports = { usuarioSchemaValidation, crearSchemaValidation };

