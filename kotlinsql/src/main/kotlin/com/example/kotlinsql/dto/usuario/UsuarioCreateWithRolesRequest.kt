package com.example.kotlinsql.dto.usuario

import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty

data class UsuarioCreateWithRolesRequest(
    @field:Valid
    val usuario: UsuarioCreateRequest,
    @field:NotEmpty(message = "Debe asignarse al menos un rol al usuario")
    val rolesIds: List<Int>
)