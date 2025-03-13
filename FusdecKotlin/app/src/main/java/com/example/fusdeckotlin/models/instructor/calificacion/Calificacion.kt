package models.instructor.calificacion

class Calificacion(
    val id: String,
    var tituloCalificacion: String,
    var aprobado: Boolean,
    var usuarioId: String,
    var estadoCalificacion: Boolean,
    var estudiantes: List<String>
) {
    companion object {
        val calificacion1 = Calificacion(
            id = "CAL01",
            tituloCalificacion = "Examen de Matemáticas",
            aprobado = true,
            usuarioId = "USR123456",
            estadoCalificacion = true,
            estudiantes = listOf("1", "2")
        )

        val calificacion2 = Calificacion(
            id = "CAL02",
            tituloCalificacion = "Examen de Ciencias",
            aprobado = false,
            usuarioId = "USR654321",
            estadoCalificacion = true,
            estudiantes = listOf("2", "3")
        )
    }
}