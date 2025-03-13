package models.administrativo.certificado.services

import models.administrativo.certificado.repository.CertificadoRepository
import models.administrativo.user.repository.UsuarioRepository
import Certificado

class CertificadoService(
    private val repository: CertificadoRepository,
    private val usuarioRepository: UsuarioRepository
) {
    fun emitirCertificado(certificado: Certificado): Result<Certificado> {
        // Validar que no exista un certificado con el mismo código de verificación
        repository.buscarPorCodigoVerificacion(certificado.codigoVerificacion)?.let {
            return Result.failure(Exception("Ya existe un certificado con ese código de verificación"))
        }

        // Validar que el certificado tenga todos los campos requeridos
        if (certificado.usuarioId.isBlank() ||
            certificado.cursoId.isBlank() ||
            certificado.estudianteId.isBlank() ||
            certificado.codigoVerificacion.isBlank()
        ) {
            return Result.failure(Exception("Todos los campos del certificado son obligatorios"))
        }

        // Si todo está bien, crear el certificado
        return Result.success(repository.crear(certificado))
    }

    fun actualizarCertificado(id: String, certificado: Certificado): Result<Certificado> {
        val certificadoExistente = repository.obtenerPorId(id) ?:
        return Result.failure(Exception("Certificado no encontrado"))

        // Si se cambia el código de verificación, verificar que no exista ya
        if (certificado.codigoVerificacion != certificadoExistente.codigoVerificacion) {
            repository.buscarPorCodigoVerificacion(certificado.codigoVerificacion)?.let {
                return Result.failure(Exception("Ya existe un certificado con ese código de verificación"))
            }
        }

        val certificadoActualizado = repository.actualizar(id, certificado)
            ?: return Result.failure(Exception("Error al actualizar certificado"))

        return Result.success(certificadoActualizado)
    }

    fun revocarCertificado(id: String): Result<Certificado> {
        val certificadoExistente = repository.obtenerPorId(id) ?:
        return Result.failure(Exception("Certificado no encontrado"))

        if (!certificadoExistente.estadoCertificado) {
            return Result.failure(Exception("El certificado ya está revocado"))
        }

        val certificadoRevocado = Certificado(
            id = certificadoExistente.id,
            fechaEmision = certificadoExistente.fechaEmision,
            usuarioId = certificadoExistente.usuarioId,
            cursoId = certificadoExistente.cursoId,
            estudianteId = certificadoExistente.estudianteId,
            nombreEmisorCertificado = certificadoExistente.nombreEmisorCertificado,
            codigoVerificacion = certificadoExistente.codigoVerificacion,
            estadoCertificado = false
        )

        val resultado = repository.actualizar(id, certificadoRevocado)
            ?: return Result.failure(Exception("Error al revocar certificado"))

        return Result.success(resultado)
    }

    fun eliminarCertificado(id: String): Result<Boolean> {
        if (repository.obtenerPorId(id) == null) {
            return Result.failure(Exception("Certificado no encontrado"))
        }

        val eliminado = repository.eliminar(id)
        return if (eliminado) {
            Result.success(true)
        } else {
            Result.failure(Exception("Error al eliminar certificado"))
        }
    }

    fun obtenerCertificadoPorId(id: String): Result<Certificado> {
        val certificado = repository.obtenerPorId(id)
            ?: return Result.failure(Exception("Certificado no encontrado"))

        return Result.success(certificado)
    }

    fun verificarCertificado(codigo: String): Result<Boolean> {
        val certificado = repository.buscarPorCodigoVerificacion(codigo)
            ?: return Result.failure(Exception("Certificado no encontrado"))

        return Result.success(certificado.estadoCertificado)
    }

    fun listarCertificados(): List<Certificado> {
        return repository.obtenerTodos()
    }

    fun listarCertificadosEstudiante(estudianteId: String): List<Certificado> {
        return repository.buscarPorEstudianteId(estudianteId)
    }

    fun listarCertificadosCurso(cursoId: String): List<Certificado> {
        return repository.buscarPorCursoId(cursoId)
    }
}