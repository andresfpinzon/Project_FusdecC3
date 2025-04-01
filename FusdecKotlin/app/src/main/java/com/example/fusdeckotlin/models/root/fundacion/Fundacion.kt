package com.example.fusdeckotlin.models.root.fundacion

import java.time.LocalDate

class Fundacion(
    private val id: String,
    private var nombreFundacion: String,
    private var estadoFundacion: Boolean = true,
    private var comandos : List<String>
) {
    // Getters
    fun getId(): String = id
    fun getNombreFundacion(): String = nombreFundacion
    fun getEstadoFundacion(): Boolean = estadoFundacion
    fun getComandos(): List<String> = comandos

    // Setters
    fun setNombreFundacion(nombre: String) {
        this.nombreFundacion = nombre
    }



    fun setEstadoFundacion(estado: Boolean) {
        this.estadoFundacion = estado
    }

    fun setComandos(comandos: List<String>) {
        this.comandos = comandos
    }

    companion object {
        val fundacion1 = Fundacion(
            id = "Fusdec003",
            nombreFundacion= "2025/03/14",
            estadoFundacion = true,
            comandos = listOf("EST01", "EST02")
        )

        val fundacion2 = Fundacion(
            id = "ASIS02",
            nombreFundacion = "FUSDEC",
            estadoFundacion = true,
            comandos = listOf("com1", "com2")
        )
    }
}

