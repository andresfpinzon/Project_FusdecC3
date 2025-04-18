package com.example.fusdeckotlin.models.root.fundacion

import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.google.gson.annotations.SerializedName

class Fundacion(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreFundacion") private var nombreFundacion: String,
    @SerializedName("estadoFundacion") private var estadoFundacion: Boolean = true,
    @SerializedName("comando") private var comando: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreFundacion(): String = nombreFundacion
    fun getEstadoFundacion(): Boolean = estadoFundacion

    // Manejo de comandos - similar al manejo de ediciones en Curso
    fun getComandos(): List<Comando> {
        return comando.mapNotNull {
            when(it) {
                is Comando -> it
                is String -> crearComandoVacio(it)
                is Map<*, *> -> convertMapToComando(it as Map<String, Any>)
                else -> null
            }
        }
    }

    fun getComandosIds(): List<String> {
        return comando.map {
            when(it) {
                is Comando -> it.getId()
                is String -> it
                is Map<*, *> -> (it as Map<String, Any>)["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    private fun crearComandoVacio(id: String): Comando {
        return Comando(
            id = id,
            nombreComando = "",
            estadoComando = true,
            ubicacionComando = "",
            fundacionId = this.id,
            brigadas = emptyList()
        )
    }

    private fun convertMapToComando(map: Map<String, Any>): Comando {
        return Comando(
            id = map["_id"] as? String ?: "",
            nombreComando = map["nombreComando"] as? String ?: "",
            estadoComando = map["estadoComando"] as? Boolean ?: true,
            ubicacionComando = map["ubicacionComando"] as? String ?: "",
            fundacionId = map["fundacionId"] ?: this.id,
            brigadas = map["brigadas"] as? List<Any> ?: emptyList()
        )
    }

    override fun toString(): String {
        return "Fundacion(id='$id', nombre='$nombreFundacion', estado=$estadoFundacion, comandos=${getComandosIds().joinToString()})"
    }
}