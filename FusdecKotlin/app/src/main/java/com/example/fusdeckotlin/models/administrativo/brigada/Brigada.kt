package models.administrativo.brigada

class Brigada(
    val id: String,
    var nombreBrigada: String,
    var ubicacionBrigada: String,
    var estadoBrigada: Boolean,
    var comandoId: String,
    var unidades: List<String>
){
    companion object{
        val Brigada1 = Brigada(
            id = "BRIG12391723-91",
            nombreBrigada = "Brigada 1",
            ubicacionBrigada = "Cochabamba",
            estadoBrigada = true,
            comandoId = "COM123456",
            unidades = listOf("1", "2")
        )
        val Brigada2 = Brigada(
            id = "BRIG12391723-19",
            nombreBrigada = "Brigada 2",
            ubicacionBrigada = "Santa Cruz",
            estadoBrigada = true,
            comandoId = "COM654321",
            unidades = listOf("2", "3")
        )
        val Brigada3 = Brigada(
            id = "BRIG12391723-92",
            nombreBrigada = "Brigada 3",
            ubicacionBrigada = "La Paz",
            estadoBrigada = true,
            comandoId = "COM123456",
            unidades = listOf("1", "3")
        )
    }
}