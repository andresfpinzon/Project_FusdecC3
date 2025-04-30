package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank

class ColegioCreateRequest (

    @NotBlank(message = "El Nombre es obligatorio")
    val nombreColegio: String,

    @NotBlank(message = "El correo es obligatorio")
    val emailColegio: String,

)