package com.example.fusdeckotlin.pruebasjson

data class PruebaAsistencia(
    val __v: Int,
    val _id: String,
    val estadoAsistencia: Boolean,
    val estudiantes: List<EstudianteJson>,
    val fechaAsistencia: String,
    val tituloAsistencia: String,
    val usuarioId: String
)