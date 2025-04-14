package com.example.kotlinsql.dto

import jakarta.validation.constraints.*

data class CalificacionEstudianteCreateRequest(
    @field:NotNull(message = "El ID de la calificación es obligatorio")
    val calificacionId: Int,

    @field:NotBlank(message = "El ID del estudiante es obligatorio")
    val estudianteId: String
)
