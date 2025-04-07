package com.example.fusdeckotlin.models.instructor.asistencia

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName
import java.time.LocalDate

class
Asistencia(
    @SerializedName("_id") private val id: String,
    @SerializedName("tituloAsistencia") private var tituloAsistencia: String,
    @SerializedName("fechaAsistencia") private var fechaAsistenciaString: String,
    @SerializedName("usuarioId") private var usuarioId: String,
    @SerializedName("estadoAsistencia") private var estadoAsistencia: Boolean = true,
    @SerializedName("estudiantes") private var estudiantes: List<Any> = emptyList()
) {
    // Getters
    fun getId(): String = id
    fun getTituloAsistencia(): String = tituloAsistencia

    fun getFechaAsistencia(): LocalDate {
        return LocalDate.parse(fechaAsistenciaString.substring(0, 10))
    }

    fun getUsuarioId(): String = usuarioId
    fun getEstadoAsistencia(): Boolean = estadoAsistencia

    fun getEstudiantes(): List<Estudiante> {
        return estudiantes.mapNotNull {
            when (it) {
                is Estudiante -> it
                is String -> Estudiante(id = it, "", "", "", "", "", "", "", "", "", false, emptyList(), emptyList(), emptyList(), emptyList())
                is Map<*, *> -> convertMapToEstudiante(it)
                else -> null
            }
        }
    }

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

    private fun convertMapToEstudiante(map: Map<*, *>): Estudiante {
        return Estudiante(
            id = map["_id"] as? String ?: "",
            nombreEstudiante = map["nombreEstudiante"] as? String ?: "",
            apellidoEstudiante = map["apellidoEstudiante"] as? String ?: "",
            correoEstudiante = map["correoEstudiante"] as? String ?: "",
            tipoDocumento = map["tipoDocumento"] as? String ?: "",
            numeroDocumento = map["numeroDocumento"] as? String ?: "",
            fechaNacimientoString = (map["fechaNacimiento"] as? String)?.substring(0, 10) ?: "",
            generoEstudiante = map["generoEstudiante"] as? String ?: "",
            unidadId = map["unidadId"] as? String ?: "",
            colegioId = map["colegioId"] as? String ?: "",
            estadoEstudiante = map["estadoEstudiante"] as? Boolean ?: false,
            ediciones = map["ediciones"] as? List<String> ?: emptyList(),
            calificaciones = map["calificaciones"] as? List<String> ?: emptyList(),
            asistencias = map["asistencias"] as? List<String> ?: emptyList(),
            certificados = map["certificados"] as? List<String> ?: emptyList()
        )
    }


    fun setTituloAsistencia(titulo: String) {
        this.tituloAsistencia = titulo
    }

    fun setFechaAsistencia(fecha: LocalDate) {
        this.fechaAsistenciaString = fecha.toString()
    }

    fun setUsuarioId(usuarioId: String) {
        this.usuarioId = usuarioId
    }

    fun setEstadoAsistencia(estado: Boolean) {
        this.estadoAsistencia = estado
    }

    fun setEstudiantes(estudiantes: List<Estudiante>) {
        this.estudiantes = estudiantes
    }


    override fun toString(): String {
        return "Asistencia(id='$id', titulo='$tituloAsistencia', fecha=${getFechaAsistencia()}, " +
                "estudiantes=${estudiantes.joinToString()})"
    }

}