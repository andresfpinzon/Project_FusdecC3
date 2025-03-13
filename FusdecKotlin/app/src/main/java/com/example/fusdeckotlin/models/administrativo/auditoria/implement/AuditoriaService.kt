package models.administrativo.auditoria.implement

import models.administrativo.auditoria.model.AuditoriaModel
import models.administrativo.auditoria.repository.AuditoriaRepository

class AuditoriaService : AuditoriaRepository {

    private val auditoriaDB = mutableMapOf<String, AuditoriaModel>()

    init {
        auditoriasIniciales()
    }

    private fun auditoriasIniciales() {
        val auditoriasIniciales = AuditoriaModel.auditoriasQuemadas
        auditoriasIniciales.forEach { auditoria ->
            auditoriaDB[auditoria._id] = auditoria
        }
    }

    override fun crearAuditoria(auditoria: AuditoriaModel): AuditoriaModel {
        // Verificar si la auditoría ya existe
        if (auditoriaDB.containsKey(auditoria._id)) {
            throw IllegalArgumentException("Ya existe una auditoría con el ID: ${auditoria._id}")
        }
//        // Validar que no exista una auditoría con el mismo certificadoId y nombreEmisor
//        val existeDuplicado = auditoriaDB.values.any { existingAuditoria ->
//            existingAuditoria.certificadoId == auditoria.certificadoId &&
//                    existingAuditoria.nombreEmisor == auditoria.nombreEmisor
//        }
//
//        if (existeDuplicado) {
//            throw IllegalArgumentException("Ya existe una auditoría con el mismo certificado y emisor.")
//        }

        // Agregar la auditoría al repositorio
        auditoriaDB[auditoria._id] = auditoria
        return auditoria
    }

    override fun obtenerPorId(id: String): AuditoriaModel? {
        return auditoriaDB[id]
    }

    override fun obtenerTodos(): List<AuditoriaModel> {
        return auditoriaDB.values.toList()
    }

    override fun actualizarAuditoria(id: String, auditoria: AuditoriaModel): AuditoriaModel? {
        // Verificar si la auditoría existe
        if (!auditoriaDB.containsKey(id)) {
            throw IllegalArgumentException("No existe una auditoría con el ID: $id")
        }

        // Actualizar la auditoría en el repositorio
        auditoriaDB[id] = auditoria
        return auditoria
    }

    override fun eliminarAuditoria(id: String): Boolean {
        return auditoriaDB.remove(id) != null
    }
}