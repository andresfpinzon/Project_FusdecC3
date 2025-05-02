package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class ComandoCreateRequest(
    @field:NotBlank(message = "El nombre del comando es obligatorio")
    val nombreComando: String,

    @field:NotBlank(message = "La ubicación del comando es obligatoria")
    val ubicacionComando: String,

    @field:NotNull(message = "El nombre de la fundacion es obligatorio")
    val fundacionId: Int
)