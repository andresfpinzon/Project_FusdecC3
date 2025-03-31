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

    companion object{
        val comando1 = Comando(
            id = "COM01",
            nombreComando = "Comando 1",
            estadoComando = true,
            ubicacionComando = "Ubicación 1",
            fundacionId = "FUND01",
            brigadas = listOf("BRIG01", "BRIG02")
        )

        val comando2 = Comando(
            id = "COM02",
            nombreComando = "Comando 2",
            estadoComando = true,
            ubicacionComando = "Ubicación 2",
            fundacionId = "FUND02",
            brigadas = listOf("BRIG03", "BRIG04")
        )
    }
}
