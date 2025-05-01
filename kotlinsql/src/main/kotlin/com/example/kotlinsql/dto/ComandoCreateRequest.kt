package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank

data class ComandoCreateRequest(
    @field:NotBlank(message = "El nombre del comando es obligatorio")
    val nombreComando: String,

    @field:NotBlank(message = "La ubicación del comando es obligatoria")
    val ubicacionComando: String,

    val fundacionNombre: String? = null
)