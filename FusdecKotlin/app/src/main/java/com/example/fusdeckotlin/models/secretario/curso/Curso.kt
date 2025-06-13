package com.example.fusdeckotlin.models.secretario.curso

import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import com.google.gson.annotations.SerializedName
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import java.time.LocalDate

class Curso(
    @SerializedName("id") private val id: String,
    @SerializedName("nombre") private var nombreCurso: String,
    @SerializedName("descripcion") private var descripcionCurso: String,
    @SerializedName("intensidadHoraria") private var intensidadHorariaCurso: String,
    @SerializedName("estado") private var estadoCurso: Boolean = true,
    @SerializedName("fundacionId") private var fundacionId: Int,
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreCurso(): String = nombreCurso
    fun getDescripcionCurso(): String = descripcionCurso
    fun getIntensidadHorariaCurso(): String = intensidadHorariaCurso
    fun getEstadoCurso(): Boolean = estadoCurso

    // Obtener solo el ID de la fundación
    fun getFundacionId(): Int = fundacionId


    override fun toString(): String {
        return "Curso(id='$id', nombre='$nombreCurso', descripción='$descripcionCurso', " +
                "intensidad='$intensidadHorariaCurso', estado=$estadoCurso, " +
                "fundacionId='$fundacionId')"
    }
}