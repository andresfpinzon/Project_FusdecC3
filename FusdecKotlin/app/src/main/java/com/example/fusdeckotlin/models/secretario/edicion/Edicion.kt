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

    // Getters modificados para manejar valores nulos
    fun getFechaInicio(): LocalDate {
        return fechaInicioString?.takeIf { it.isNotBlank() }?.let {
            try {
                LocalDate.parse(it.substring(0, 10))
            } catch (e: Exception) {
                LocalDate.now()
            }
        } ?: LocalDate.now() // Valor por defecto si es null o vacío
    }

    fun getFechaFin(): LocalDate {
        return fechaFinString?.takeIf { it.isNotBlank() }?.let {
            try {
                LocalDate.parse(it.substring(0, 10))
            } catch (e: Exception) {
                LocalDate.now().plusMonths(1) // Valor por defecto si es null o vacío
            }
        } ?: LocalDate.now().plusMonths(1)
    }

    fun getEstadoEdicion(): Boolean = estadoEdicion

    // Obtener solo el ID del curso
    fun getCursoId(): String {
        return when(cursoId) {
            is String -> cursoId as String
            is Curso -> (cursoId as Curso).getId()
            is Map<*, *> -> (cursoId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    // Obtener objeto Curso completo (puede ser un objeto vacío si solo tenemos el ID)
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

    // Obtener estudiantes como objetos completos
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

    // Obtener solo IDs de estudiantes
    fun getEstudiantesIds(): List<String> {
        return estudiantes.map {
            when (it) {
                is Estudiante -> it.getId()
                is String -> it
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    // Helper para crear estudiante vacío
    private fun crearEstudianteVacio(id: String): Estudiante {
        return Estudiante(
            id = id,
            nombreEstudiante = "",
            apellidoEstudiante = "",
            tipoDocumento = "",
            numeroDocumento = "",
            fechaNacimientoString = LocalDate.now().toString(),
            generoEstudiante = "",
            unidadId = "",
            colegioId = "",
            estadoEstudiante = true,
            ediciones = emptyList(),
            calificaciones = emptyList(),
            asistencias = emptyList(),
            certificados = emptyList()
        )
    }

    // Conversor de Map a Estudiante con todos los campos
    private fun convertMapToEstudiante(map: Map<*, *>): Estudiante {
        return Estudiante(
            id = map["_id"] as? String ?: "",
            nombreEstudiante = map["nombreEstudiante"] as? String ?: "",
            apellidoEstudiante = map["apellidoEstudiante"] as? String ?: "",
            tipoDocumento = map["tipoDocumento"] as? String ?: "",
            numeroDocumento = map["numeroDocumento"] as? String ?: "",
            fechaNacimientoString = (map["fechaNacimiento"] as? String)?.take(10) ?: LocalDate.now().toString(),
            generoEstudiante = map["generoEstudiante"] as? String ?: "",
            unidadId = map["unidadId"] as? String ?: "",
            colegioId = map["colegioId"] as? String ?: "",
            estadoEstudiante = map["estadoEstudiante"] as? Boolean ?: true,
            ediciones = map["ediciones"] as? List<String> ?: emptyList(),
            calificaciones = map["calificaciones"] as? List<String> ?: emptyList(),
            asistencias = map["asistencias"] as? List<String> ?: emptyList(),
            certificados = map["certificados"] as? List<String> ?: emptyList()
        )
    }

    // Setters
    fun setNombreEdicion(nombre: String) {
        this.nombreEdicion = nombre
    }

    fun setFechaInicio(fecha: LocalDate) {
        this.fechaInicioString = fecha.toString()
    }

    fun setFechaFin(fecha: LocalDate) {
        this.fechaFinString = fecha.toString()
    }

    fun setCursoId(cursoId: String) {
        this.cursoId = cursoId
    }

    fun setEstadoEdicion(estado: Boolean) {
        this.estadoEdicion = estado
    }

    // Setter para lista de objetos Estudiante
    fun setEstudiantes(estudiantes: List<Estudiante>) {
        this.estudiantes = estudiantes
    }

    // Setter para lista de IDs
    fun setEstudiantesIds(estudiantesIds: List<String>) {
        this.estudiantes = estudiantesIds
    }

    override fun toString(): String {
        return "Edicion(id='$id', nombre='$nombreEdicion', " +
                "fechas=${getFechaInicio()} a ${getFechaFin()}, " +
                "cursoId='$cursoId', estudiantes=${getEstudiantesIds().size})"
    }
}