package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.UsuarioCreateRequest
import com.example.kotlinsql.dto.UsuarioUpdateRequest
import com.example.kotlinsql.model.Usuario
import com.example.kotlinsql.services.UsuarioService
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema

@RestController
@RequestMapping("/usuarios")
class UsuarioController @Autowired constructor(private val usuarioService: UsuarioService) {

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
    fun obtenerUsuarios(): ResponseEntity<List<Usuario>> {
        val usuarios = usuarioService.obtenerTodos()
        return ResponseEntity.ok(usuarios)
    }

    @Operation(
        summary = "Crear nuevo usuario",
        description = "Crea un nuevo usuario con los datos proporcionados."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Usuario creado exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Usuario::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Error en los datos enviados",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "{\"mensaje\": \"Datos inválidos\"}")])]
            )
        ]
    )
    @PostMapping
    fun crearUsuario(@Valid @RequestBody usuario: UsuarioCreateRequest): ResponseEntity<Any> {
        return try {
            val nuevoUsuario = usuarioService.crear(usuario)
            ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body(mapOf("mensaje" to e.message))
        }
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
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Usuario::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Usuario no encontrado o sin cambios",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "{\"mensaje\": \"No se realizaron cambios o el usuario no fue encontrado\"}")])]
            ),
            ApiResponse(
                responseCode = "500",
                description = "Error interno del servidor",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "{\"mensaje\": \"Ocurrió un error inesperado\"}")])]
            )
        ]
    )
    @PutMapping("/{documento}")
    fun actualizarUsuario(
        @PathVariable documento: String,
        @Valid @RequestBody usuario: UsuarioUpdateRequest
    ): ResponseEntity<Any> {
        return try {
            val usuarioActualizado = usuarioService.actualizar(documento, usuario)
            if (usuarioActualizado != null) {
                ResponseEntity.ok(usuarioActualizado)
            } else {
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("mensaje" to "No se realizaron cambios o el usuario no fue encontrado"))
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(mapOf("mensaje" to "Ocurrió un error inesperado"))
        }
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
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "{\"mensaje\": \"Usuario eliminado\"}")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Usuario no encontrado",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "{\"mensaje\": \"Usuario no encontrado\"}")])]
            )
        ]
    )
    @DeleteMapping("/{documento}")
    fun eliminarUsuario(@PathVariable documento: String): ResponseEntity<Map<String, String>> {
        val resultado = usuarioService.eliminarPorDocumento(documento)
        return if (resultado > 0) {
            ResponseEntity.ok(mapOf("mensaje" to "Usuario eliminado"))
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("mensaje" to "Usuario no encontrado"))
        }
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
