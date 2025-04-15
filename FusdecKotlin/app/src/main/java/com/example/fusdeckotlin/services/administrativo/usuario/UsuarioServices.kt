package com.example.fusdeckotlin.services.administrativo.usuario

import com.example.fusdeckotlin.api.administrativo.user.IUserApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.user.CreateUserDto
import com.example.fusdeckotlin.dto.administrativo.user.UpdateUserDto
import models.administrativo.user.model.Usuario
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
class UsuarioServices {

    private val userApi : IUserApi  = RetrofitClient.userApi

    suspend fun createUser(data: CreateUserDto): Result<Usuario>{
        return  try {
            val res = userApi.createUser(data)
            handleResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getUsersActives(): Result<List<Usuario>>{
        return try {
            val res = userApi. getUsers()
            handleListResponse(res) {it.filter { user -> user. getEstadoUsuario() == true }}
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getUserById(id: String): Result<Usuario>{
        return try {
            val res = userApi.getUserById(id)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun updateUser(id: String, data: UpdateUserDto): Result<Usuario>{
        return try {
            val res = userApi.updateUser(id, data)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun deleteUserById(id: String): Result<Usuario>{
        return try {
            val res = userApi.deleteUserById(id)
            if( res .isSuccessful){
                res.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Respuesta: Vacio el servidor"))
            }else {
                when (res.code()){
                    404 -> Result.failure(Exception("Usuario no encontrada"))
                    else -> Result.failure(Exception("Error del servidor: ${res.code()}"))
                }
            }
        } catch (e: Exception){
            Result.failure(e)
        }
    }

//    companion object{
//
//        fun createusuario(usersDB: MutableList<Usuario>, user: Usuario): Usuario{
//            val newUser = Usuario(
//                nombreUsuario = user.getNombreUsuario(),
//                apellidoUsuario = user.getApellidoUsuario(),
//                numeroDocumento = user.getNumeroDocumento(),
//                correo = user.getCorreo(),
//                password = user.getPassword(),
//                roles = user.getRoles(),
//                estadoUsuario = user.getEstadoUsuario(),
//                creadoEn = user.getCreadoEn()
//            )
//
//            usersDB.add(newUser)
//            return newUser
//        }
//
//
//        fun updateUser(usersDB: MutableList<Usuario>, id: String, updateUser: Usuario ): Usuario{
//            val existeUser = usersDB.find { it.getUserId() == id }
//                ?: throw NoSuchElementException("Usuario no encontrado")
//
//            existeUser.setNombreUsuario(updateUser.getNombreUsuario())
//            existeUser.setApellidoUsuario(updateUser.getApellidoUsuario())
//            existeUser.setPassword(updateUser.getPassword())
//            existeUser.setRoles(updateUser.getRoles())
//            existeUser.setEstadoUsuario(updateUser.getEstadoUsuario())
//
//            return existeUser
//        }
//
//
//        fun getAllUsersActive(usersDB: MutableList<Usuario>): List<Usuario>{
//            return usersDB.filter { it.getEstadoUsuario() }
//        }
//
//
//        fun getUserByNit(nit: String, usersDB: MutableList<Usuario>): Usuario?{
//            return usersDB.first { it.getNumeroDocumento() == nit }
//        }
//
//
//        fun removeUserByNit(nit: String, usersDB: MutableList<Usuario>): Boolean{
//            val user = usersDB.find { it.getNumeroDocumento() == nit }
//
//            return if (user != null){
//                usersDB.remove(user)
//            }else{
//                false
//            }
//        }
//
//
//        fun toggleStateUser(nit: String, usersDB: MutableList<Usuario>): Boolean{
//            val user = usersDB.find { it.getNumeroDocumento() == nit }
//
//            return  if ( user != null){
//                user.setEstadoUsuario(!user.getEstadoUsuario())
//                true
//            } else{
//                false
//            }
//        }
//
//    }
}