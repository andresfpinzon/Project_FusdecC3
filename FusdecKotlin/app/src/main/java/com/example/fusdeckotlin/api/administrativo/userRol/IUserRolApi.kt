package com.example.fusdeckotlin.api.administrativo.userRol

import com.example.fusdeckotlin.dto.administrativo.user.UpdateUserDto
import com.example.fusdeckotlin.dto.administrativo.userRol.AddRolUserDto
import com.example.fusdeckotlin.dto.administrativo.userRol.UsuarioRolResponse
import retrofit2.Response
import retrofit2.http.*

interface IUserRolApi {

    @GET("rolesAsignados/{documento}/detallado")
    suspend fun getRolesByUser(@Path("documento") documento: String): Response<List<UsuarioRolResponse>>

    @POST("rolesAsignados")
    suspend fun addRolToUser(@Body data: AddRolUserDto): Response<UsuarioRolResponse>

    @DELETE("rolesAsignados/{documento}/{rolId}")
    suspend fun deleteRolFromUser(
        @Path("documento") documento: String,
        @Path("rolId") rolId: Int
    ): Response<Void>

    // Nuevos endpoints para gestión combinada
    @POST("usuarios-management/con-roles")
    suspend fun createUserWithRoles(@Body request: UsuarioConRolesRequest): Response<UsuarioResponse>

    @PUT("usuarios-management/{documento}/con-roles")
    suspend fun updateUserWithRoles(
        @Path("documento") documento: String,
        @Body request: UsuarioUpdateWithRolesRequest
    ): Response<UsuarioResponse>
}

data class UsuarioConRolesRequest(
    val numeroDocumento: String,
    val nombre: String,
    val apellido: String,
    val correo: String,
    val password: String,
    val rolesIds: List<Int>
)

data class UsuarioUpdateWithRolesRequest(
    val usuarioUpdate: UpdateUserDto,
    val rolesIds: List<Int>
)

data class UsuarioResponse(
    val numeroDocumento: String,
    val nombre: String,
    val apellido: String,
    val correo: String,
    val estado: Boolean
)