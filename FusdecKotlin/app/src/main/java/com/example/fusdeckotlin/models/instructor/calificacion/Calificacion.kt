package com.example.fusdeckotlin.models.instructor.calificacion

class Calificacion(
    private val id: String,
    private var tituloCalificacion: String,
    private var aprobado: Boolean,
    private var usuarioId: String,
    private var estadoCalificacion: Boolean,
    private var estudiantes: List<String>
) {

    // Getters
    fun getId(): String = id
    fun getTituloCalificacion(): String = tituloCalificacion
    fun getAprobado(): Boolean = aprobado
    fun getUsuarioId(): String = usuarioId
    fun getEstadoCalificacion(): Boolean = estadoCalificacion
    fun getEstudiantes(): List<String> = estudiantes

    // Setters

    // Setters
    fun setTituloCalificacion(titulo: String) {
        this.tituloCalificacion = titulo
    }

    fun setAprobado(aprobado: Boolean) {
        this.aprobado = aprobado
    }

    fun setUsuarioId(usuarioId: String) {
        this.usuarioId = usuarioId
    }

    fun setEstadoCalificacion(estado: Boolean) {
        this.estadoCalificacion = estado
    }

    fun setEstudiantes(estudiantes: List<String>) {
        this.estudiantes = estudiantes
    }

    companion object {
        val calificacion1 = Calificacion(
            id = "CAL01",
            tituloCalificacion = "Servicio Social Aprobados",
            aprobado = true,
            usuarioId = "USR123456",
            estadoCalificacion = true,
            estudiantes = listOf("1", "2")
        )

        val calificacion2 = Calificacion(
            id = "CAL02",
            tituloCalificacion = "Servicio Social Reprobados",
            aprobado = false,
            usuarioId = "USR654321",
            estadoCalificacion = true,
            estudiantes = listOf("2", "3")
        )
    }
}