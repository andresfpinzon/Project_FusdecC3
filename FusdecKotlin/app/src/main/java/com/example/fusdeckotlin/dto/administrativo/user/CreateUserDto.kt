package com.example.fusdeckotlin.dto.administrativo.user

import com.google.gson.annotations.SerializedName

data class CreateUserDto(
    @SerializedName("numeroDocumento")  var numeroDocumento: String,
    @SerializedName("nombre")  var nombre: String,
    @SerializedName("apellido")  var apellido: String,
    @SerializedName("correo")  var correo: String,
    @SerializedName("password")  var password: String,
)
