package com.example.fusdeckotlin.models.administrativo.colegio

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName

class Colegio(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreColegio") private var nombreColegio: String,
    @SerializedName("emailColegio") private var emailColegio: String,
    @SerializedName("estadoColegio") private var estadoColegio: Boolean,
    @SerializedName("estudiantes") private var estudiantes: List<Any> = emptyList(),
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
                    id = it, "", "", "", "", "", "", "", "", true, emptyList(), emptyList(), emptyList(), emptyList()
                )
                is Map<*, *> -> convertMapToEstudiante(it)
                else -> null
            }
        }
    }

    // Getter para IDs de estudiantes
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

    // Metodo de conversión de mapa a Estudiante
    private fun convertMapToEstudiante(map: Map<*, *>): Estudiante {
        return Estudiante(
            id = map["_id"] as? String ?: "",
            nombreEstudiante = map["nombreEstudiante"] as? String ?: "",
            apellidoEstudiante = map["apellidoEstudiante"] as? String ?: "",
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

    // Setters
    fun setNombreColegio(nombre: String) {
        nombreColegio = nombre
    }

    fun setEmailColegio(email: String) {
        emailColegio = email
    }

    fun setEstadoColegio(estado: Boolean) {
        estadoColegio = estado
    }

    fun setEstudiantes(estudiantes: List<Estudiante>) {
        this.estudiantes = estudiantes
    }


    override fun toString(): String {
        return "Colegio(id='$id', nombre='$nombreColegio', email='$emailColegio', " +
                "estado=${if (estadoColegio) "Activo" else "Inactivo"}, " +
                "estudiantes=${estudiantes.joinToString()})"
    }
}