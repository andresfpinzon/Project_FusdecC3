package models.administrativo.auditoria.services

import models.administrativo.auditoria.model.AuditoriaModel
import models.administrativo.auditoria.repository.AuditoriaRepository

class AuditoriaController(
    private val repository: AuditoriaRepository
) {
    // Registrar una nueva auditoría
    fun registrarAuditoria(auditoriaModel: AuditoriaModel): AuditoriaModel {
        return repository.crearAuditoria(auditoriaModel)
    }

    // Actualizar una auditoría existente
    fun actualizarAuditoria(id: String, auditoriaModel: AuditoriaModel): AuditoriaModel? {
        return repository.actualizarAuditoria(id, auditoriaModel)
    }

    // Obtener una auditoría por su ID
    fun obtenerAuditoriaPorId(id: String): AuditoriaModel? {
        return repository.obtenerPorId(id)
    }

    // Obtener todas las auditorías
    fun obtenerTodasLasAuditorias(): List<AuditoriaModel> {
        return repository.obtenerTodos()
    }

    // Eliminar una auditoría por su ID
    fun eliminarAuditoria(id: String): Boolean {
        return repository.eliminarAuditoria(id)
    }
}