package com.example.fusdeckotlin.models.root.fundacion

import com.google.gson.annotations.SerializedName

class Fundacion(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreFundacion") private var nombreFundacion: String,
    @SerializedName("estadoFundacion") private var estadoFundacion: Boolean = true,
    @SerializedName("comando") private var comando: List<Any> = emptyList() // Cambiado a Any para flexibilidad
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreFundacion(): String = nombreFundacion
    fun getEstadoFundacion(): Boolean = estadoFundacion

    // Obtener comandos como lista de Strings
    fun getComandos(): List<String> {
        return comando.mapNotNull {
            when (it) {
                is String -> it
                else -> null
            }
        }
    }

    // Obtener comandos como objetos completos (si en algún momento evoluciona)
    fun getComandosObjects(): List<Comando> {
        return comando.mapNotNull {
            when (it) {
                is Comando -> it
                is String -> Comando(id = it, nombreComando = "")
                is Map<*, *> -> convertMapToComando(it)
                else -> null
            }
        }
    }

    // Clase interna para modelo Comando (si es necesario)
    class Comando(
        val id: String,
        val nombreComando: String
    )

    private fun convertMapToComando(map: Map<*, *>): Comando {
        return Comando(
            id = map["_id"] as? String ?: "",
            nombreComando = map["nombreComando"] as? String ?: ""
        )
    }

    // Setters
    fun setNombreFundacion(nombre: String) {
        this.nombreFundacion = nombre
    }

    fun setEstadoFundacion(estado: Boolean) {
        this.estadoFundacion = estado
    }

    fun setComandos(comandos: List<String>) {
        this.comando = comandos
    }

    fun setComandosObjects(comandos: List<Comando>) {
        this.comando = comandos
    }

    override fun toString(): String {
        return "Fundacion(id='$id', nombre='$nombreFundacion', " +
                "estado=$estadoFundacion, comandos=${getComandos().size})"
    }
}