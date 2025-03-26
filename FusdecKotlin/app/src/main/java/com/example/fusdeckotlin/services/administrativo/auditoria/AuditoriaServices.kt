package com.example.fusdeckotlin.services.administrativo.auditoria

import models.administrativo.auditoria.model.AuditoriaModel

class AuditoriaServices {

    companion object{
        fun createAuditoria(auditoriaDB: MutableList<AuditoriaModel>, data: AuditoriaModel): AuditoriaModel{
            val newAuditoria = AuditoriaModel(
                nombreEmisor = data.getNombreEmisorAuditoria(),
            )

            auditoriaDB.add(newAuditoria)
            return newAuditoria
        }

        fun removeAuditoriaById(auditoriaDB: MutableList<AuditoriaModel>, id: String): Boolean{
            val auditoria = auditoriaDB.find { it.getIdAuditoria() == id }
            return if(auditoria != null){
                auditoriaDB.remove(auditoria)
            }else {
                false
            }
        }
    }

}