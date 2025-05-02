package com.example.kotlinsql.dto.unidad

data class CreateUnidadDto(
    val nombreUnidad: String,
    val brigadaId: Int,
    val usuarioId: String
)
