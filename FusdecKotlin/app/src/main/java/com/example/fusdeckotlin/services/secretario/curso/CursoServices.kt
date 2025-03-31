package com.example.fusdeckotlin.services.secretario.curso

import models.secretario.curso.Curso
import java.util.*

class CursoServices {

    companion object {

        fun crearCurso(
            cursos: MutableList<Curso>,
            id: String = UUID.randomUUID().toString(),
            nombreCurso: String,
            descripcionCurso: String,
            intensidadHorariaCurso: String,
            fundacionId: String,
            estadoCurso: Boolean = true,
            ediciones: List<String> = emptyList()
        ): Curso {
            if (nombreCurso.isBlank() || descripcionCurso.isBlank() || intensidadHorariaCurso.isBlank() || fundacionId.isBlank()) {
                throw IllegalArgumentException("Los campos nombre, descripción, intensidad horaria y fundación ID son obligatorios")
            }

            val nuevoCurso = Curso(
                id = id,
                nombreCurso = nombreCurso,
                descripcionCurso = descripcionCurso,
                intensidadHorariaCurso = intensidadHorariaCurso,
                estadoCurso = estadoCurso,
                fundacionId = fundacionId,
                ediciones = ediciones
            )

            cursos.add(nuevoCurso)
            return nuevoCurso
        }

        fun listarCursosActivos(cursos: List<Curso>): List<Curso> {
            return cursos.filter { it.getEstadoCurso() }
        }

        fun obtenerCursoPorId(cursos: List<Curso>, id: String): Curso {
            return cursos.find { it.getId() == id } ?: throw NoSuchElementException("Curso no encontrado")
        }

        fun actualizarCurso(
            cursos: MutableList<Curso>,
            id: String,
            nombreCurso: String? = null,
            descripcionCurso: String? = null,
            intensidadHorariaCurso: String? = null,
            estadoCurso: Boolean? = null,
            fundacionId: String? = null,
            ediciones: List<String>? = null
        ): Curso {
            val curso = cursos.find { it.getId() == id } ?: throw NoSuchElementException("Curso no encontrado")

            nombreCurso?.let { curso.setNombreCurso(it) }
            descripcionCurso?.let { curso.setDescripcionCurso(it) }
            intensidadHorariaCurso?.let { curso.setIntensidadHorariaCurso(it) }
            estadoCurso?.let { curso.setEstadoCurso(it) }
            fundacionId?.let { curso.setFundacionId(it) }
            ediciones?.let { curso.setEdiciones(it) }

            return curso
        }

        fun desactivarCurso(cursos: MutableList<Curso>, id: String): Curso {
            val curso = cursos.find { it.getId() == id } ?: throw NoSuchElementException("Curso no encontrado")
            curso.setEstadoCurso(false)
            return curso
        }
    }
}

