package com.example.fusdeckotlin.services.administrativo.usuario

import models.administrativo.user.model.UsuarioNOUse

class UsuarioServices {
    companion object{

        fun createusuario(usersDB: MutableList<UsuarioNOUse>, user: UsuarioNOUse): UsuarioNOUse{
            val newUser = UsuarioNOUse(
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


        fun updateUser(usersDB: MutableList<UsuarioNOUse>, id: String, updateUser: UsuarioNOUse ): UsuarioNOUse{
            val existeUser = usersDB.find { it.getUserId() == id }
                ?: throw NoSuchElementException("Usuario no encontrado")

            existeUser.setNombreUsuario(updateUser.getNombreUsuario())
            existeUser.setApellidoUsuario(updateUser.getApellidoUsuario())
            existeUser.setPassword(updateUser.getPassword())
            existeUser.setRoles(updateUser.getRoles())
            existeUser.setEstadoUsuario(updateUser.getEstadoUsuario())

            return existeUser
        }


        fun getAllUsersActive(usersDB: MutableList<UsuarioNOUse>): List<UsuarioNOUse>{
            return usersDB.filter { it.getEstadoUsuario() }
        }


        fun getUserByNit(nit: String, usersDB: MutableList<UsuarioNOUse>): UsuarioNOUse?{
            return usersDB.first { it.getNumeroDocumento() == nit }
        }


        fun removeUserByNit(nit: String, usersDB: MutableList<UsuarioNOUse>): Boolean{
            val user = usersDB.find { it.getNumeroDocumento() == nit }

            return if (user != null){
                usersDB.remove(user)
            }else{
                false
            }
        }


        fun toggleStateUser(nit: String, usersDB: MutableList<UsuarioNOUse>): Boolean{
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