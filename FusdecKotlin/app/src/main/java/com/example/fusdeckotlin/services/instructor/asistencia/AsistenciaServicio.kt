package com.example.fusdeckotlin.services.instructor.asistencia

import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import java.time.LocalDate


class AsistenciaServicio(){

    companion object {
        fun crearAsistencia(
            asistencias: MutableList<Asistencia>,
            id: String,
            tituloAsistencia: String,
            fechaAsistencia: LocalDate,
            usuarioId: String,
            estadoAsistencia: Boolean = true,
            estudiantes: List<String> = emptyList()
        ): Asistencia {
            if (tituloAsistencia.isBlank() || estudiantes.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: tituloAsistencia, estudiantes")
            }

            val nuevaAsistencia = Asistencia(
                id = id,
                tituloAsistencia = tituloAsistencia,
                fechaAsistencia = fechaAsistencia,
                usuarioId = usuarioId,
                estadoAsistencia = estadoAsistencia,
                estudiantes = estudiantes
            )

            asistencias.add(nuevaAsistencia)
            return nuevaAsistencia
        }

        fun listarAsistenciasActivas(asistencias: List<Asistencia>): List<Asistencia> {
            return asistencias.filter { it.getEstadoAsistencia() }
        }

        fun obtenerAsistenciaPorId(asistencias: List<Asistencia>, id: String): Asistencia {
            return asistencias.find { it.getId() == id } ?: throw NoSuchElementException("Asistencia no encontrada")
        }

        fun actualizarAsistencia(
            asistencias: MutableList<Asistencia>,
            id: String,
            tituloAsistencia: String? = null,
            fechaAsistencia: LocalDate? = null,
            usuarioId: String? = null,
            estadoAsistencia: Boolean? = null,
            estudiantes: List<String>? = null
        ): Asistencia {
            val asistencia = asistencias.find { it.getId() == id } ?: throw NoSuchElementException("Asistencia no encontrada")

            tituloAsistencia?.let { asistencia.setTituloAsistencia(it) }
            fechaAsistencia?.let { asistencia.setFechaAsistencia(it) }
            usuarioId?.let { asistencia.setUsuarioId(it) }
            estadoAsistencia?.let { asistencia.setEstadoAsistencia(it) }
            estudiantes?.let { asistencia.setEstudiantes(it) }

            return asistencia
        }

        fun desactivarAsistencia(asistencias: MutableList<Asistencia>, id: String): Asistencia {
            val asistencia = asistencias.find { it.getId() == id } ?: throw NoSuchElementException("Asistencia no encontrada")
            asistencia.setEstadoAsistencia(false)
            return asistencia
        }
    }
}
