package models.administrativo.unidad

class Unidad(
    val id: String,
    var nombreUnidad: String,
    var estadoUnidad: Boolean,
    var brigadaId: String,
    var usuarioId: String,
    var estudiantes: List<String>
){

    companion object{
        val Unidad1 = Unidad(
            id = "UNI12391723-91",
            nombreUnidad = "Unidad 1",
            estadoUnidad = true,
            brigadaId = "BRIG12391723-91",
            usuarioId = "USU123456",
            estudiantes = listOf("1", "2")
        )
        val Unidad2 = Unidad(
            id = "UNI12391723-19",
            nombreUnidad = "Unidad 2",
            estadoUnidad = true,
            brigadaId = "BRIG12391723-19",
            usuarioId = "USU654321",
            estudiantes = listOf("2", "3")
        )
        val Unidad3 = Unidad(
            id = "UNI12391723-92",
            nombreUnidad = "Unidad 3",
            estadoUnidad = true,
            brigadaId = "BRIG12391723-92",
            usuarioId = "USU123456",
            estudiantes = listOf("1", "3")
        )
    }
}