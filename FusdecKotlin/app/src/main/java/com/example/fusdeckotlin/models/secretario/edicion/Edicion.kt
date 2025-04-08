package com.example.fusdeckotlin.models.secretario.edicion

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

class Edicion(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreEdicion") private var nombreEdicion: String,
    @SerializedName("fechaInicio") private var fechaInicioString: String,
    @SerializedName("fechaFin") private var fechaFinString: String,
    @SerializedName("cursoId") private var cursoId: String,
    @SerializedName("instructorId") private var instructorId: String,
    @SerializedName("estadoEdicion") private var estadoEdicion: Boolean = true,
    @SerializedName("estudiantes") private var estudiantes: List<Any> = emptyList()
) {
    // Getters
    fun getId(): String = id
    fun getNombreEdicion(): String = nombreEdicion

    fun getFechaInicio(): LocalDate {
        return LocalDate.parse(fechaInicioString.substring(0, 10))
    }

    fun getFechaFin(): LocalDate {
        return LocalDate.parse(fechaFinString.substring(0, 10))
    }

    fun getCursoId(): String = cursoId
    fun getInstructorId(): String = instructorId
    fun getEstadoEdicion(): Boolean = estadoEdicion

    fun getEstudiantesIds(): List<String> {
        return estudiantes.map {
            when (it) {
                is String -> it
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    // Setters
    fun setNombreEdicion(nombre: String) {
        this.nombreEdicion = nombre
    }

    fun setFechaInicio(fecha: LocalDate) {
        this.fechaInicioString = fecha.toString()
    }

    fun setFechaFin(fecha: LocalDate) {
        this.fechaFinString = fecha.toString()
    }

    fun setCursoId(cursoId: String) {
        this.cursoId = cursoId
    }

    fun setInstructorId(instructorId: String) {
        this.instructorId = instructorId
    }

    fun setEstadoEdicion(estado: Boolean) {
        this.estadoEdicion = estado
    }

    fun setEstudiantesIds(estudiantesIds: List<String>) {
        this.estudiantes = estudiantesIds
    }

    override fun toString(): String {
        return "Edicion(id='$id', nombre='$nombreEdicion', " +
                "fechaInicio=${getFechaInicio()}, fechaFin=${getFechaFin()}, " +
                "cursoId='$cursoId', instructorId='$instructorId', " +
                "estudiantes=${getEstudiantesIds().joinToString()})"
    }
}