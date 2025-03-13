package servicios.instructor.calificacion

import models.instructor.calificacion.Calificacion

class CalificacionServicio(){
    companion object{

        fun crearCalificacion(
            calificaciones: MutableList<Calificacion>,
            id: String,
            tituloCalificacion: String,
            aprobado: Boolean,
            usuarioId: String,
            estadoCalificacion: Boolean = true,
            estudiantes: List<String> = emptyList()
        ): Calificacion {
            if (tituloCalificacion.isBlank() || estudiantes.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: tituloCalificacion, estudiantes")
            }

            val nuevaCalificacion = Calificacion(
                id = id,
                tituloCalificacion = tituloCalificacion,
                aprobado = aprobado,
                usuarioId = usuarioId,
                estadoCalificacion = estadoCalificacion,
                estudiantes = estudiantes
            )

            calificaciones.add(nuevaCalificacion)
            return nuevaCalificacion
        }

        fun listarCalificacionesActivas(calificaciones: List<Calificacion>): List<Calificacion> {
            return calificaciones.filter { it.estadoCalificacion }
        }

        fun buscarCalificacionPorId(calificaciones: List<Calificacion>, id: String): Calificacion {
            return calificaciones.find { it.id == id } ?: throw NoSuchElementException("Calificación no encontrada")
        }

        fun actualizarCalificacion(
            calificaciones: MutableList<Calificacion>,
            id: String,
            tituloCalificacion: String? = null,
            aprobado: Boolean? = null,
            usuarioId: String? = null,
            estadoCalificacion: Boolean? = null,
            estudiantes: List<String>? = null
        ): Calificacion {
            val calificacion = calificaciones.find { it.id == id } ?: throw NoSuchElementException("Calificación no encontrada")

            calificacion.tituloCalificacion = tituloCalificacion ?: calificacion.tituloCalificacion
            calificacion.aprobado = aprobado ?: calificacion.aprobado
            calificacion.usuarioId = usuarioId ?: calificacion.usuarioId
            calificacion.estadoCalificacion = estadoCalificacion ?: calificacion.estadoCalificacion
            calificacion.estudiantes = estudiantes ?: calificacion.estudiantes

            return calificacion
        }

        fun desactivarCalificacion(calificaciones: MutableList<Calificacion>, id: String): Calificacion {
            val calificacion = calificaciones.find { it.id == id } ?: throw NoSuchElementException("Calificación no encontrada")
            calificacion.estadoCalificacion = false
            return calificacion
        }


    }
}