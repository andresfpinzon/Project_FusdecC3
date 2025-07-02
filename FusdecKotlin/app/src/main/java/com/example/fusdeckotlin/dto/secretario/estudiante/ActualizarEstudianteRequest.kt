package com.example.fusdeckotlin.dto.secretario.estudiante

import com.google.gson.annotations.SerializedName

data class ActualizarEstudianteRequest(
    @SerializedName("nombre")
    val nombre: String? = null,

    @SerializedName("apellido")
    val apellido: String? = null,

    @SerializedName("tipoDocumento")
    val tipoDocumento: String? = null,

    @SerializedName("genero")
    val genero: String? = null,

    @SerializedName("unidadId")
    val unidad: Int? = null,

    @SerializedName("colegioId")
    val colegio: Int? = null,

    @SerializedName("edicionId")
    val edicion: Int? = null,

    @SerializedName("grado")
    val grado: String? = null,

    @SerializedName("estado")
    val estado: Boolean? = null
)