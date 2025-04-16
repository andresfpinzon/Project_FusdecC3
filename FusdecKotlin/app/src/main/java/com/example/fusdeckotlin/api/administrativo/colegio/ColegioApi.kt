package com.example.fusdeckotlin.api.administrativo.colegio

import com.example.fusdeckotlin.dto.administrativo.colegio.ActualizarColegioRequest
import com.example.fusdeckotlin.dto.administrativo.colegio.CrearColegioRequest
import com.example.fusdeckotlin.models.administrativo.colegio.Colegio
import retrofit2.Response
import retrofit2.http.*

interface ColegioApi {
    @GET("api/colegios")
    suspend fun listarColegiosActivos(): Response<List<Colegio>>

    @POST("api/colegios")
    suspend fun crearColegio(@Body request: CrearColegioRequest): Response<Colegio>

    @PUT("api/colegios/{id}")
    suspend fun actualizarColegio(
        @Path("id") id: String,
        @Body request: ActualizarColegioRequest
    ): Response<Colegio>

    @DELETE("api/colegios/{id}")
    suspend fun desactivarColegio(@Path("id") id: String): Response<Colegio>

    @GET("api/colegios/{id}")
    suspend fun obtenerColegioPorId(@Path("id") id: String): Response<Colegio>
}