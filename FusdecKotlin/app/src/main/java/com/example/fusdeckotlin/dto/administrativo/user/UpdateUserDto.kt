package com.example.fusdeckotlin.dto.administrativo.user

import com.google.gson.annotations.SerializedName

data class UpdateUserDto(
    @SerializedName("nombre") private var nombre: String?,
    @SerializedName("apellido") private var apellido: String?,
    @SerializedName("correo") private var correo: String?,
    @SerializedName("password") private var password: String?,
)
