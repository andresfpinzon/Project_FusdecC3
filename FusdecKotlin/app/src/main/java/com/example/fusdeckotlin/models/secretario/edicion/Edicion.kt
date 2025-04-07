package models.secretario.edicion

import java.util.Date

class Edicion(
    private val id: String,
    private var tituloEdicion: String,
    private var fechaInicioEdicion: Date,
    private var fechaFinEdicion: Date,
    private var estadoEdicion: Boolean = true,
    private var cursoId: String,
    private var horarios: List<String>,
    private var estudiantes: List<String>
) {
    // Getters
    fun getId(): String = id
    fun getTituloEdicion(): String = tituloEdicion
    fun getFechaInicioEdicion(): Date = fechaInicioEdicion
    fun getFechaFinEdicion(): Date = fechaFinEdicion
    fun getEstadoEdicion(): Boolean = estadoEdicion
    fun getCursoId(): String = cursoId
    fun getHorarios(): List<String> = horarios
    fun getEstudiantes(): List<String> = estudiantes

    // Setters
    fun setTituloEdicion(titulo: String) {
        this.tituloEdicion = titulo
    }

    fun setFechaInicioEdicion(fecha: Date) {
        this.fechaInicioEdicion = fecha
    }

    fun setFechaFinEdicion(fecha: Date) {
        this.fechaFinEdicion = fecha
    }

    fun setEstadoEdicion(estado: Boolean) {
        this.estadoEdicion = estado
    }

    fun setCursoId(cursoId: String) {
        this.cursoId = cursoId
    }

    fun setHorarios(horarios: List<String>) {
        this.horarios = horarios
    }

    fun setEstudiantes(estudiantes: List<String>) {
        this.estudiantes = estudiantes
    }

}
