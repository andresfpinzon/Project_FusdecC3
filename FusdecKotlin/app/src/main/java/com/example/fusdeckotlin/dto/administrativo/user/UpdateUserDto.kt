package com.example.fusdeckotlin.dto.administrativo.user

import com.google.gson.annotations.SerializedName

data class UpdateUserDto(
    @SerializedName("nombreUsuario")
    private var nombreUsuario: String?  = null,
    @SerializedName("apellidoUsuario")
    private var apellidoUsuario: String?  = null,
    @SerializedName("numeroDocumento")
    private var numeroDocumento: String?  = null,
    @SerializedName("correo")
    private var correo: String?  = null,
    @SerializedName("password")
    private var password: String?  = null,
    @SerializedName("roles")
    private var roles: List<String>?  = null,
)
