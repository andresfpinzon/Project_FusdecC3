package com.example.fusdeckotlin.models.administrativo.comando

import com.google.gson.annotations.SerializedName

class Comando(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreComando") private var nombreComando: String,
    @SerializedName("estadoComando") private var estadoComando: Boolean = true,
    @SerializedName("ubicacionComando") private var ubicacionComando: String,
    @SerializedName("fundacionId") private var fundacionId: Any, // Puede ser String o Fundacion
    @SerializedName("brigadas") private var brigadas: List<Any> = emptyList() // Puede ser String o Brigada
) {
    // Getters básicos
    fun getId() = id
    fun getNombreComando() = nombreComando
    fun getEstadoComando() = estadoComando
    fun getUbicacionComando() = ubicacionComando

    // Manejo flexible de fundacionId
    fun getFundacionId(): String {
        return when(fundacionId) {
            is String -> fundacionId as String
            else -> ""
        }
    }

    fun getFundacion(): Any {
        return fundacionId
    }

    // Manejo flexible de brigadas
    fun getBrigadas(): List<String> {
        return brigadas.map {
            when(it) {
                is String -> it
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    fun getBrigadasObjects(): List<Any> {
        return brigadas
    }

    // Setters
    fun setNombreComando(nombre: String) {
        nombreComando = nombre
    }

    fun setEstadoComando(estado: Boolean) {
        estadoComando = estado
    }

    fun setUbicacionComando(ubicacion: String) {
        ubicacionComando = ubicacion
    }

    fun setFundacionId(fundacion: String) {
        fundacionId = fundacion
    }

    fun setFundacion(fundacion: Any) { // O específica el tipo Fundacion
        fundacionId = fundacion
    }

    fun setBrigadas(brigadas: List<String>) {
        this.brigadas = brigadas
    }

    fun setBrigadasObjects(brigadas: List<Any>) {
        this.brigadas = brigadas
    }

}
