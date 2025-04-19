package com.example.fusdeckotlin.dto.administrativo.user

import com.google.gson.annotations.SerializedName

data class CreateUserDto(
    @SerializedName("nombreUsuario")
    private var nombreUsuario: String,
    @SerializedName("apellidoUsuario")
    private var apellidoUsuario: String,
    @SerializedName("numeroDocumento")
    private var numeroDocumento: String,
    @SerializedName("correo")
    private var correo: String,
    @SerializedName("password")
    private var password: String,
    @SerializedName("roles")
    private var roles: List<String>? = null,
)
