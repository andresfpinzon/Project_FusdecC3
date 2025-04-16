package com.example.fusdeckotlin.pruebasjson

data class EstudianteJson(
    val __v: Int,
    val _id: String,
    val apellidoEstudiante: String,
    val asistencias: List<String>,
    val calificaciones: List<Any>,
    val certificados: List<Any>,
    val colegioId: String,
    val correoEstudiante: String,
    val ediciones: List<String>,
    val estadoEstudiante: Boolean,
    val fechaNacimiento: String,
    val generoEstudiante: String,
    val nombreEstudiante: String,
    val numeroDocumento: String,
    val tipoDocumento: String,
    val unidadId: String
)