package com.example.kotlinsql.dto

data class EstudianteUpdateRequest(
    val nombre: String? = null,
    val apellido: String? = null,
    val tipoDocumento: String? = null,
    val genero: String? = null,
    val unidad: String? = null,
    val colegio: String? = null,
    val grado: String? = null,
    val edicion: String? = null,
    val estado: Boolean? = null
)