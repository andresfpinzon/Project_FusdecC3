package models.administrativo.certificado.repository

import Certificado


interface CertificadoRepository {
    fun crear(certificado: Certificado): Certificado
    fun obtenerPorId(id: String): Certificado?
    fun obtenerTodos(): List<Certificado>
    fun actualizar(id: String, certificado: Certificado): Certificado?
    fun eliminar(id: String): Boolean
    fun buscarPorEstudianteId(estudianteId: String): List<Certificado>
    fun buscarPorCursoId(cursoId: String): List<Certificado>
    fun buscarPorCodigoVerificacion(codigo: String): Certificado?
    fun buscarPorUsuarioId(usuarioId: String): List<Certificado>
    fun certificadosActivos(): List<Certificado>
}