package com.example.fusdeckotlin.models.secretario.estudiante

import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import com.example.fusdeckotlin.models.instructor.calificacion.Calificacion
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import com.google.gson.annotations.SerializedName
import models.administrativo.c.CertificadoModel
import java.time.LocalDate

class Estudiante(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreEstudiante") private var nombreEstudiante: String,
    @SerializedName("apellidoEstudiante") private var apellidoEstudiante: String,
    @SerializedName("correoEstudiante") private val correoEstudiante: String,
    @SerializedName("tipoDocumento") private var tipoDocumento: String,
    @SerializedName("numeroDocumento") private val numeroDocumento: String,
    @SerializedName("fechaNacimiento") private var fechaNacimientoString: String,
    @SerializedName("generoEstudiante") private var generoEstudiante: String,
    @SerializedName("unidadId") private var unidadId: String,
    @SerializedName("colegioId") private var colegioId: String,
    @SerializedName("estadoEstudiante") private var estadoEstudiante: Boolean = true,
    @SerializedName("ediciones") private var ediciones: List<Any> = emptyList(),
    @SerializedName("calificaciones") private var calificaciones: List<Any> = emptyList(),
    @SerializedName("asistencias") private var asistencias: List<Any> = emptyList(),
    @SerializedName("certificados") private var certificados: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreEstudiante(): String = nombreEstudiante
    fun getApellidoEstudiante(): String = apellidoEstudiante
    fun getCorreoEstudiante(): String = correoEstudiante
    fun getTipoDocumento(): String = tipoDocumento
    fun getNumeroDocumento(): String = numeroDocumento

    fun getFechaNacimiento(): LocalDate {
        return LocalDate.parse(fechaNacimientoString.substring(0, 10))
    }

    fun getGeneroEstudiante(): String = generoEstudiante
    fun getUnidadId(): String = unidadId
    fun getColegioId(): String = colegioId
    fun getEstadoEstudiante(): Boolean = estadoEstudiante

    // Getters para relaciones (versión objetos completos)
    fun getEdicionesObjects(): List<Edicion> {
        return ediciones.mapNotNull {
            when (it) {
                is Edicion -> it
                is String -> Edicion(
                    it,
                    "",
                    LocalDate.now().toString(),
                    LocalDate.now().toString(),
                    "",
                    "",
                    false,
                    emptyList()
                )
                is Map<*, *> -> convertMapToEdicion(it)
                else -> null
            }
        }
    }

    fun getCalificaciones(): List<Calificacion> {
        return calificaciones.mapNotNull {
            when (it) {
                is Calificacion -> it
                is String -> Calificacion(it, "", false, "", false, emptyList())
                is Map<*, *> -> convertMapToCalificacion(it)
                else -> null
            }
        }
    }

    fun getAsistencias(): List<Asistencia> {
        return asistencias.mapNotNull {
            when (it) {
                is Asistencia -> it
                is String -> Asistencia(it, "", "", "", true, emptyList())
                is Map<*, *> -> convertMapToAsistencia(it)
                else -> null
            }
        }
    }

    fun getCertificados(): List<CertificadoModel> {
        return certificados.mapNotNull {
            when (it) {
                is CertificadoModel -> it
                is String -> CertificadoModel(
                    it,
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    false,
                    // Listas vacías si el modelo las tiene como parámetros
                    //estudiantes = emptyList()
                )
                is Map<*, *> -> convertMapToCertificado(it)
                else -> null
            }
        }
    }

    // Getters para IDs de relaciones
    fun getEdicionesIds(): List<String> {
        return ediciones.map {
            when (it) {
                is String -> it
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    fun getCalificacionesIds(): List<String> {
        return calificaciones.map {
            when (it) {
                is String -> it
                is Calificacion -> it.getId()
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    fun getAsistenciasIds(): List<String> {
        return asistencias.map {
            when (it) {
                is String -> it
                is Asistencia -> it.getId()
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    fun getCertificadosIds(): List<String> {
        return certificados.map {
            when (it) {
                is String -> it
                is CertificadoModel -> it.getIdCertificado()
                is Map<*, *> -> it["id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    // Métodos de conversión de mapas
    private fun convertMapToEdicion(map: Map<*, *>): Edicion {
        return Edicion(
            id = map["_id"] as? String ?: "",
            nombreEdicion = map["nombreEdicion"] as? String ?: "",
            fechaInicioString = (map["fechaInicio"] as? String)?.substring(0, 10) ?: LocalDate.now().toString(),
            fechaFinString = (map["fechaFin"] as? String)?.substring(0, 10) ?: LocalDate.now().toString(),
            cursoId = map["cursoId"] as? String ?: "",
            instructorId = map["instructorId"] as? String ?: "",
            estadoEdicion = map["estadoEdicion"] as? Boolean ?: false,
            estudiantes = map["estudiantes"] as? List<Any> ?: emptyList()
        )
    }

    private fun convertMapToCalificacion(map: Map<*, *>): Calificacion {
        return Calificacion(
            id = map["_id"] as? String ?: "",
            tituloCalificacion = map["tituloCalificacion"] as? String ?: "",
            aprobado = map["aprobado"] as? Boolean ?: false,
            usuarioId = map["usuarioId"] as? String ?: "",
            estadoCalificacion = map["estadoCalificacion"] as? Boolean ?: false,
            estudiantes = map["estudiantes"] as? List<String> ?: emptyList()
        )
    }

    private fun convertMapToAsistencia(map: Map<*, *>): Asistencia {
        return Asistencia(
            id = map["_id"] as? String ?: "",
            tituloAsistencia = map["tituloAsistencia"] as? String ?: "",
            fechaAsistenciaString = (map["fechaAsistencia"] as? String)?.substring(0, 10) ?: "",
            usuarioId = map["usuarioId"] as? String ?: "",
            estadoAsistencia = map["estadoAsistencia"] as? Boolean ?: true,
            estudiantes = map["estudiantes"] as? List<Any> ?: emptyList()
        )
    }

    private fun convertMapToCertificado(map: Map<*, *>): CertificadoModel {
        return CertificadoModel(
            id = map["id"] as? String ?: "",
            fechaEmision = map["fechaEmision"] as? String ?: "",
            usuarioId = map["usuarioId"] as? String ?: "",
            cursoId = map["cursoId"] as? String ?: "",
            estudianteId = map["estudianteId"] as? String ?: "",
            nombreEmisorCertificado = map["nombreEmisorCertificado"] as? String ?: "",
            codigoVerificacion = map["codigoVerificacion"] as? String ?: "",
            estadoCertificado = map["estadoCertificado"] as? Boolean ?: true
        )
    }

    // Setters
    fun setNombreEstudiante(nombre: String) {
        this.nombreEstudiante = nombre
    }

    fun setApellidoEstudiante(apellido: String) {
        this.apellidoEstudiante = apellido
    }

    fun setTipoDocumento(tipoDocumento: String) {
        this.tipoDocumento = tipoDocumento
    }

    fun setFechaNacimientoString(fechaNacimiento: String) {
        this.fechaNacimientoString = fechaNacimiento
    }

    fun setGeneroEstudiante(genero: String) {
        this.generoEstudiante = genero
    }

    fun setUnidadId(unidadId: String) {
        this.unidadId = unidadId
    }

    fun setColegioId(colegioId: String) {
        this.colegioId = colegioId
    }

    fun setEstadoEstudiante(estado: Boolean) {
        this.estadoEstudiante = estado
    }

    fun setEdiciones(ediciones: List<String>) {
        this.ediciones = ediciones
    }

    fun setCalificaciones(calificaciones: List<Calificacion>) {
        this.calificaciones = calificaciones
    }

    fun setAsistencias(asistencias: List<Asistencia>) {
        this.asistencias = asistencias
    }

    fun setCertificados(certificados: List<CertificadoModel>) {
        this.certificados = certificados
    }

    override fun toString(): String {
        return "Estudiante(id='$id', nombre='$nombreEstudiante', apellido='$apellidoEstudiante', " +
                "documento=$tipoDocumento $numeroDocumento, estado=${if (estadoEstudiante) "Activo" else "Inactivo"})"
    }
}