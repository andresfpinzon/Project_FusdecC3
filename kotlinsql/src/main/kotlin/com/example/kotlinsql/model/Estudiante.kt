package com.example.kotlinsql.model

data class Estudiante(
    val numeroDocumento: String,
    val nombre: String,
    val apellido: String,
    val tipoDocumento: String,
    val genero: String,
    val unidad: String,
    val colegio: String,
    val edicion: String,
    val grado: String,
    val estado: Boolean = true,
    val asistenciasRegistradas: Int = 0,
    val aprobado: Boolean = false
)
