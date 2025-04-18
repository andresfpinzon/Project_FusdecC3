package com.example.kotlinsql.dto

import jakarta.validation.constraints.*

data class AsistenciaEstudianteCreateRequest(
    @field:NotNull(message = "El ID de asistencia es obligatorio")
    val asistenciaId: Int,

    @field:NotBlank(message = "El ID del estudiante es obligatorio")
    val estudianteId: String
)
