package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.UsuarioCreateRequest
import com.example.kotlinsql.dto.UsuarioUpdateRequest
import com.example.kotlinsql.model.Usuario
import com.example.kotlinsql.services.UsuarioService
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema

@RestController
@RequestMapping("/usuarios")
class UsuarioController {

    @Autowired
    lateinit var usuarioService: UsuarioService

    @Operation(summary = "Obtener todos los usuarios", description = "Devuelve una lista de todos los usuarios registrados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de usuarios",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Usuario::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerUsuarios(): List<Usuario> {
        return usuarioService.obtenerTodos()
    }

    @Operation(
        summary = "Crear nuevo usuario",
        description = "Crea un nuevo usuario con los datos proporcionados."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Usuario creado exitosamente",
                content = [Content(mediaType = "application/json",  schema = Schema(implementation = Usuario::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Error en los datos enviados",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Error al crear el usuario")])]
            )
        ]
    )
    @PostMapping
    fun crearUsuario(@Valid @RequestBody usuario: UsuarioCreateRequest): Usuario? {
        return usuarioService.crear(usuario)
    }

    @Operation(
        summary = "Actualizar un usuario",
        description = "Actualiza los datos de un usuario existente según su número de documento."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Usuario actualizado exitosamente",
                content = [Content(mediaType = "application/json",  schema = Schema(implementation = Usuario::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Usuario no encontrado o sin cambios",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "No se realizaron cambios o el usuario no fue encontrado")])]
            )
        ]
    )
    @PutMapping("/{documento}")
    fun actualizarUsuario(
        @PathVariable documento: String,
        @Valid @RequestBody usuario: UsuarioUpdateRequest
    ): Usuario? {
        return usuarioService.actualizar(documento, usuario)
    }

    @Operation(
        summary = "Eliminar un usuario",
        description = "Elimina un usuario de la base de datos según su número de documento."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Usuario eliminado exitosamente",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Usuario eliminado")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Usuario no encontrado",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Usuario no encontrado")])]
            )
        ]
    )
    @DeleteMapping("/{documento}")
    fun eliminarUsuario(@PathVariable documento: String): String {
        val resultado = usuarioService.eliminarPorDocumento(documento)
        return if (resultado > 0) "Usuario eliminado" else "Usuario no encontrado"
    }

    @Operation(summary = "Obtener usuario por documento", description = "Obtiene un usuario por su número de documento.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Usuario encontrado",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = Usuario::class))]
        ),
        ApiResponse(
            responseCode = "404",
            description = "Usuario no encontrado",
            content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Usuario no encontrado")])]
        )
    )
    @GetMapping("/numero-documento/{documento}")
    fun obtenerPorDocumento(@PathVariable documento: String): ResponseEntity<Any> {
        return try {
            val usuario = usuarioService.obtenerPorDocumento(documento)
            ResponseEntity.ok(usuario)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.status(404).body(mapOf("error" to e.message))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Error al buscar el usuario: ${e.message}"))
        }
    }
}