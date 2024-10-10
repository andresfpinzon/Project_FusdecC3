const Joi = require('@hapi/joi');

const usuarioSchemaValidation = Joi.object({
  nombreUsuario: Joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/)
    .messages({
      'string.base': 'El nombre de usuario debe ser un texto',
      'string.empty': 'El nombre de usuario no puede estar vacío',
      'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
      'string.max': 'El nombre de usuario no puede exceder los 30 caracteres',
      'string.pattern.base': 'El nombre de usuario solo puede contener letras y espacios',
      'any.required': 'El nombre de usuario es un campo requerido',
    }),

  correo: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'edu', 'co'] }
    })
    .required()
    .messages({
      'string.base': 'El correo debe ser un texto',
      'string.email': 'El correo debe ser una dirección de correo válida',
      'string.empty': 'El correo no puede estar vacío',
      'any.required': 'El correo es un campo requerido',
    }),

  contraseña: Joi.string()
    .min(6)
    .max(30)
    .required()
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?ñÑ]{6,30}$/)
    .messages({
      'string.base': 'La contraseña debe ser un texto',
      'string.empty': 'La contraseña no puede estar vacía',
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'string.max': 'La contraseña no puede exceder los 30 caracteres',
      'string.pattern.base': 'La contraseña solo puede contener letras, números y ciertos caracteres especiales',
      'any.required': 'La contraseña es un campo requerido',
    }),

  roles: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)) 
    .optional()
    .messages({
      'array.base': 'Los roles deben ser un array',
      'string.pattern.base': 'Cada rol debe ser un ID de MongoDB válido (24 caracteres hexadecimales)',
    }),

  creadoEn: Joi.date()
    .default(() => new Date())
    .optional()
    .messages({
      'date.base': 'La fecha de creación debe ser una fecha válida',
    }),
});

module.exports = usuarioSchemaValidation;
