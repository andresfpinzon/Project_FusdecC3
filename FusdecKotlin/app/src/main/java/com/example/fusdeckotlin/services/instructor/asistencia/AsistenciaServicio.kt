package servicios.instructor.asistencia

import models.instructor.asistencia.Asistencia
import java.util.*

class AsistenciaServicio(){

    companion object{
        fun crearAsistencia(
            asistencias: MutableList<Asistencia>,
            id: String,
            tituloAsistencia: String,
            fechaAsistencia: Date,
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
            return asistencias.filter { it.estadoAsistencia }
        }

        fun obtenerAsistenciaPorId(asistencias: List<Asistencia>, id: String): Asistencia {
            return asistencias.find { it.id == id } ?: throw NoSuchElementException("Asistencia no encontrada")
        }

        fun actualizarAsistencia(
            asistencias: MutableList<Asistencia>,
            id: String,
            tituloAsistencia: String? = null,
            fechaAsistencia: Date? = null,
            usuarioId: String? = null,
            estadoAsistencia: Boolean? = null,
            estudiantes: List<String>? = null
        ): Asistencia {
            val asistencia = asistencias.find { it.id == id } ?: throw NoSuchElementException("Asistencia no encontrada")

            asistencia.tituloAsistencia = tituloAsistencia ?: asistencia.tituloAsistencia
            asistencia.fechaAsistencia = fechaAsistencia ?: asistencia.fechaAsistencia
            asistencia.usuarioId = usuarioId ?: asistencia.usuarioId
            asistencia.estadoAsistencia = estadoAsistencia ?: asistencia.estadoAsistencia
            asistencia.estudiantes = estudiantes ?: asistencia.estudiantes

            return asistencia
        }

        fun desactivarAsistencia(asistencias: MutableList<Asistencia>, id: String): Asistencia {
            val asistencia = asistencias.find { it.id == id } ?: throw NoSuchElementException("Asistencia no encontrada")
            asistencia.estadoAsistencia = false
            return asistencia
        }

    }
}