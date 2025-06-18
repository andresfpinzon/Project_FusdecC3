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
    @SerializedName("estadoCurso") private var estadoCurso: Boolean = true,
    @SerializedName("estado") private var fundacionId: Any,
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreCurso(): String = nombreCurso
    fun getDescripcionCurso(): String = descripcionCurso
    fun getIntensidadHorariaCurso(): String = intensidadHorariaCurso
    fun getEstadoCurso(): Boolean = estadoCurso

    // Obtener solo el ID de la fundación
    fun getFundacionId(): String {
        return when(fundacionId) {
            is String -> fundacionId as String
            is Fundacion -> (fundacionId as Fundacion).getId()
            is Map<*, *> -> (fundacionId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    // Obtener objeto Fundacion completo
    fun getFundacion(): Fundacion {
        return when(fundacionId) {
            is Fundacion -> fundacionId as Fundacion
            is String -> crearFundacionVacia(fundacionId as String)
            is Map<*, *> -> convertMapToFundacion(fundacionId as Map<*, *>)
            else -> crearFundacionVacia("")
        }
    }

    private fun crearFundacionVacia(id: String): Fundacion {
        return Fundacion(
            id = id,
            nombreFundacion = "",
            estadoFundacion = true,
        )
    }

    private fun convertMapToFundacion(map: Map<*, *>): Fundacion {
        return Fundacion(
            id = map["_id"] as? String ?: "",
            nombreFundacion = map["nombreFundacion"] as? String ?: "",
            estadoFundacion = map["estadoFundacion"] as? Boolean ?: true,
        )
    }


}