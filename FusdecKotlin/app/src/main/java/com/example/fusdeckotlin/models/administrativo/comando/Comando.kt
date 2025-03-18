package com.example.fusdeckotlin.models.administrativo.comando

data class Comando(
    private val id: String,
    private var nombreComando: String,
    private var estadoComando: Boolean,
    private var ubicacionComando: String,
    private var fundacionId: String,
    private var brigadas: List<String>
) {
    fun getId() = id
    fun getNombreComando() = nombreComando
    fun getEstadoComando() = estadoComando
    fun getUbicacionComando() = ubicacionComando
    fun getFundacionId() = fundacionId
    fun getBrigadas() = brigadas

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

    fun setBrigadas(brigadas: List<String>) {
        this.brigadas = brigadas
    }
}