package com.example.kotlinsql.dto.edicion

data class UpdateEdicionDto(
    val titulo: String?,
    val fechaInicio: String?,
    val fechaFin: String?,
    val cursoId: Long?,
)