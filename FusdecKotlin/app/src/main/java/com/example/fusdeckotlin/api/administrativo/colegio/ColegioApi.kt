package com.example.fusdeckotlin.api.administrativo.colegio

import com.example.fusdeckotlin.dto.administrativo.colegio.ActualizarColegioRequest
import com.example.fusdeckotlin.dto.administrativo.colegio.CrearColegioRequest
import com.example.fusdeckotlin.models.administrativo.colegio.Colegio
import retrofit2.Response
import retrofit2.http.*

interface ColegioApi {
    @GET("colegios")
    suspend fun listarColegiosActivos(): Response<List<Colegio>>

    @POST("colegios")
    suspend fun crearColegio(@Body request: CrearColegioRequest): Response<Colegio>

    @PUT("colegios/{id}")
    suspend fun actualizarColegio(
        @Path("id") id: Int,
        @Body request: ActualizarColegioRequest
    ): Response<Colegio>

    @DELETE("colegios/{id}")
    suspend fun desactivarColegio(@Path("id") id: Int): Response<Colegio>

    @GET("colegios/{id}")
    suspend fun obtenerColegioPorId(@Path("id") id: Int): Response<Colegio>
}