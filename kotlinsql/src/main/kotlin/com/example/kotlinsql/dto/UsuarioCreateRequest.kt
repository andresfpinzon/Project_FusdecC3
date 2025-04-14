package com.example.kotlinsql.dto

import jakarta.validation.constraints.*

data class UsuarioCreateRequest(
    @NotBlank(message = "El número de documento es obligatorio")
    val numeroDocumento: String,

    @NotBlank(message = "El nombre es obligatorio")
    val nombre: String,

    @NotBlank(message = "El apellido es obligatorio")
    val apellido: String,

    @Email(message = "El correo no es válido")
    @NotBlank(message = "El correo es obligatorio")
    val correo: String,

    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    val password: String
)
