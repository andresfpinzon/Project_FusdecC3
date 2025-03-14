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
            tituloAsistencia = "2025/03/14",
            fechaAsistencia = Date(2025, 3, 14),
            usuarioId = "USR123456",
            estadoAsistencia = true,
            estudiantes = listOf("EST01", "EST02")
        )

        val asistencia2 = Asistencia(
            id = "ASIS02",
            tituloAsistencia = "2025/03/13",
            fechaAsistencia = Date(2025,3,13),
            usuarioId = "USR654321",
            estadoAsistencia = true,
            estudiantes = listOf("EST04", "EST05")
        )
    }
}

