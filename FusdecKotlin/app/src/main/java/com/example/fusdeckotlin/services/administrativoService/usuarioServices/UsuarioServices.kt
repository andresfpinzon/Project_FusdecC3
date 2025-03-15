package com.example.fusdeckotlin.services.administrativoService.usuarioServices

import models.administrativo.user.model.Usuario

class UsuarioServices {
    companion object{

        fun createusuario(usersDB: MutableList<Usuario>, user: Usuario): Usuario{
            val newUser = Usuario(
                nombreUsuario = user.getNombreUsuario(),
                apellidoUsuario = user.getApellidoUsuario(),
                numeroDocumento = user.getNumeroDocumento(),
                correo = user.getCorreo(),
                password = user.getPassword(),
                roles = user.getRoles(),
                estadoUsuario = user.getEstadoUsuario(),
                creadoEn = user.getCreadoEn()
            )

            usersDB.add(newUser)
            return newUser
        }


        fun updateUser(usersDB: MutableList<Usuario>, id: String, updateUser: Usuario ): Usuario{
            val existeUser = usersDB.find { it.getUserId() == id }
                ?: throw NoSuchElementException("Usuario no encontrado")

            existeUser.setNombreUsuario(updateUser.getNombreUsuario())
            existeUser.setApellidoUsuario(updateUser.getApellidoUsuario())
            existeUser.setPassword(updateUser.getPassword())
            existeUser.setRoles(updateUser.getRoles())
            existeUser.setEstadoUsuario(updateUser.getEstadoUsuario())

            return existeUser
        }


        fun getAllUsersActive(usersDB: MutableList<Usuario>): List<Usuario>{
                return usersDB.filter { it.getEstadoUsuario() }
        }


        fun getUserByNit(nit: String, usersDB: MutableList<Usuario>): Usuario?{
            return usersDB.first { it.getNumeroDocumento() == nit }
        }


        fun removeUserByNit(nit: String, usersDB: MutableList<Usuario>): Boolean{
            val user = usersDB.find { it.getNumeroDocumento() == nit }

            return if (user != null){
                usersDB.remove(user)
            }else{
                false
            }
        }


        fun toggleStateUser(nit: String, usersDB: MutableList<Usuario>): Boolean{
            val user = usersDB.find { it.getNumeroDocumento() == nit }

            return  if ( user != null){
                user.setEstadoUsuario(!user.getEstadoUsuario())
                true
            } else{
                false
            }
        }

    }
}