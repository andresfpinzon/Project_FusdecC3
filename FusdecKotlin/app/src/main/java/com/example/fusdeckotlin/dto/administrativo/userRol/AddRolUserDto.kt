package com.example.fusdeckotlin.dto.administrativo.userRol

import com.google.gson.annotations.SerializedName

data class AddRolUserDto(
    @SerializedName("usuarioNumeroDocumento") private var usuarioNumeroDocumento: String,
    @SerializedName("rol") private var rol: String
)
