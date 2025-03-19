package com.example.fusdeckotlin.services.secretario.estudiante

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import java.time.LocalDate


class EstudianteServicio {

    companion object {

        fun crearEstudiante(
            estudiantes: MutableList<Estudiante>,
            id: String,
            nombreEstudiante: String,
            apellidoEstudiante: String,
            correoEstudiante: String,
            tipoDocumento: String,
            numeroDocumento: String,
            fechaNacimiento: LocalDate,
            generoEstudiante: String,
            unidadId: String,
            colegioId: String,
            estadoEstudiante: Boolean,
            ediciones: List<String>,
            calificaciones: List<String>,
            asistencias: List<String>,
            certificados: List<String>
        ): Estudiante {

            val estudianteExistente = estudiantes.find {
                it.getCorreoEstudiante() == correoEstudiante || it.getNumeroDocumento() == numeroDocumento
            }

            if (estudianteExistente != null) {
                throw IllegalArgumentException("El correo o número de documento ya está registrado")
            }

            val nuevoEstudiante = Estudiante(
                id = id,
                nombreEstudiante = nombreEstudiante,
                apellidoEstudiante = apellidoEstudiante,
                correoEstudiante = correoEstudiante,
                tipoDocumento = tipoDocumento,
                numeroDocumento = numeroDocumento,
                fechaNacimiento = fechaNacimiento,
                generoEstudiante = generoEstudiante,
                unidadId = unidadId,
                colegioId = colegioId,
                estadoEstudiante = estadoEstudiante,
                ediciones = ediciones,
                calificaciones = calificaciones,
                asistencias = asistencias,
                certificados = certificados
            )

            estudiantes.add(nuevoEstudiante)
            return nuevoEstudiante
        }

        fun listarEstudiantes(estudiantes: List<Estudiante>): List<Estudiante> {
            return estudiantes
        }

        fun obtenerEstudiantePorId(estudiantes: List<Estudiante>, id: String): Estudiante {
            return estudiantes.find { it.getId() == id } ?: throw NoSuchElementException("Estudiante no encontrado")
        }

        fun actualizarEstudiante(
            estudiantes: MutableList<Estudiante>,
            id: String,
            nombreEstudiante: String? = null,
            apellidoEstudiante: String? = null,
            tipoDocumento: String? = null,
            fechaNacimiento: LocalDate? = null,
            generoEstudiante: String? = null,
            unidadId: String? = null,
            colegioId: String? = null,
            estadoEstudiante: Boolean? = null,
            ediciones: List<String>? = null,
            calificaciones: List<String>? = null,
            asistencias: List<String>? = null,
            certificados: List<String>? = null
        ): Estudiante {
            val estudiante = estudiantes.find { it.getId() == id } ?: throw NoSuchElementException("Estudiante no encontrado")

            nombreEstudiante?.let { estudiante.setNombreEstudiante(it) }
            apellidoEstudiante?.let { estudiante.setApellidoEstudiante(it) }
            tipoDocumento?.let { estudiante.setTipoDocumento(it) }
            fechaNacimiento?.let { estudiante.setFechaNacimiento(it) }
            generoEstudiante?.let { estudiante.setGeneroEstudiante(it) }
            unidadId?.let { estudiante.setUnidadId(it) }
            colegioId?.let { estudiante.setColegioId(it) }
            estadoEstudiante?.let { estudiante.setEstadoEstudiante(it) }
            ediciones?.let { estudiante.setEdiciones(it) }
            calificaciones?.let { estudiante.setCalificaciones(it) }
            asistencias?.let { estudiante.setAsistencias(it) }
            certificados?.let { estudiante.setCertificados(it) }

            return estudiante
        }

        fun desactivarEstudiante(estudiantes: MutableList<Estudiante>, id: String): Estudiante {
            val estudiante = estudiantes.find { it.getId() == id } ?: throw NoSuchElementException("Estudiante no encontrado")
            estudiante.setEstadoEstudiante(false)
            return estudiante
        }
    }
}