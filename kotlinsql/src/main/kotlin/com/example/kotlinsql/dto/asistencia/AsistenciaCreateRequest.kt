package com.example.kotlinsql.dto.asistencia

import jakarta.validation.constraints.*
import java.time.LocalDate

data class AsistenciaCreateRequest(
    @NotBlank(message = "El título es obligatorio")
    val titulo: String,

    @NotNull(message = "La fecha es obligatoria")
    val fecha: LocalDate,

    @NotBlank(message = "El ID del usuario es obligatorio")
    val usuarioId: String
)
