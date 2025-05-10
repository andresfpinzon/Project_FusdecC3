package com.example.kotlinsql.model.asistencia

data class Asistencia(
    val id: Int,
    val titulo: String,
    val fecha: String,
    val usuarioId: String,
    val estado: Boolean = true,
    val createdAt: String
)
