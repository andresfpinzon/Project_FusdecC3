package com.example.fusdeckotlin.models.instructor.asistencia

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName
import java.time.LocalDate

class Asistencia(
    @SerializedName("_id") private val id: String,
    @SerializedName("tituloAsistencia") private var tituloAsistencia: String,
    @SerializedName("fechaAsistencia") private var fechaAsistenciaString: String,
    @SerializedName("usuarioId") private var usuarioId: String,
    @SerializedName("estadoAsistencia") private var estadoAsistencia: Boolean = true,
    @SerializedName("estudiantes") private var estudiantes: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getTituloAsistencia(): String = tituloAsistencia
    fun getFechaAsistencia(): LocalDate = LocalDate.parse(fechaAsistenciaString.substring(0, 10))
    fun getUsuarioId(): String = usuarioId
    fun getEstadoAsistencia(): Boolean = estadoAsistencia

    // Getters para estudiantes (versión objetos completos)
    fun getEstudiantes(): List<Estudiante> {
        return estudiantes.mapNotNull {
            when (it) {
                is Estudiante -> it
                is String -> Estudiante(
                    numeroDocumento = it,
                    nombre = "",
                    apellido = "",
                    tipoDocumento = "",
                    genero = "",
                    unidad = "",
                    colegio = "",
                    grado = "",
                    estado = false
                )
                is Map<*, *> -> convertMapToEstudiante(it)
                else -> null
            }
        }
    }

    // Getter para números de documento de estudiantes
    fun getEstudiantesDocumentos(): List<String> {
        return estudiantes.map {
            when (it) {
                is Estudiante -> it.getNumeroDocumento()
                is String -> it
                is Map<*, *> -> it["numeroDocumento"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    private fun convertMapToEstudiante(map: Map<*, *>): Estudiante {
        return Estudiante(
            numeroDocumento = map["numeroDocumento"] as? String ?: "",
            nombre = map["nombre"] as? String ?: "",
            apellido = map["apellido"] as? String ?: "",
            tipoDocumento = map["tipoDocumento"] as? String ?: "",
            genero = map["genero"] as? String ?: "",
            unidad = map["unidad"] as? String ?: "",
            colegio = map["colegio"] as? String ?: "",
            grado = map["grado"] as? String ?: "",
            estado = map["estado"] as? Boolean ?: false
        )
    }


    override fun toString(): String {
        return "Asistencia(id='$id', titulo='$tituloAsistencia', fecha=${getFechaAsistencia()}, " +
                "estudiantes=${getEstudiantesDocumentos().size})"
    }
}