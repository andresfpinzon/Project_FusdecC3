package models.secretario.edicion

import java.util.*

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

    companion object {
        val edicion1 = Edicion(
            id = "EDIC01",
            tituloEdicion = "2024-1",
            fechaInicioEdicion = Date(124, 0, 1), // Corregido para que funcione correctamente
            fechaFinEdicion = Date(124, 5, 22), // Corregido para que funcione correctamente
            estadoEdicion = true,
            cursoId = "curso1",
            horarios = listOf("Lunes 8:00 - 10:00", "Miércoles 8:00 - 10:00"),
            estudiantes = listOf("1", "2", "3")
        )

        val edicion2 = Edicion(
            id = "EDIC02",
            tituloEdicion = "2024-2",
            fechaInicioEdicion = Date(124, 6, 1), // Corregido para que funcione correctamente
            fechaFinEdicion = Date(124, 11, 22), // Corregido para que funcione correctamente
            estadoEdicion = true,
            cursoId = "curso2",
            horarios = listOf("Martes 14:00 - 16:00", "Jueves 14:00 - 16:00"),
            estudiantes = listOf("4", "5")
        )

        val edicion3 = Edicion(
            id = "EDIC03",
            tituloEdicion = "2025-1",
            fechaInicioEdicion = Date(125, 0, 1), // Corregido para que funcione correctamente
            fechaFinEdicion = Date(125, 5, 22), // Corregido para que funcione correctamente
            estadoEdicion = false,
            cursoId = "curso3",
            horarios = listOf("Viernes 10:00 - 12:00"),
            estudiantes = listOf("6", "7", "8", "9")
        )
    }
}
