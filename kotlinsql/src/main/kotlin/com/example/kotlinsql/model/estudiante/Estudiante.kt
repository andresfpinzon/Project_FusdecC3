package com.example.kotlinsql.model.estudiante

data class Estudiante(
    val numeroDocumento: String,
    val nombre: String,
    val apellido: String,
    val tipoDocumento: String,
    val genero: String,
    val grado: String,
    val estado: Boolean = true,
    val asistenciasRegistradas: Int = 0,
    val aprobado: Boolean = false,
    val unidadId: Int,
    val colegioId: Int,
    val edicionId: Int
)
