package com.example.fusdeckotlin.models.secretario.edicion

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
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
    // Getters básicos
    fun getId(): String = id
    fun getNombreEdicion(): String = nombreEdicion

    fun getFechaInicio(): LocalDate = LocalDate.parse(fechaInicioString.substring(0, 10))
    fun getFechaFin(): LocalDate = LocalDate.parse(fechaFinString.substring(0, 10))

    fun getCursoId(): String = cursoId
    fun getInstructorId(): String = instructorId
    fun getEstadoEdicion(): Boolean = estadoEdicion

    // Obtener estudiantes como objetos completos
    fun getEstudiantes(): List<Estudiante> {
        return estudiantes.mapNotNull {
            when (it) {
                is Estudiante -> it
                is String -> crearEstudianteVacio(it)
                is Map<*, *> -> convertMapToEstudiante(it)
                else -> null
            }
        }
    }

    // Obtener solo IDs de estudiantes
    fun getEstudiantesIds(): List<String> {
        return estudiantes.map {
            when (it) {
                is Estudiante -> it.getId()
                is String -> it
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    // Helper para crear estudiante vacío
    private fun crearEstudianteVacio(id: String): Estudiante {
        return Estudiante(
            id = id,
            nombreEstudiante = "",
            apellidoEstudiante = "",
            correoEstudiante = "",
            tipoDocumento = "",
            numeroDocumento = "",
            fechaNacimientoString = LocalDate.now().toString(),
            generoEstudiante = "",
            unidadId = "",
            colegioId = "",
            estadoEstudiante = true,
            ediciones = emptyList(),
            calificaciones = emptyList(),
            asistencias = emptyList(),
            certificados = emptyList()
        )
    }

    // Conversor de Map a Estudiante con todos los campos
    private fun convertMapToEstudiante(map: Map<*, *>): Estudiante {
        return Estudiante(
            id = map["_id"] as? String ?: "",
            nombreEstudiante = map["nombreEstudiante"] as? String ?: "",
            apellidoEstudiante = map["apellidoEstudiante"] as? String ?: "",
            correoEstudiante = map["correoEstudiante"] as? String ?: "",
            tipoDocumento = map["tipoDocumento"] as? String ?: "",
            numeroDocumento = map["numeroDocumento"] as? String ?: "",
            fechaNacimientoString = (map["fechaNacimiento"] as? String)?.take(10) ?: LocalDate.now().toString(),
            generoEstudiante = map["generoEstudiante"] as? String ?: "",
            unidadId = map["unidadId"] as? String ?: "",
            colegioId = map["colegioId"] as? String ?: "",
            estadoEstudiante = map["estadoEstudiante"] as? Boolean ?: true,
            ediciones = map["ediciones"] as? List<String> ?: emptyList(),
            calificaciones = map["calificaciones"] as? List<String> ?: emptyList(),
            asistencias = map["asistencias"] as? List<String> ?: emptyList(),
            certificados = map["certificados"] as? List<String> ?: emptyList()
        )
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

    // Setter para lista de objetos Estudiante
    fun setEstudiantes(estudiantes: List<Estudiante>) {
        this.estudiantes = estudiantes
    }

    // Setter para lista de IDs
    fun setEstudiantesIds(estudiantesIds: List<String>) {
        this.estudiantes = estudiantesIds
    }

    override fun toString(): String {
        return "Edicion(id='$id', nombre='$nombreEdicion', " +
                "fechas=${getFechaInicio()} a ${getFechaFin()}, " +
                "cursoId='$cursoId', estudiantes=${getEstudiantesIds().size})"
    }
}