package com.example.fusdeckotlin.api.administrativo.auditoria

import com.example.fusdeckotlin.dto.administrativo.auditoria.CreateAuditoriaDto
import com.example.fusdeckotlin.models.administrativo.auditoria.Auditoria
import retrofit2.http.*
import retrofit2.Response

interface AuditoriaApi {

    @GET("api/auditorias")
    suspend fun getAuditorias(): Response<List<Auditoria>>

    @POST("api/auditorias")
    suspend fun createAuditoria(data: CreateAuditoriaDto): Response<Auditoria>

    @GET("api/auditorias/{id}")
    suspend fun getAuditoriaById(@Path("id") id: String): Response<Auditoria>

    @GET("api/auditorias/certificado/{certificadoId}")
    suspend fun getAuditoriaByCertificadoId(@Path("certificadoId") certificadoId: String): Response<Auditoria>

    @DELETE("api/auditorias/{id}")
    suspend fun deleteAuditoriaById(@Path("id") id: String): Response<Auditoria>
}