package com.example.fusdeckotlin.api.administrativo.auditoria

import models.administrativo.auditoria.model.AuditoriaModel
import retrofit2.http.*
import retrofit2.Response

interface IAuditoriaApi {

    @GET("api/auditorias")
    suspend fun getAuditorias(): Response<List<AuditoriaModel>>

    @POST("api/auditorias")
    suspend fun createAuditoria(): Response<AuditoriaModel>

    @GET("api/auditorias/{id}")
    suspend fun getAuditoriaById(@Path("id") id: String): Response<AuditoriaModel>

    @GET("api/auditorias/certificado/{certificadoId}")
    suspend fun getAuditoriaByCertificadoId(@Path("certificadoId") certificadoId: String): Response<AuditoriaModel>

    @DELETE("api/auditorias/{id}")
    suspend fun deleteAuditoriaById(@Path("id") id: String): Response<AuditoriaModel>
}