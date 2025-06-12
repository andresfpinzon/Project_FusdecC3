package com.example.fusdeckotlin.models.administrativo.comando

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import com.google.gson.annotations.SerializedName

data class Comando(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreComando") private var nombreComando: String,
    @SerializedName("estadoComando") private var estadoComando: Boolean = true,
    @SerializedName("ubicacionComando") private var ubicacionComando: String,
    @SerializedName("fundacionId") private val fundacion: Int
    //@SerializedName("brigadas") private val brigadas: List<Brigada> = emptyList()
) {
    // getters básicos
    fun getId(): String = id
    fun getNombreComando(): String = nombreComando
    fun getEstadoComando(): Boolean = estadoComando
    fun getUbicacionComando(): String = ubicacionComando


    fun getFundacion(): Int = fundacion

    // setters
    fun setNombreComando(nombre: String) {
        this.nombreComando = nombre
    }
    fun setUbicacionComando(ubicacion: String) {
        this.ubicacionComando = ubicacion
    }

    }

