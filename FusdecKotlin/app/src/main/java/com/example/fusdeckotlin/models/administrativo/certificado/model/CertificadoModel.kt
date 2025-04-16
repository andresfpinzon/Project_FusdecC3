package models.administrativo.c
import com.example.fusdeckotlin.models.secretario.curso.Curso
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName
import models.administrativo.user.model.Usuario
import java.util.*

data class CertificadoModel(
    @SerializedName("_id")
    private val id: String? = null,
    @SerializedName("fechaEmision")
    private val fechaEmision: String = obtenerFechaActual(),
    @SerializedName("usuarioId")
    private val usuarioId: Any,
    @SerializedName("usuarioId")
    private val cursoId: Any,
    @SerializedName("estudianteId")
    private val estudianteId: Any,
    @SerializedName("nombreEmisorCertificado")
    private var nombreEmisorCertificado: String,
    @SerializedName("codigoVerificacion")
    private val codigoVerificacion: String = generarCodigoVerificacion(),
    @SerializedName("estadoCertificado")
    private var estadoCertificado: Boolean = true
) {

    /**
     * Getters
     * */

    fun getIdCertificado(): String = id.toString()

    fun getFechaEmisio(): String = fechaEmision

    fun getUsuarioId(): String {
        return  when(usuarioId) {
            is String -> usuarioId as String
            is Usuario -> (usuarioId as Usuario).getUserId() ?: ""
            is Map<*, *> -> (usuarioId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    fun getCursoId(): String {
        return  when(cursoId) {
            is String -> cursoId as String
            is Curso -> (cursoId as Curso).getId() ?: ""
            is Map<*, *> -> (cursoId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    fun getEstudianteId(): String{
        return  when(estudianteId) {
            is String -> estudianteId as String
            is Estudiante -> (estudianteId as Estudiante).getId() ?: ""
            is Map<*, *> -> (estudianteId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    fun getNombreEmisor(): String = nombreEmisorCertificado

    fun getCodigoVerificacion(): String = codigoVerificacion

    fun getEstadoCertificado(): Boolean = estadoCertificado
    /***********************************************/

    /**
     * Setters
     * */
    fun setNombreEmisor(newNameEmisor: String){
        nombreEmisorCertificado = newNameEmisor
    }

    fun setEstadoCertificado(newState: Boolean){
        estadoCertificado = newState
    }

    /***********************************************/


    companion object {
        // Certificado 1 - Curso de programación
        val certificado1 = CertificadoModel(
            usuarioId = "SAJDFKLAJDO1-1", // ID de Carlos Gómez (Administrativo)
            cursoId = "CURSO-001",
            estudianteId = "EST-001",
            nombreEmisorCertificado = "Academia de Programación",
            estadoCertificado = true
        )

        // Certificado 2 - Curso de diseño gráfico
        val certificado2 = CertificadoModel(
            usuarioId = "NCXVNCZKVDKFA-2", // ID de Ana Pérez (Secretario)
            cursoId = "CURSO-002",
            estudianteId = "EST-002",
            nombreEmisorCertificado = "Escuela de Diseño Digital",
            estadoCertificado = true
        )

        // Certificado 3 - Curso de marketing digital
        val certificado3 = CertificadoModel(
            usuarioId = "YWEIRWEEYIRWH-3", // ID de Luis Martínez (Instructor)
            cursoId = "CURSO-003",
            estudianteId = "EST-003",
            nombreEmisorCertificado = "Instituto de Marketing Digital",
            estadoCertificado = true
        )

        // Certificado 4 - Curso de idiomas (expirado)
        val certificado4 = CertificadoModel(
            usuarioId = "SAJDFKLAJDO1-1", // ID de Carlos Gómez (Administrativo)
            cursoId = "CURSO-004",
            estudianteId = "EST-004",
            nombreEmisorCertificado = "Centro de Idiomas",
            estadoCertificado = false // Certificado expirado o revocado
        )

        // Certificado 5 - Curso de contabilidad
        val certificado5 = CertificadoModel(
            usuarioId = "NCXVNCZKVDKFA-2", // ID de Ana Pérez (Secretario)
            cursoId = "CURSO-005",
            estudianteId = "EST-005",
            nombreEmisorCertificado = "Escuela de Negocios",
            estadoCertificado = true
        )

        // Lista para acceder a todos los certificados
        val certificados = listOf(certificado1, certificado2, certificado3, certificado4, certificado5)

        fun generarId():String{
            return UUID.randomUUID().toString()
        }

        fun obtenerFechaActual(): String{
            val formato = java.text.SimpleDateFormat("yyyy-MM-dd")

            return formato.format(java.util.Date())
        }

        fun generarCodigoVerificacion(): String {
            return UUID.randomUUID().toString().substring(0, 8)
        }
    }

    override fun toString(): String {
        return """
            |Certificado #${getIdCertificado()}
            |Emitido: ${getFechaEmisio()}
            |Por: ${getNombreEmisor()}
            |Usuario ID: ${getUsuarioId()}
            |Curso ID: ${getCursoId()}
            |Estudiante ID: ${getEstudianteId()}
            |Código: ${getCodigoVerificacion()}
            |Estado: ${if (getEstadoCertificado()) "Activo" else "Inactivo"}
        """.trimMargin()
    }


}