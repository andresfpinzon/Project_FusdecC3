package com.example.fusdeckotlin.services.instructor.calificacion

import com.example.fusdeckotlin.models.instructor.calificacion.Calificacion

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
            return calificaciones.filter { it.getEstadoCalificacion() }
        }

        fun buscarCalificacionPorId(calificaciones: List<Calificacion>, id: String): Calificacion {
            return calificaciones.find { it.getId() == id } ?: throw NoSuchElementException("Calificación no encontrada")
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
            val calificacion = calificaciones.find { it.getId() == id } ?: throw NoSuchElementException("Calificación no encontrada")

            tituloCalificacion?.let { calificacion.setTituloCalificacion(it) }
            aprobado?.let {  calificacion.setAprobado(it)}
            usuarioId?.let { calificacion.setUsuarioId(it) }
            estadoCalificacion?.let { calificacion.setEstadoCalificacion(it) }
            estudiantes?.let { calificacion.setEstudiantes(it) }

            return calificacion
        }

        fun desactivarCalificacion(calificaciones: MutableList<Calificacion>, id: String): Calificacion {
            val calificacion = calificaciones.find { it.getId()== id } ?: throw NoSuchElementException("Calificación no encontrada")
            calificacion.setEstadoCalificacion(false)
            return calificacion
        }


    }
}