package com.example.kotlinsql.dto.asistencia

import java.time.LocalDate

data class AsistenciaUpdateRequest(
    val titulo: String? = null,
    val fecha: LocalDate? = null,
    val estado: Boolean? = null
)
