package com.example.fusdeckotlin.api.administrativo.userRol

import com.example.fusdeckotlin.dto.administrativo.userRol.AddRolUserDto
import com.example.fusdeckotlin.models.administrativo.userRol.UserRolModel
import retrofit2.Response
import retrofit2.http.*

interface IUserRolApi {

    @GET("roles")
    suspend fun getRolesOfUsers(): Response<List<UserRolModel>>

    @POST("roles")
    suspend fun addRolToUser(@Body data: AddRolUserDto): Response<UserRolModel>

    @GET("roles/{document}")
    suspend fun getRolByDocumentUser(@Path("document") document: String): Response<List<UserRolModel>>

    @DELETE("roles/{document}/{rol}")
    suspend fun deleteRolToUser(@Path("document") document: String, @Path("rol") rol: String ): Response<UserRolModel>

}