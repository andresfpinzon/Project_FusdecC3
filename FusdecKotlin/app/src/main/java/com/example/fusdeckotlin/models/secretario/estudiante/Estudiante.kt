package com.example.fusdeckotlin.models.secretario.estudiante

data class Estudiante(
    val id: String,
    val nombreEstudiante: String,
    val apellidoEstudiante: String,
    val correoEstudiante: String,
    val tipoDocumento: String,
    val numeroDocumento: String,
    val fechaNacimiento: String,  // Puede ser Date en caso necesario
    val generoEstudiante: String,
    val unidadId: String,
    val colegioId: String,
    val estadoEstudiante: Boolean,
    val ediciones: List<String>? = null, // Relación con ediciones
    val calificaciones: List<String>? = null, // Relación con calificaciones
    val asistencias: List<String>? = null, // Relación con asistencias
    val certificados: List<String>? = null // Referencias a Certificados
)
