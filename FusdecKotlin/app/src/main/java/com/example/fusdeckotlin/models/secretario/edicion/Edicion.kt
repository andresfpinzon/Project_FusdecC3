package com.example.fusdeckotlin.models.secretario.edicion

import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.models.secretario.curso.Curso
import com.google.gson.annotations.SerializedName
import java.time.LocalDate

class Edicion(
    @SerializedName("_id") private val id: String,
    @SerializedName("tituloEdicion") private var nombreEdicion: String,
    @SerializedName("fechaInicioEdicion") private var fechaInicioString: String,
    @SerializedName("fechaFinEdicion") private var fechaFinString: String,
    @SerializedName("cursoId") private var cursoId: Any,
    @SerializedName("estadoEdicion") private var estadoEdicion: Boolean = true,
    @SerializedName("estudiantes") private var estudiantes: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreEdicion(): String = nombreEdicion

    // Getters para fechas con manejo de valores nulos
    fun getFechaInicio(): LocalDate {
        return fechaInicioString.takeIf { it.isNotBlank() }?.let {
            try {
                LocalDate.parse(it.substring(0, 10))
            } catch (e: Exception) {
                LocalDate.now()
            }
        } ?: LocalDate.now()
    }

    fun getFechaFin(): LocalDate {
        return fechaFinString.takeIf { it.isNotBlank() }?.let {
            try {
                LocalDate.parse(it.substring(0, 10))
            } catch (e: Exception) {
                LocalDate.now().plusMonths(1)
            }
        } ?: LocalDate.now().plusMonths(1)
    }

    fun getEstadoEdicion(): Boolean = estadoEdicion

    // Manejo del curso
    fun getCursoId(): String {
        return when(cursoId) {
            is String -> cursoId as String
            is Curso -> (cursoId as Curso).getId()
            is Map<*, *> -> (cursoId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    fun getCurso(): Curso {
        return when(cursoId) {
            is Curso -> cursoId as Curso
            is String -> crearCursoVacio(cursoId as String)
            is Map<*, *> -> convertMapToCurso(cursoId as Map<*, *>)
            else -> crearCursoVacio("")
        }
    }

    private fun crearCursoVacio(id: String): Curso {
        return Curso(
            id = id,
            nombreCurso = "",
            descripcionCurso = "",
            intensidadHorariaCurso = "",
            estadoCurso = true,
            fundacionId = "",
            ediciones = emptyList()
        )
    }

    private fun convertMapToCurso(map: Map<*, *>): Curso {
        return Curso(
            id = map["_id"] as? String ?: "",
            nombreCurso = map["nombreCurso"] as? String ?: "",
            descripcionCurso = map["descripcionCurso"] as? String ?: "",
            intensidadHorariaCurso = map["intensidadHorariaCurso"] as? String ?: "",
            estadoCurso = map["estadoCurso"] as? Boolean ?: true,
            fundacionId = map["fundacionId"] as? String ?: "",
            ediciones = map["ediciones"] as? List<Any> ?: emptyList()
        )
    }

    // Manejo de estudiantes
    fun getEstudiantes(): List<Estudiante> {
        return estudiantes.mapNotNull {
            when (it) {
                is Estudiante -> it
                is String -> crearEstudianteVacio(it)
                is Map<*, *> -> convertMapToEstudiante(it)
                else -> null
            }
        }
    }

    fun getEstudiantesDocumentos(): List<String> {
        return estudiantes.map {
            when (it) {
                is Estudiante -> it.getNumeroDocumento()
                is String -> it
                is Map<*, *> -> it["numeroDocumento"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    private fun crearEstudianteVacio(documento: String): Estudiante {
        return Estudiante(
            numeroDocumento = documento,
            nombre = "",
            apellido = "",
            tipoDocumento = "",
            genero = "",
            unidad = "",
            colegio = "",
            edicion = "",
            grado = "",
            estado = true,
            asistenciasRegistradas = 0,
            aprobado = false
        )
    }

    private fun convertMapToEstudiante(map: Map<*, *>): Estudiante {
        return Estudiante(
            numeroDocumento = map["numeroDocumento"] as? String ?: "",
            nombre = map["nombre"] as? String ?: "",
            apellido = map["apellido"] as? String ?: "",
            tipoDocumento = map["tipoDocumento"] as? String ?: "",
            genero = map["genero"] as? String ?: "",
            unidad = map["unidad"] as? String ?: "",
            colegio = map["colegio"] as? String ?: "",
            edicion = map["edicion"] as? String ?: "",
            grado = map["grado"] as? String ?: "",
            estado = map["estado"] as? Boolean ?: true,
            asistenciasRegistradas = map["asistenciasRegistradas"] as? Int ?: 0,
            aprobado = map ["aprobado"] as? Boolean ?: false
        )
    }


    override fun toString(): String {
        return "Edicion(id='$id', nombre='$nombreEdicion', " +
                "fechas=${getFechaInicio()} a ${getFechaFin()}, " +
                "cursoId='${getCursoId()}', estudiantes=${getEstudiantesDocumentos().size})"
    }
}