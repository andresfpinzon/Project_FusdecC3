package com.example.fusdeckotlin.models.administrativo.colegio

import com.google.gson.annotations.SerializedName

class Colegio(
    @SerializedName("id") private val id: String,
    @SerializedName("nombre") private var nombreColegio: String,
    @SerializedName("email") private var emailColegio: String,
    @SerializedName("estado") private var estadoColegio: Boolean,

) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreColegio(): String = nombreColegio
    fun getEmailColegio(): String = emailColegio
    fun getEstadoColegio(): Boolean = estadoColegio



    override fun toString(): String {
        return "Colegio(id='$id', nombre='$nombreColegio', email='$emailColegio', " +
                "estado=${if (estadoColegio) "Activo" else "Inactivo"}, )"
    }
}