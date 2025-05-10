package com.example.kotlinsql.dto.usuario

import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty


data class UsuarioUpdateWithRolesRequest(
    @field:Valid
    val usuarioUpdate: UsuarioUpdateRequest,
    @field:NotEmpty(message = "Debe asignarse al menos un rol al usuario")
    val rolesIds: List<Int>
)