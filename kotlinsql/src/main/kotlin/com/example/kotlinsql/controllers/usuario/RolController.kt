package com.example.kotlinsql.controllers.usuario

import com.example.kotlinsql.model.usuario.Rol
import com.example.kotlinsql.services.usuario.RolService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/roles")
class RolController {

    @Autowired
    lateinit var rolService: RolService

    @Operation(summary = "Obtener todos los roles", description = "Devuelve una lista de todos los roles registrados.")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Lista de roles",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = Rol::class))]
        )]
    )
    @GetMapping
    fun obtenerTodos(): List<Rol> = rolService.obtenerTodos()

    @Operation(summary = "Obtener rol por ID", description = "Devuelve un rol específico según su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Rol encontrado",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Rol::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Rol no encontrado",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): Rol? {
        return rolService.obtenerPorId(id)
    }

    @Operation(summary = "Obtener rol por nombre", description = "Devuelve un rol específico según su nombre.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Rol encontrado",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Rol::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Rol no encontrado",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @GetMapping("/nombre/{nombre}")
    fun obtenerPorNombre(@PathVariable nombre: String): Rol? {
        return rolService.obtenerPorNombre(nombre)
    }
}