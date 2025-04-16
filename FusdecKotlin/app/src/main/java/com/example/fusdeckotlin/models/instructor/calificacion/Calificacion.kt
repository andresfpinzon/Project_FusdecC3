package com.example.fusdeckotlin.models.instructor.calificacion

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName

class Calificacion(
    @SerializedName("_id") private val id: String,
    @SerializedName("tituloCalificacion") private var tituloCalificacion: String,
    @SerializedName("aprobado") private var aprobado: Boolean,
    @SerializedName("usuarioId") private var usuarioId: String,
    @SerializedName("estadoCalificacion") private var estadoCalificacion: Boolean = true,
    @SerializedName("estudiantes") private var estudiantes: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getTituloCalificacion(): String = tituloCalificacion
    fun getAprobado(): Boolean = aprobado
    fun getUsuarioId(): String = usuarioId
    fun getEstadoCalificacion(): Boolean = estadoCalificacion

    // Getter para lista de estudiantes como objetos completos
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

    // Método para convertir Map a Estudiante
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
        return "Calificacion(id='$id', titulo='$tituloCalificacion', " +
                "aprobado=$aprobado, estado=${if (estadoCalificacion) "Activo" else "Inactivo"}, " +
                "estudiantes=${getEstudiantesDocumentos().size})"
    }
}