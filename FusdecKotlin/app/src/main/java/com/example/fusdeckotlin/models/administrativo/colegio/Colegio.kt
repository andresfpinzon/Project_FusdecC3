package com.example.fusdeckotlin.models.administrativo.colegio

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName

class Colegio(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreColegio") private var nombreColegio: String,
    @SerializedName("emailColegio") private var emailColegio: String,
    @SerializedName("estadoColegio") private var estadoColegio: Boolean,
    @SerializedName("estudiantes") private var estudiantes: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreColegio(): String = nombreColegio
    fun getEmailColegio(): String = emailColegio
    fun getEstadoColegio(): Boolean = estadoColegio

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
                    edicion = "",
                    estado = true,
                    asistenciasRegistradas = 0,
                    aprobado = false
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
            edicion = map["edicion"] as? String ?: "",
            grado = map["grado"] as? String ?: "",
            estado = map["estado"] as? Boolean ?: true,
            asistenciasRegistradas = map["asistenciasRegistradas"] as? Int ?: 0,
            aprobado = map ["aprobado"] as? Boolean ?: false
        )
    }

    override fun toString(): String {
        return "Colegio(id='$id', nombre='$nombreColegio', email='$emailColegio', " +
                "estado=${if (estadoColegio) "Activo" else "Inactivo"}, " +
                "estudiantes=${estudiantes.size})"
    }
}