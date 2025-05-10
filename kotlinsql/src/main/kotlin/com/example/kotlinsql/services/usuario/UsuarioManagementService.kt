package com.example.kotlinsql.services.usuario

import com.example.kotlinsql.dto.usuario.UsuarioCreateRequest
import com.example.kotlinsql.dto.usuario.UsuarioRolCreateRequest
import com.example.kotlinsql.dto.usuario.UsuarioUpdateRequest
import com.example.kotlinsql.model.usuario.Usuario
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional


@Service
class UsuarioManagementService(
    private val usuarioService: UsuarioService,
    private val usuarioRolService: UsuarioRolService,
    private val rolService: RolService
) {
    @Transactional
    fun crearUsuarioConRoles(usuario: UsuarioCreateRequest, rolesIds: List<Int>): Usuario {
        // 1. Primero crear el usuario
        val usuarioCreado = usuarioService.crear(usuario)

        // 2. Luego asignar los roles
        rolesIds.forEach { rolId ->
            val rol = rolService.obtenerPorId(rolId) ?:
            throw IllegalArgumentException("Rol con ID $rolId no encontrado")

            usuarioRolService.crear(
                UsuarioRolCreateRequest(
                    usuarioNumeroDocumento = usuarioCreado.numeroDocumento,
                    rolId = rol.id
                )
            )
        }

        return usuarioCreado
    }

    @Transactional
    fun actualizarUsuarioConRoles(
        documento: String,
        usuarioUpdate: UsuarioUpdateRequest,
        nuevosRolesIds: List<Int>
    ): Usuario {
        // 1. Primero actualizar los datos básicos del usuario
        val usuarioActualizado = usuarioService.actualizar(documento, usuarioUpdate)
            ?: throw IllegalArgumentException("Usuario no encontrado")

        // 2. Obtener roles actuales del usuario
        val rolesActuales = usuarioRolService.obtenerPorDocumento(documento)
            .map { it.rolId }

        // 3. Calcular diferencias
        val rolesParaAgregar = nuevosRolesIds - rolesActuales.toSet()
        val rolesParaEliminar = rolesActuales - nuevosRolesIds.toSet()

        // 4. Eliminar roles que ya no están en la nueva lista
        rolesParaEliminar.forEach { rolId ->
            usuarioRolService.eliminar(documento, rolId)
        }

        // 5. Agregar nuevos roles
        rolesParaAgregar.forEach { rolId ->
            val rol = rolService.obtenerPorId(rolId) ?:
            throw IllegalArgumentException("Rol con ID $rolId no encontrado")

            usuarioRolService.crear(
                UsuarioRolCreateRequest(
                    usuarioNumeroDocumento = documento,
                    rolId = rol.id
                )
            )
        }

        return usuarioActualizado
    }
}