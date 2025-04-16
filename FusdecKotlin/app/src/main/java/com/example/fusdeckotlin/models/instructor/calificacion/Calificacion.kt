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

    // Getters
    fun getId(): String = id
    fun getTituloCalificacion(): String = tituloCalificacion
    fun getAprobado(): Boolean = aprobado
    fun getUsuarioId(): String = usuarioId
    fun getEstadoCalificacion(): Boolean = estadoCalificacion

    // Getter para lista de estudiantes como objetos
    fun getEstudiantes(): List<Estudiante> {
        return estudiantes.mapNotNull {
            when (it) {
                is Estudiante -> it
                is String -> Estudiante(
                    id = it, "", "", "", "", "", "", "",
                    "", false, emptyList(), emptyList(), emptyList(), emptyList()
                )
                is Map<*, *> -> convertMapToEstudiante(it)
                else -> null
            }
        }
    }

    // Getter para lista de IDs de estudiantes
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

    // Metodo para convertir Map a Estudiante
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
            ediciones = map["ediciones"] as? List<Any> ?: emptyList(),
            calificaciones = map["calificaciones"] as? List<Any> ?: emptyList(),
            asistencias = map["asistencias"] as? List<Any> ?: emptyList(),
            certificados = map["certificados"] as? List<Any> ?: emptyList()
        )
    }

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

    // Setter para estudiantes (acepta tanto objetos como ID)
    fun setEstudiantes(estudiantes: List<Any>) {
        this.estudiantes = estudiantes
    }

    override fun toString(): String {
        return "Calificacion(id='$id', titulo='$tituloCalificacion', " +
                "aprobado=$aprobado, estado=${if (estadoCalificacion) "Activo" else "Inactivo"})"
    }
}