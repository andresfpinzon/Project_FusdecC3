package com.example.fusdeckotlin.dto.administrativo.colegio

import com.google.gson.annotations.SerializedName

data class ActualizarColegioRequest(
    @SerializedName("nombreColegio")
    val nombre: String? = null,

    @SerializedName("emailColegio")
    val email: String? = null,

    @SerializedName("estadoColegio")
    val estado: Boolean? = null,

)