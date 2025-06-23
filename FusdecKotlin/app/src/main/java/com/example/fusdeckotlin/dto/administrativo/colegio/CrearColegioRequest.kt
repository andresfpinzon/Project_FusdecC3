package com.example.fusdeckotlin.dto.administrativo.colegio

import com.google.gson.annotations.SerializedName

data class CrearColegioRequest(
    @SerializedName("nombre")
    val nombre: String,

    @SerializedName("email")
    val email: String,

    @SerializedName("estado")
    val estado: Boolean = true,

)