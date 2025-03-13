import java.text.SimpleDateFormat
import java.util.Date
import java.util.UUID

data class Certificado(
    val id: String,
    val fechaEmision: Date,
    val usuarioId: String,
    val cursoId: String,
    val estudianteId: String,
    val nombreEmisorCertificado: String,
    val codigoVerificacion: String,
    val estadoCertificado: Boolean
) {
    companion object {
        private val dateFormat = SimpleDateFormat("yyyy-MM-dd")

        // Certificado 1 - Curso de programación
        val certificado1 = Certificado(
            id = "CERT-001",
            fechaEmision = dateFormat.parse("2023-05-15"),
            usuarioId = "SAJDFKLAJDO1-1", // ID de Carlos Gómez (Administrativo)
            cursoId = "CURSO-001",
            estudianteId = "EST-001",
            nombreEmisorCertificado = "Academia de Programación",
            codigoVerificacion = UUID.randomUUID().toString().substring(0, 8),
            estadoCertificado = true
        )

        // Certificado 2 - Curso de diseño gráfico
        val certificado2 = Certificado(
            id = "CERT-002",
            fechaEmision = dateFormat.parse("2023-06-20"),
            usuarioId = "NCXVNCZKVDKFA-2", // ID de Ana Pérez (Secretario)
            cursoId = "CURSO-002",
            estudianteId = "EST-002",
            nombreEmisorCertificado = "Escuela de Diseño Digital",
            codigoVerificacion = UUID.randomUUID().toString().substring(0, 8),
            estadoCertificado = true
        )

        // Certificado 3 - Curso de marketing digital
        val certificado3 = Certificado(
            id = "CERT-003",
            fechaEmision = dateFormat.parse("2023-07-10"),
            usuarioId = "YWEIRWEEYIRWH-3", // ID de Luis Martínez (Instructor)
            cursoId = "CURSO-003",
            estudianteId = "EST-003",
            nombreEmisorCertificado = "Instituto de Marketing Digital",
            codigoVerificacion = UUID.randomUUID().toString().substring(0, 8),
            estadoCertificado = true
        )

        // Certificado 4 - Curso de idiomas (expirado)
        val certificado4 = Certificado(
            id = "CERT-004",
            fechaEmision = dateFormat.parse("2022-11-05"),
            usuarioId = "SAJDFKLAJDO1-1", // ID de Carlos Gómez (Administrativo)
            cursoId = "CURSO-004",
            estudianteId = "EST-004",
            nombreEmisorCertificado = "Centro de Idiomas",
            codigoVerificacion = UUID.randomUUID().toString().substring(0, 8),
            estadoCertificado = false // Certificado expirado o revocado
        )

        // Certificado 5 - Curso de contabilidad
        val certificado5 = Certificado(
            id = "CERT-005",
            fechaEmision = dateFormat.parse("2023-09-30"),
            usuarioId = "NCXVNCZKVDKFA-2", // ID de Ana Pérez (Secretario)
            cursoId = "CURSO-005",
            estudianteId = "EST-005",
            nombreEmisorCertificado = "Escuela de Negocios",
            codigoVerificacion = UUID.randomUUID().toString().substring(0, 8),
            estadoCertificado = true
        )

        // Lista para acceder a todos los certificados
        val certificados = listOf(certificado1, certificado2, certificado3, certificado4, certificado5)
    }

    override fun toString(): String {
        val dateFormatStr = SimpleDateFormat("yyyy-MM-dd")
        return """
            |Certificado #$id
            |Emitido: ${dateFormatStr.format(fechaEmision)}
            |Por: $nombreEmisorCertificado
            |Usuario ID: $usuarioId
            |Curso ID: $cursoId
            |Estudiante ID: $estudianteId
            |Código: $codigoVerificacion
            |Estado: ${if (estadoCertificado) "Activo" else "Inactivo"}
        """.trimMargin()
    }
}