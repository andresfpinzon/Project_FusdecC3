package com.example.fusdeckotlin.dto.administrativo.user

import com.google.gson.annotations.SerializedName

data class CreateUserDto(
    @SerializedName("numero_documento") private var numeroDocumento: String,
    @SerializedName("nombre") private var nombre: String,
    @SerializedName("apellido") private var apellido: String,
    @SerializedName("correo") private var correo: String,
    @SerializedName("password") private var password: String,
)
