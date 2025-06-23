package com.example.fusdeckotlin.dto.administrativo.colegio

import com.google.gson.annotations.SerializedName

data class ActualizarColegioRequest(
    @SerializedName("nombre")
    val nombre: String? = null,

    @SerializedName("email")
    val email: String? = null,

    @SerializedName("estado")
    val estado: Boolean? = null,

)