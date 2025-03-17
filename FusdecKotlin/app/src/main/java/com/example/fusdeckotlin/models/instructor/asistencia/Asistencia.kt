package com.example.fusdeckotlin.models.instructor.asistencia

import java.time.LocalDate

class Asistencia(
    private val id: String,
    private var tituloAsistencia: String,
    private var fechaAsistencia: LocalDate,
    private var usuarioId: String,
    private var estadoAsistencia: Boolean = true,
    private var estudiantes: List<String>
) {
    // Getters
    fun getId(): String = id
    fun getTituloAsistencia(): String = tituloAsistencia
    fun getFechaAsistencia(): LocalDate = fechaAsistencia
    fun getUsuarioId(): String = usuarioId
    fun getEstadoAsistencia(): Boolean = estadoAsistencia
    fun getEstudiantes(): List<String> = estudiantes

    // Setters
    fun setTituloAsistencia(titulo: String) {
        this.tituloAsistencia = titulo
    }

    fun setFechaAsistencia(fecha: LocalDate) {
        this.fechaAsistencia = fecha
    }

    fun setUsuarioId(usuarioId: String) {
        this.usuarioId = usuarioId
    }

    fun setEstadoAsistencia(estado: Boolean) {
        this.estadoAsistencia = estado
    }

    fun setEstudiantes(estudiantes: List<String>) {
        this.estudiantes = estudiantes
    }

    companion object {
        val asistencia1 = Asistencia(
            id = "ASIS01",
            tituloAsistencia = "2025/03/14",
            fechaAsistencia = LocalDate.of(2025, 3, 14),
            usuarioId = "USR123456",
            estadoAsistencia = true,
            estudiantes = listOf("EST01", "EST02")
        )

        val asistencia2 = Asistencia(
            id = "ASIS02",
            tituloAsistencia = "2025/03/13",
            fechaAsistencia = LocalDate.of(2025,3,13),
            usuarioId = "USR654321",
            estadoAsistencia = true,
            estudiantes = listOf("EST04", "EST05")
        )
    }
}

