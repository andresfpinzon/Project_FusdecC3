package com.example.fusdeckotlin.models.administrativo.brigada

import com.google.gson.annotations.SerializedName

class Brigada(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreBrigada") private var nombreBrigada: String,
    @SerializedName("ubicacionBrigada") private var ubicacionBrigada: String,
    @SerializedName("estadoBrigada") private var estadoBrigada: Boolean = true,
    @SerializedName("comandoId") private var comandoId: Any, // String o Comando
    @SerializedName("unidades") private var unidades: List<Any> = emptyList() // String o Unidad
) {
    // Getters básicos
    fun getId() = id
    fun getNombreBrigada() = nombreBrigada
    fun getUbicacionBrigada() = ubicacionBrigada
    fun getEstadoBrigada() = estadoBrigada

    // Manejo flexible de comandoId
    fun getComandoId(): String {
        return when(comandoId) {
            is String -> comandoId as String
            else -> "" // Implementar lógica si recibe objeto Comando
        }
    }

    fun getComando(): Any { // O devuelve modelo Comando
        return comandoId
    }

    // Manejo flexible de unidades
    fun getUnidades(): List<String> {
        return unidades.map {
            when(it) {
                is String -> it
                else -> "" // Implementar lógica si recibe objetos Unidad
            }
        }.filter { it.isNotEmpty() }
    }

    fun getUnidadesObjects(): List<Any> { // O devuelve objetos Unidad
        return unidades
    }

    // Setters
    fun setNombreBrigada(nombre: String) {
        nombreBrigada = nombre
    }

    fun setUbicacionBrigada(ubicacion: String) {
        ubicacionBrigada = ubicacion
    }

    fun setEstadoBrigada(estado: Boolean) {
        estadoBrigada = estado
    }

    fun setComandoId(comando: String) {
        comandoId = comando
    }

    fun setComando(comando: Any) { // O específica tipo Comando
        comandoId = comando
    }

    fun setUnidades(unidades: List<String>) {
        this.unidades = unidades
    }

    fun setUnidadesObjects(unidades: List<Any>) {
        this.unidades = unidades
    }

    companion object {
        fun createDefault() = Brigada(
            id = "",
            nombreBrigada = "",
            ubicacionBrigada = "",
            estadoBrigada = true,
            comandoId = "",
            unidades = emptyList()
        )
    }
}