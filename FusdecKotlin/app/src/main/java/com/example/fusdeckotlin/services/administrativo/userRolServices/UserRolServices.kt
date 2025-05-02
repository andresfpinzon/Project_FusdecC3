package com.example.fusdeckotlin.services.administrativo.userRolServices

import com.example.fusdeckotlin.api.administrativo.userRol.IUserRolApi
import com.example.fusdeckotlin.api.administrativo.userRol.UsuarioConRolesRequest
import com.example.fusdeckotlin.api.administrativo.userRol.UsuarioResponse
import com.example.fusdeckotlin.api.administrativo.userRol.UsuarioUpdateWithRolesRequest
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.user.UpdateUserDto
import com.example.fusdeckotlin.dto.administrativo.userRol.AddRolUserDto
import com.example.fusdeckotlin.dto.administrativo.userRol.UsuarioRolResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class UserRolServices {

    private val userRolApi: IUserRolApi = RetrofitClient.userRolApi

    suspend fun getRolesByUser(documento: String): Result<List<UsuarioRolResponse>> {
        return try {
            val res = userRolApi.getRolesByUser(documento)
            handleListResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun addRolToUser(data: AddRolUserDto): Result<UsuarioRolResponse> {
        return try {
            val res = userRolApi.addRolToUser(data)
            handleResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteRolFromUser(documento: String, rolId: Int): Result<Unit> {
        return try {
            val res = userRolApi.deleteRolFromUser(documento, rolId)
            if (res.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Error al eliminar rol"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // Nuevos métodos para gestión combinada
    suspend fun createUserWithRoles(
        numeroDocumento: String,
        nombre: String,
        apellido: String,
        correo: String,
        password: String,
        rolesIds: List<Int>
    ): Result<UsuarioResponse> {
        return try {
            val request = UsuarioConRolesRequest(
                numeroDocumento = numeroDocumento,
                nombre = nombre,
                apellido = apellido,
                correo = correo,
                password = password,
                rolesIds = rolesIds
            )
            val res = userRolApi.createUserWithRoles(request)
            handleResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateUserWithRoles(
        documento: String,
        nombre: String?,
        apellido: String?,
        correo: String?,
        password: String?,
        estado: Boolean?,
        rolesIds: List<Int>
    ): Result<UsuarioResponse> {
        return try {
            val request = UsuarioUpdateWithRolesRequest(
                usuarioUpdate = UpdateUserDto(
                    nombre = nombre,
                    apellido = apellido,
                    correo = correo,
                    password = password,
                    estado = estado
                ),
                rolesIds = rolesIds
            )
            val res = userRolApi.updateUserWithRoles(documento, request)
            handleResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}