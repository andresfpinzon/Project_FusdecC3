package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class BrigadaCreateRequest(
    @field:NotBlank(message = "El nombre de la brigada es obligatorio")
    val nombreBrigada: String,

    @field:NotBlank(message = "La ubicación de la brigada es obligatoria")
    val ubicacionBrigada: String,

    @field:NotNull(message = "El nombre del comando es obligatorio")
    val comandoId: Int,

)