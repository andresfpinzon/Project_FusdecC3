package com.example.kotlinsql.dto.edicion

data class CreateEdicionDto(
    val titulo: String,
    val fechaInicio: String,
    val fechaFin: String,
    val cursoId: Long,
)