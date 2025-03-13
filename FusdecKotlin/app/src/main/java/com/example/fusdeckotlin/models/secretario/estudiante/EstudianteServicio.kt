package models.secretario.estudiante

import java.util.*

class EstudianteServicio(){

    companion object {

        fun crearEstudiante(
            estudiantes: MutableList<Estudiante>,
            id: String,
            nombreEstudiante: String,
            apellidoEstudiante: String,
            correoEstudiante: String,
            tipoDocumento: String,
            numeroDocumento: String,
            fechaNacimiento: Date,
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
                it.correoEstudiante == correoEstudiante || it.numeroDocumento == numeroDocumento
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
            return estudiantes.find { it.id == id } ?: throw NoSuchElementException("Estudiante no encontrado")
        }

        fun actualizarEstudiante(
            estudiantes: MutableList<Estudiante>,
            id: String,
            nombreEstudiante: String? = null,
            apellidoEstudiante: String? = null,
            correoEstudiante: String? = null,
            tipoDocumento: String? = null,
            numeroDocumento: String? = null,
            fechaNacimiento: Date? = null,
            generoEstudiante: String? = null,
            unidadId: String? = null,
            colegioId: String? = null,
            estadoEstudiante: Boolean? = null,
            ediciones: List<String>? = null,
            calificaciones: List<String>? = null,
            asistencias: List<String>? = null,
            certificados: List<String>? = null
        ): Estudiante {
            val estudiante = estudiantes.find { it.id == id } ?: throw NoSuchElementException("Estudiante no encontrado")

            // Verificar si el correo o número de documento ya están en uso por otro estudiante
            if (correoEstudiante != null || numeroDocumento != null) {
                val estudianteExistente = estudiantes.find {
                    (it.correoEstudiante == correoEstudiante || it.numeroDocumento == numeroDocumento) && it.id != id
                }
                if (estudianteExistente != null) {
                    throw IllegalArgumentException("El correo o número de documento ya está registrado")
                }
            }

            // Actualizar los campos del estudiante
            estudiante.nombreEstudiante = nombreEstudiante ?: estudiante.nombreEstudiante
            estudiante.apellidoEstudiante = apellidoEstudiante ?: estudiante.apellidoEstudiante
            estudiante.correoEstudiante = correoEstudiante ?: estudiante.correoEstudiante
            estudiante.tipoDocumento = tipoDocumento ?: estudiante.tipoDocumento
            estudiante.numeroDocumento = numeroDocumento ?: estudiante.numeroDocumento
            estudiante.fechaNacimiento = fechaNacimiento ?: estudiante.fechaNacimiento
            estudiante.generoEstudiante = generoEstudiante ?: estudiante.generoEstudiante
            estudiante.unidadId = unidadId ?: estudiante.unidadId
            estudiante.colegioId = colegioId ?: estudiante.colegioId
            estudiante.estadoEstudiante = estadoEstudiante ?: estudiante.estadoEstudiante
            estudiante.ediciones = ediciones ?: estudiante.ediciones
            estudiante.calificaciones = calificaciones ?: estudiante.calificaciones
            estudiante.asistencias = asistencias ?: estudiante.asistencias
            estudiante.certificados = certificados ?: estudiante.certificados

            return estudiante
        }

        fun desactivarEstudiante(estudiantes: MutableList<Estudiante>, id: String): Estudiante {
            val estudiante = estudiantes.find { it.id == id } ?: throw NoSuchElementException("Estudiante no encontrado")
            estudiante.estadoEstudiante = false
            return estudiante
        }

    }
}