package com.example.kotlinsql.dto

data class CalificacionUpdateRequest(
    val titulo: String? = null,
    val aprobado: Boolean? = null,
    val usuarioId: String? = null,
    val estado: Boolean? = null,
    val edicion: String? = null,
    val unidad: String? = null
)
