package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.UsuarioCreateRequest
import com.example.kotlinsql.dto.UsuarioUpdateRequest
import com.example.kotlinsql.services.UsuarioManagementService
import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty
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
        @RequestBody @Valid request: UsuarioConRolesRequest
    ): ResponseEntity<Any> {
        return try {
            val usuarioCreado = usuarioManagementService.crearUsuarioConRoles(
                usuario = request.usuarioCreate,
                rolesIds = request.rolesIds
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

data class UsuarioConRolesRequest(
    @field:Valid val usuarioCreate: UsuarioCreateRequest,
    @field:NotEmpty(message = "Debe asignar al menos un rol")
    val rolesIds: List<Int>
)

data class UsuarioUpdateWithRolesRequest(
    @field:Valid val usuarioUpdate: UsuarioUpdateRequest,
    @field:NotEmpty(message = "Debe asignar al menos un rol")
    val rolesIds: List<Int>
)


