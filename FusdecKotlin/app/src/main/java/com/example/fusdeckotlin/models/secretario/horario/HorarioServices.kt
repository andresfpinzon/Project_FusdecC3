package models.secretario.horario

import java.util.*

class HorarioServices {
    companion object {
        private val horarios = mutableListOf<HorarioModel>()

        fun crearHorario(
            id: String = UUID.randomUUID().toString(),
            tituloHorario: String,
            horaInicio: String,
            horaFin: String,
            estadoHorario: Boolean = true
        ): HorarioModel {
            if (tituloHorario.isBlank() || horaInicio.isBlank() || horaFin.isBlank()) {
                throw IllegalArgumentException("El título, la hora de inicio y la hora de fin son obligatorios")
            }

            val nuevoHorario = HorarioModel(
                id = id,
                tituloHorario = tituloHorario,
                horaInicio = horaInicio,
                horaFin = horaFin,
                estadoHorario = estadoHorario
            )

            horarios.add(nuevoHorario)
            return nuevoHorario
        }

        fun listarHorarios(): List<HorarioModel> = horarios

        fun obtenerHorarioPorId(id: String): HorarioModel {
            return horarios.find { it.id == id } ?: throw NoSuchElementException("Horario no encontrado")
        }

        fun actualizarHorario(
            id: String,
            tituloHorario: String? = null,
            horaInicio: String? = null,
            horaFin: String? = null,
            estadoHorario: Boolean? = null
        ): HorarioModel {
            val horario = obtenerHorarioPorId(id)

            horario.tituloHorario = tituloHorario ?: horario.tituloHorario
            horario.horaInicio = horaInicio ?: horario.horaInicio
            horario.horaFin = horaFin ?: horario.horaFin
            horario.estadoHorario = estadoHorario ?: horario.estadoHorario

            return horario
        }

        fun desactivarHorario(id: String): HorarioModel {
            val horario = obtenerHorarioPorId(id)
            horario.estadoHorario = false
            return horario
        }

        fun eliminarHorario(id: String): Boolean {
            return horarios.removeIf { it.id == id }
        }
    }
}
