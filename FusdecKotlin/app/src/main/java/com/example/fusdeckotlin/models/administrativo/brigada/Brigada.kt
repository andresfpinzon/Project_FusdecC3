package com.example.fusdeckotlin.models.administrativo.brigada

import com.google.gson.annotations.SerializedName

data class Brigada(

    @SerializedName("_id")              private val id: String,
    @SerializedName("nombreBrigda")     private var nombreBrigada: String,
    @SerializedName("ubicacionBrigada") private var ubicacionBrigada: String,
    @SerializedName("estadoBrigada")    private var estadoBrigada: Boolean,
    @SerializedName("comandoId")        private var comandoId: String,
    @SerializedName("unidades")         private var unidades: List<String>
) {
    fun getId() = id
    fun getNombreBrigada() = nombreBrigada
    fun getUbicacionBrigada() = ubicacionBrigada
    fun getEstadoBrigada() = estadoBrigada
    fun getComandoId() = comandoId
    fun getUnidades() = unidades

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

    fun setUnidades(unidades: List<String>) {
        this.unidades = unidades
    }

    override fun toString(): String {
        return "Brigada(id='$id', nombreBrigada='$nombreBrigada', ubicacionBrigada='$ubicacionBrigada', " +
                "estadoBrigada=$estadoBrigada, comandoId='$comandoId', unidades=$unidades)"
    }
}