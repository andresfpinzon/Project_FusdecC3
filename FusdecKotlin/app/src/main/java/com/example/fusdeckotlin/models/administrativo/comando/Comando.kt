package com.example.fusdeckotlin.models.administrativo.comando

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import com.google.gson.annotations.SerializedName

data class Comando(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreComando") private var nombreComando: String,
    @SerializedName("estadoComando") private var estadoComando: Boolean = true,
    @SerializedName("ubicacionComando") private var ubicacionComando: String,
    @SerializedName("fundacionId") private val fundacion: Any? = null,
    //@SerializedName("brigadas") private val brigadas: List<Brigada> = emptyList()
) {
    // getters básicos
    fun getId(): String = id
    fun getNombreComando(): String = nombreComando
    fun getEstadoComando(): Boolean = estadoComando
    fun getUbicacionComando(): String = ubicacionComando


    fun getFundacion(): Fundacion {
        return when (fundacion) {
            is Fundacion -> fundacion as Fundacion
            is String -> Fundacion(
                id = fundacion as String,
                nombreFundacion = "",
                estadoFundacion = true,
            )
            is Map<*, *> -> convertMapToFundacion(fundacion as Map<*, *>)
            else -> Fundacion(
                id = "",
                nombreFundacion = "",
                estadoFundacion = true,
            )
        }
    }

    private fun convertMapToFundacion(map: Map<*, *>): Fundacion {
        return Fundacion(
            id = map["_id"] as? String ?: "",
            nombreFundacion = map["nombre"] as? String ?: "",
            estadoFundacion = map["estado"] as? Boolean ?: true,
        )
    }

    // setters
    fun setNombreComando(nombre: String) {
        this.nombreComando = nombre
    }
    fun setUbicacionComando(ubicacion: String) {
        this.ubicacionComando = ubicacion
    }

    }

