package models.administrativo.certificado.implement

import Certificado
import models.administrativo.certificado.repository.CertificadoRepository
import java.util.UUID

class CertificadoRepositoryImpl : CertificadoRepository {

    private val certificadosDB = mutableMapOf<String, Certificado>()

    init {
        // Inicializar la base de datos con certificados predefinidos
        agregarCertificadosIniciales()
    }

    private fun agregarCertificadosIniciales() {
        // Cargar los certificados de ejemplo desde la clase Certificado
        val certificadosIniciales = Certificado.certificados
        // Añadir cada certificado a la base de datos
        certificadosIniciales.forEach { certificado ->
            certificadosDB[certificado.id] = certificado
        }
    }

    override fun crear(certificado: Certificado): Certificado {
        // Verificar si ya existe un certificado con el mismo código de verificación
        val codigoExistente = buscarPorCodigoVerificacion(certificado.codigoVerificacion)
        if (codigoExistente != null) {
            throw IllegalArgumentException("Ya existe un certificado con el código de verificación ${certificado.codigoVerificacion}")
        }

        val id = if(certificado.id.isBlank()) UUID.randomUUID().toString() else certificado.id

        val nuevoCertificado = Certificado(
            id = id,
            fechaEmision = certificado.fechaEmision,
            usuarioId = certificado.usuarioId,
            cursoId = certificado.cursoId,
            estudianteId = certificado.estudianteId,
            nombreEmisorCertificado = certificado.nombreEmisorCertificado,
            codigoVerificacion = certificado.codigoVerificacion,
            estadoCertificado = certificado.estadoCertificado
        )
        certificadosDB[id] = nuevoCertificado
        return nuevoCertificado
    }

    override fun obtenerPorId(id: String): Certificado? {
        return certificadosDB[id]
    }

    override fun obtenerTodos(): List<Certificado> {
        return certificadosDB.values.toList()
    }

    override fun actualizar(id: String, certificado: Certificado): Certificado? {
        if (!certificadosDB.containsKey(id)) {
            return null
        }

        // Verificar que el código de verificación no esté siendo usado por otro certificado
        val codigoExistente = buscarPorCodigoVerificacion(certificado.codigoVerificacion)
        if (codigoExistente != null && codigoExistente.id != id) {
            throw IllegalArgumentException("Ya existe otro certificado con el código de verificación ${certificado.codigoVerificacion}")
        }

        val certificadoActualizado = Certificado(
            id = id,
            fechaEmision = certificado.fechaEmision,
            usuarioId = certificado.usuarioId,
            cursoId = certificado.cursoId,
            estudianteId = certificado.estudianteId,
            nombreEmisorCertificado = certificado.nombreEmisorCertificado,
            codigoVerificacion = certificado.codigoVerificacion,
            estadoCertificado = certificado.estadoCertificado
        )

        certificadosDB[id] = certificadoActualizado
        return certificadoActualizado
    }

    override fun eliminar(id: String): Boolean {
        return certificadosDB.remove(id) != null
    }

    override fun buscarPorEstudianteId(estudianteId: String): List<Certificado> {
        return certificadosDB.values.filter { it.estudianteId == estudianteId }
    }

    override fun buscarPorCursoId(cursoId: String): List<Certificado> {
        return certificadosDB.values.filter { it.cursoId == cursoId }
    }

    override fun buscarPorCodigoVerificacion(codigo: String): Certificado? {
        return certificadosDB.values.find { it.codigoVerificacion == codigo }
    }

    override fun buscarPorUsuarioId(usuarioId: String): List<Certificado> {
        return certificadosDB.values.filter { it.usuarioId == usuarioId }
    }

    override fun certificadosActivos(): List<Certificado> {
        return certificadosDB.values.filter { it.estadoCertificado }
    }
}