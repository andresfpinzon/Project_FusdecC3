package com.example.fusdeckotlin.dto.administrativo.user

import com.google.gson.annotations.SerializedName

data class UpdateUserDto(
    @SerializedName("nombre")  var nombre: String? = null,
    @SerializedName("apellido")  var apellido: String? = null,
    @SerializedName("correo")  var correo: String? = null,
    @SerializedName("password")  var password: String? = null,

    val estado: Boolean? = null
)
