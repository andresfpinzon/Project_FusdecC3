package com.example.fusdeckotlin.models.administrativo.user.model

import com.google.gson.annotations.SerializedName

data class Usuario(

    @SerializedName("numero_documento") private var numeroDocumento: String,
    @SerializedName("nombre") private var nombre: String,
    @SerializedName("apellido") private var apellido: String,
    @SerializedName("correo") private var correo: String,
    @SerializedName("password") private var password: String,
    @SerializedName("estado") private var estado: Boolean = true,
    @SerializedName("createAt") private val createAt: String,
    @SerializedName("updateAt") private val updateAt: String
) {

    /**++++++++++++++GETTERS+++++++++++++++++*/

    fun getNumeroDocumento(): String = numeroDocumento

    fun getNombreUsuario(): String = nombre

    fun getApellidoUsuario(): String = apellido


    fun getCorreo(): String = correo

    fun getPassword(): String= password

    fun getEstadoUsuario(): Boolean = estado

    fun getCreadoAt(): String = createAt

    fun getUpdateAt(): String = updateAt
}
