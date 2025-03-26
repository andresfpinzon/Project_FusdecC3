package com.example.fusdeckotlin.services.administrativo.certificate

import models.administrativo.c.CertificadoModel


class CertificadoServices {
    companion object{
        private val certificateDB = mutableListOf<CertificadoModel>()

        fun createCertificate(data: CertificadoModel): CertificadoModel{
            val newCertificate = CertificadoModel(
                usuarioId = data.getUsuarioId(),
                cursoId = data.getCursoId(),
                estudianteId = data.getEstudianteId(),
                nombreEmisorCertificado = data.getNombreEmisor()
            )
            certificateDB.add(newCertificate)

            return newCertificate
        }

        fun actualizarCertificadoByCodeVerify(codeVerify: String, data: CertificadoModel): CertificadoModel?{
            val existCertificate = getCertificateByCodeVerify(codeVerify)

            existCertificate.setNombreEmisor(data.getNombreEmisor())
            existCertificate.setEstadoCertificado(data.getEstadoCertificado())

            return existCertificate
        }

        fun getCertificateByCodeVerify(codeVerify: String): CertificadoModel{
            return certificateDB.first{ it.getCodigoVerificacion() == codeVerify}
        }

        fun getAllCertificatesActives(): List<CertificadoModel>{
            return certificateDB.filter{ it.getEstadoCertificado() == true}
        }

        fun removeCertificateByCodeVerify(codeVerify: String): Boolean{
            val certificate = getCertificateByCodeVerify(codeVerify)

            return if(certificate != null){
                certificateDB.remove(certificate)
            }else{
                false
            }
        }
    }
}