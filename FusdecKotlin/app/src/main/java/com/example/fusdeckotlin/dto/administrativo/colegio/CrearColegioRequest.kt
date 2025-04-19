package com.example.fusdeckotlin.dto.administrativo.colegio

import com.google.gson.annotations.SerializedName

data class CrearColegioRequest(
    @SerializedName("nombreColegio")
    val nombre: String,

    @SerializedName("emailColegio")
    val email: String,

    @SerializedName("estadoColegio")
    val estado: Boolean = true,

)