package com.example.kotlinsql.dto

data class EstudianteUpdateRequest(
    val nombre: String? = null,
    val apellido: String? = null,
    val tipoDocumento: String? = null,
    val genero: String? = null,
    val grado: String? = null,
    val estado: Boolean? = null,
    val unidadId: Int? = null,
    val colegioId: Int? = null,
    val edicionId: Int? = null
)