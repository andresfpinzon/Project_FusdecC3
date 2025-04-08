package com.example.fusdeckotlin.models.secretario.curso

import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import com.google.gson.annotations.SerializedName
import java.time.LocalDate

class Curso(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreCurso") private var nombreCurso: String,
    @SerializedName("descripcionCurso") private var descripcionCurso: String,
    @SerializedName("intensidadHorariaCurso") private var intensidadHorariaCurso: String,
    @SerializedName("estadoCurso") private var estadoCurso: Boolean = true,
    @SerializedName("fundacionId") private var fundacionId: String,
    @SerializedName("ediciones") private var ediciones: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreCurso(): String = nombreCurso
    fun getDescripcionCurso(): String = descripcionCurso
    fun getIntensidadHorariaCurso(): String = intensidadHorariaCurso
    fun getEstadoCurso(): Boolean = estadoCurso
    fun getFundacionId(): String = fundacionId

    // Obtener ediciones como objetos Edicion completos
    fun getEdiciones(): List<Edicion> {
        return ediciones.mapNotNull {
            when (it) {
                is Edicion -> it
                is String -> Edicion(
                    id = it,
                    nombreEdicion = "",
                    fechaInicioString = LocalDate.now().toString(),
                    fechaFinString = LocalDate.now().toString(),
                    cursoId = this.id,
                    instructorId = "",
                    estadoEdicion = true,
                    estudiantes = emptyList()
                )
                is Map<*, *> -> convertMapToEdicion(it)
                else -> null
            }
        }
    }

    // Obtener solo los IDs de las ediciones
    fun getEdicionesIds(): List<String> {
        return ediciones.map {
            when (it) {
                is Edicion -> it.getId()
                is String -> it
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    // Conversor de Map a objeto Edicion
    private fun convertMapToEdicion(map: Map<*, *>): Edicion {
        return Edicion(
            id = map["_id"] as? String ?: "",
            nombreEdicion = map["nombreEdicion"] as? String ?: "",
            fechaInicioString = (map["fechaInicio"] as? String)?.substring(0, 10) ?: LocalDate.now().toString(),
            fechaFinString = (map["fechaFin"] as? String)?.substring(0, 10) ?: LocalDate.now().toString(),
            cursoId = map["cursoId"] as? String ?: this.id,
            instructorId = map["instructorId"] as? String ?: "",
            estadoEdicion = map["estadoEdicion"] as? Boolean ?: true,
            estudiantes = map["estudiantes"] as? List<Any> ?: emptyList()
        )
    }

    // Setters
    fun setNombreCurso(nombre: String) {
        this.nombreCurso = nombre
    }

    fun setDescripcionCurso(descripcion: String) {
        this.descripcionCurso = descripcion
    }

    fun setIntensidadHorariaCurso(intensidad: String) {
        this.intensidadHorariaCurso = intensidad
    }

    fun setEstadoCurso(estado: Boolean) {
        this.estadoCurso = estado
    }

    fun setFundacionId(fundacion: String) {
        this.fundacionId = fundacion
    }

    fun setEdiciones(ediciones: List<Edicion>) {
        this.ediciones = ediciones
    }

    fun setEdicionesIds(edicionesIds: List<String>) {
        this.ediciones = edicionesIds
    }

    override fun toString(): String {
        return "Curso(id='$id', nombre='$nombreCurso', descripción='$descripcionCurso', " +
                "intensidad='$intensidadHorariaCurso', estado=$estadoCurso, " +
                "fundacionId='$fundacionId', ediciones=${getEdicionesIds().joinToString()})"
    }
}