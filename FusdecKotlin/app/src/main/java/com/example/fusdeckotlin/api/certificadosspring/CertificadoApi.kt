package com.example.fusdeckotlin.api.certificadosspring

import retrofit2.http.GET

interface CertificadoApi {
    @GET("certificados")
    suspend fun obtenerCertificados(): List<Map<String, Any>>
}
