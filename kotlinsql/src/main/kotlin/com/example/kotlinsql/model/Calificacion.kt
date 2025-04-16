package com.example.kotlinsql.model

data class Calificacion(
    val id: Int,
    val titulo: String,
    val aprobado: Boolean,
    val usuarioId: String?,
    val estado: Boolean = true,
    val edicion: String,
    val unidad: String,
    val createdAt: String
)
