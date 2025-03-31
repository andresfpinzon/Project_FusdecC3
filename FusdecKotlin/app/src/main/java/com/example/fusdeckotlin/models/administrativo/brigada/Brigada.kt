package com.example.fusdeckotlin.models.administrativo.brigada

data class Brigada(
    private val id: String,
    private var nombreBrigada: String,
    private var ubicacionBrigada: String,
    private var estadoBrigada: Boolean,
    private var comandoId: String,
    private var unidades: List<String>
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

    companion object{
        val brigada1 = Brigada(
            id = "BRIG01",
            nombreBrigada = "Brigada 1",
            ubicacionBrigada = "Ubicación 1",
            estadoBrigada = true,
            comandoId = "COM01",
            unidades = listOf("UNI01", "UNI02")
        )

        val brigada2 = Brigada(
            id = "BRIG02",
            nombreBrigada = "Brigada 2",
            ubicacionBrigada = "Ubicación 2",
            estadoBrigada = true,
            comandoId = "COM02",
            unidades = listOf("UNI03", "UNI04")
        )
    }
}