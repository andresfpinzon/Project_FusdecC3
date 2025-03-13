package models.secretario.curso

class CursoServices {

    companion object {
        fun crearCurso(
            cursos: MutableList<CursoModel>,
            id: String,
            nombreCurso: String,
            descripcionCurso: String,
            intensidadHorariaCurso: String,
            estadoCurso: Boolean = true,
            fundacionId: String,
            ediciones: List<String> = emptyList()
        ): CursoModel {
            if (nombreCurso.isBlank() || descripcionCurso.isBlank() || intensidadHorariaCurso.isBlank()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreCurso, descripcionCurso, intensidadHorariaCurso")
            }

            val nuevoCurso = CursoModel(
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

        fun listarCursosActivos(cursos: List<CursoModel>): List<CursoModel> {
            return cursos.filter { it.estadoCurso }
        }

        fun obtenerCursoPorId(cursos: List<CursoModel>, id: String): CursoModel {
            return cursos.find { it.id == id } ?: throw NoSuchElementException("Curso no encontrado")
        }

        fun actualizarCurso(
            cursos: MutableList<CursoModel>,
            id: String,
            nombreCurso: String? = null,
            descripcionCurso: String? = null,
            intensidadHorariaCurso: String? = null,
            estadoCurso: Boolean? = null
        ): CursoModel {
            val curso = cursos.find { it.id == id } ?: throw NoSuchElementException("Curso no encontrado")

            curso.nombreCurso = nombreCurso ?: curso.nombreCurso
            curso.descripcionCurso = descripcionCurso ?: curso.descripcionCurso
            curso.intensidadHorariaCurso = intensidadHorariaCurso ?: curso.intensidadHorariaCurso
            curso.estadoCurso = estadoCurso ?: curso.estadoCurso

            return curso
        }

        fun desactivarCurso(cursos: MutableList<CursoModel>, id: String): CursoModel {
            val curso = cursos.find { it.id == id } ?: throw NoSuchElementException("Curso no encontrado")
            curso.estadoCurso = false
            return curso
        }
    }
}
