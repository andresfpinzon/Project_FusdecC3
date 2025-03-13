package models.instructor.asistencia

import java.util.Date

class Asistencia(
    val id: String,
    var tituloAsistencia: String,
    var fechaAsistencia: Date,
    var usuarioId: String,
    var estadoAsistencia: Boolean = true,
    var estudiantes: List<String>
) {
    companion object {
        val asistencia1 = Asistencia(
            id = "ASIS01",
            tituloAsistencia = "Clase de Matemáticas",
            fechaAsistencia = Date(2023, 10, 5),
            usuarioId = "USR123456",
            estadoAsistencia = true,
            estudiantes = listOf("1", "2")
        )

        val asistencia2 = Asistencia(
            id = "ASIS02",
            tituloAsistencia = "Clase de Ciencias",
            fechaAsistencia = Date(2023, 10, 6),
            usuarioId = "USR654321",
            estadoAsistencia = true,
            estudiantes = listOf("2", "3")
        )
    }
}

