package com.example.kotlinsql.controllers.usuario


import com.example.kotlinsql.dto.usuario.UsuarioCreateWithRolesRequest
import com.example.kotlinsql.dto.usuario.UsuarioUpdateWithRolesRequest
import com.example.kotlinsql.services.usuario.UsuarioManagementService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/usuarios-management")
class UsuarioManagementController(
    private val usuarioManagementService: UsuarioManagementService
) {
    @PostMapping("/con-roles")
    fun crearUsuarioConRoles(
        @RequestBody @Valid request: UsuarioCreateWithRolesRequest
    ): ResponseEntity<Any> {
        return try {
            val usuarioCreado = usuarioManagementService.crearUsuarioConRoles(
                request.usuario.normalizar(),
                request.rolesIds
            )
            ResponseEntity.status(HttpStatus.CREATED).body(usuarioCreado)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("error" to e.message))
        }
    }

    @PutMapping("/{documento}/con-roles")
    fun actualizarUsuarioConRoles(
        @PathVariable documento: String,
        @RequestBody @Valid request: UsuarioUpdateWithRolesRequest
    ): ResponseEntity<Any> {
        return try {
            val usuarioActualizado = usuarioManagementService.actualizarUsuarioConRoles(
                documento = documento,
                usuarioUpdate = request.usuarioUpdate,
                nuevosRolesIds = request.rolesIds
            )
            ResponseEntity.ok(usuarioActualizado)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("error" to e.message))
        }
    }
}






