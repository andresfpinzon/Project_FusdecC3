package models.administrativo.comando

class Comando(
    val id: String,
    var nombreComando: String,
    var estadoComando: Boolean,
    var ubicacionComando: String,
    var fundacionId: String,
    var brigadas: List<String>
){
    companion object {
        val comando1 = Comando(
            id = "COM12391723-91",
            nombreComando = "Comando 1",
            estadoComando = true,
            ubicacionComando = "Calle 123",
            fundacionId = "FUN123456",
            brigadas = listOf("1", "2")
        )

        val comando2 = Comando(
            id = "COM12391723-19",
            nombreComando = "Comando 2",
            estadoComando = true,
            ubicacionComando = "Calle 456",
            fundacionId = "FUN654321",
            brigadas = listOf("2", "3")
        )
    }
}