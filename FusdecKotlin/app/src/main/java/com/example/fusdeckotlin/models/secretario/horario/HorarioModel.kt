package models.secretario.horario

class HorarioModel(
    val id: String,
    var tituloHorario: String,
    var horaInicio: String,
    var horaFin: String,
    var estadoHorario: Boolean = true
) {
    companion object {
        val horario1 = HorarioModel(
            id = "HORA01",
            tituloHorario = "Mañana",
            horaInicio = "08:00",
            horaFin = "10:00",
            estadoHorario = true
        )

        val horario2 = HorarioModel(
            id = "HORA02",
            tituloHorario = "Tarde",
            horaInicio = "14:00",
            horaFin = "16:00",
            estadoHorario = true
        )

        val horario3 = HorarioModel(
            id = "HORA03",
            tituloHorario = "Noche",
            horaInicio = "18:00",
            horaFin = "20:00",
            estadoHorario = false
        )
    }
}

