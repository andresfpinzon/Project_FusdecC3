package com.example.fusdeckotlin.services.secretario.horario

import models.secretario.horario.Horario
import java.util.*

class HorarioServices {
    companion object {
        fun crearHorario(
            horarios: MutableList<Horario>,
            id: String = UUID.randomUUID().toString(),
            tituloHorario: String,
            horaInicio: String,
            horaFin: String,
            estadoHorario: Boolean = true
        ): Horario {
            if (tituloHorario.isBlank() || horaInicio.isBlank() || horaFin.isBlank()) {
                throw IllegalArgumentException("El título, la hora de inicio y la hora de fin son obligatorios")
            }

            val nuevoHorario = Horario(
                id = id,
                tituloHorario = tituloHorario,
                horaInicio = horaInicio,
                horaFin = horaFin,
                estadoHorario = estadoHorario
            )

            horarios.add(nuevoHorario)
            return nuevoHorario
        }

        fun listarHorariosActivos(horarios: List<Horario>): List<Horario> {
            return horarios.filter { it.estadoHorario }
        }

        fun obtenerHorarioPorId(horarios: List<Horario>, id: String): Horario {
            return horarios.find { it.id == id } ?: throw NoSuchElementException("Horario no encontrado")
        }

        fun actualizarHorario(
            horarios: MutableList<Horario>,
            id: String,
            tituloHorario: String? = null,
            horaInicio: String? = null,
            horaFin: String? = null,
            estadoHorario: Boolean? = null
        ): Horario {
            val horario = horarios.find { it.id == id } ?: throw NoSuchElementException("Horario no encontrado")

            tituloHorario?.let { horario.tituloHorario = it }
            horaInicio?.let { horario.horaInicio = it }
            horaFin?.let { horario.horaFin = it }
            estadoHorario?.let { horario.estadoHorario = it }

            return horario
        }

        fun desactivarHorario(horarios: MutableList<Horario>, id: String): Horario {
            val horario = horarios.find { it.id == id } ?: throw NoSuchElementException("Horario no encontrado")
            horario.estadoHorario = false
            return horario
        }

        fun eliminarHorario(horarios: MutableList<Horario>, id: String): Boolean {
            return horarios.removeIf { it.id == id }
        }
    }
}