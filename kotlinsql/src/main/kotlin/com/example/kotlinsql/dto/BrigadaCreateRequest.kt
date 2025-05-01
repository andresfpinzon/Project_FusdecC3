package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank

data class BrigadaCreateRequest(
    @field:NotBlank(message = "El nombre de la brigada es obligatorio")
    val nombreBrigada: String,

    @field:NotBlank(message = "La ubicación de la brigada es obligatoria")
    val ubicacionBrigada: String,

    @field:NotBlank(message = "El nombre del comando es obligatorio")
    val comandoNombre: String,

    val unidadesNombres: List<String>? = null
)