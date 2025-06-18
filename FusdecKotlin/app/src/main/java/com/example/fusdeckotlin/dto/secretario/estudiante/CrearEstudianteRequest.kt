package com.example.fusdeckotlin.dto.secretario.estudiante

import com.google.gson.annotations.SerializedName

data class CrearEstudianteRequest(
    @SerializedName("numeroDocumento")
    val numeroDocumento: String,

    @SerializedName("nombre")
    val nombre: String,

    @SerializedName("apellido")
    val apellido: String,

    @SerializedName("tipoDocumento")
    val tipoDocumento: String,

    @SerializedName("genero")
    val genero: String,

    @SerializedName("unidadId")
    val unidad: Int,

    @SerializedName("colegioId")
    val colegio: Int,

    @SerializedName("edicionId")
    val edicion: Int,

    @SerializedName("grado")
    val grado: String
)