package com.example.fusdeckotlin.models.root.fundacion

import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.google.gson.annotations.SerializedName

class Fundacion(
    @SerializedName("_id")
    private val id: String,

    @SerializedName("nombreFundacion")
    private var nombreFundacion: String,

    @SerializedName("estadoFundacion")
    private var estadoFundacion: Boolean = true,

    @SerializedName("comando")
    private var comando: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreFundacion(): String = nombreFundacion
    fun getEstadoFundacion(): Boolean = estadoFundacion

    // Manejo de comandos
    fun getComandosIds(): List<String> = comando.filterIsInstance<String>()

    fun getComandosDetallados(): List<Comando> = comando.mapNotNull {
        when(it) {
            is Comando -> it
            is Map<*, *> -> convertMapToComando(it)
            else -> null
        }
    }

    private fun convertMapToComando(map: Map<*, *>): Comando {
        return Comando(
            id = map["_id"] as? String ?: "",
            nombreComando = map["nombreComando"] as? String ?: "",
            estadoComando = map["estadoComando"] as? Boolean ?: true,
            ubicacionComando = map["ubicacionComando"] as? String ?: "",
            fundacionId = map["fundacionId"] ?: ""
        )
    }

    // Setters (si son necesarios)
    fun setNombreFundacion(nombre: String) {
        this.nombreFundacion = nombre
    }

    fun setEstadoFundacion(estado: Boolean) {
        this.estadoFundacion = estado
    }

    fun setComandos(comandos: List<Any>) {
        this.comando = comandos
    }

    override fun toString(): String {
        return "Fundacion(id='$id', nombre='$nombreFundacion', estado=$estadoFundacion)"
    }
}