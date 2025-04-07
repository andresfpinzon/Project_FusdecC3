package com.example.fusdeckotlin.models.secretario.curso

import com.google.gson.annotations.SerializedName

class Curso(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreCurso") private var nombreCurso: String,
    @SerializedName("descripcionCurso") private var descripcionCurso: String,
    @SerializedName("intensidadHorariaCurso") private var intensidadHorariaCurso: String,
    @SerializedName("estadoCurso") private var estadoCurso: Boolean = true,
    @SerializedName("fundacionId") private var fundacionId: String,
    @SerializedName("ediciones") private var ediciones: List<Any> = emptyList()
) {
    // Getters
    fun getId(): String = id
    fun getNombreCurso(): String = nombreCurso
    fun getDescripcionCurso(): String = descripcionCurso
    fun getIntensidadHorariaCurso(): String = intensidadHorariaCurso
    fun getEstadoCurso(): Boolean = estadoCurso
    fun getFundacionId(): String = fundacionId

    fun getEdiciones(): List<String> {
        return ediciones.map {
            when (it) {
                is String -> it
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
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

    fun setEdiciones(ediciones: List<String>) {
        this.ediciones = ediciones
    }

    override fun toString(): String {
        return "Curso(id='$id', nombre='$nombreCurso', descripción='$descripcionCurso', " +
                "fundacionId='$fundacionId', ediciones=${ediciones.joinToString()})"
    }

}