package models.secretario.edicion

import java.time.LocalDate

class EdicionModel(
    val id: String,
    var tituloEdicion: String,
    var fechaInicioEdicion: LocalDate,
    var fechaFinEdicion: LocalDate,
    var estadoEdicion: Boolean = true,
    var cursoId: String,
    var horarios: List<String>,
    var estudiantes: List<String>
) {
    companion object {
        val edicion1 = EdicionModel(
            id = "EDIC01",
            tituloEdicion = "2024-1",
            fechaInicioEdicion = LocalDate.of(2024, 1, 1),
            fechaFinEdicion = LocalDate.of(2024, 6, 22),
            estadoEdicion = true,
            cursoId = "curso1",
            horarios = listOf("Lunes 8:00 - 10:00", "Miércoles 8:00 - 10:00"),
            estudiantes = listOf("1", "2", "3")
        )

        val edicion2 = EdicionModel(
            id = "EDIC02",
            tituloEdicion = "2024-2",
            fechaInicioEdicion = LocalDate.of(2024, 7, 1),
            fechaFinEdicion = LocalDate.of(2024, 12, 22),
            estadoEdicion = true,
            cursoId = "curso2",
            horarios = listOf("Martes 14:00 - 16:00", "Jueves 14:00 - 16:00"),
            estudiantes = listOf("4", "5")
        )

        val edicion3 = EdicionModel(
            id = "EDIC03",
            tituloEdicion = "2025-1",
            fechaInicioEdicion = LocalDate.of(2025, 1, 1),
            fechaFinEdicion = LocalDate.of(2025, 6, 22),
            estadoEdicion = false,
            cursoId = "curso3",
            horarios = listOf("Viernes 10:00 - 12:00"),
            estudiantes = listOf("6", "7", "8", "9")
        )
    }
}