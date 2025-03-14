package models.administrativo.auditoria.repository

import models.administrativo.auditoria.model.AuditoriaModel

interface AuditoriaRepository {
    fun crearAuditoria(auditoria: AuditoriaModel): AuditoriaModel
    fun obtenerPorId(id: String): AuditoriaModel?
    fun obtenerTodos(): List<AuditoriaModel>
    fun actualizarAuditoria(id: String, auditoria: AuditoriaModel): AuditoriaModel?
    fun eliminarAuditoria(id: String): Boolean
}