package com.example.kotlinsql.controllers.brigada

import com.example.kotlinsql.dto.brigada.BrigadaCreateRequest
import com.example.kotlinsql.dto.brigada.BrigadaUpdateRequest
import com.example.kotlinsql.model.brigada.Brigada
import com.example.kotlinsql.services.brigada.BrigadaService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/brigadas")
class BrigadaController {

    @Autowired
    lateinit var brigadaService: BrigadaService

    @Operation(summary = "Obtener todas las brigadas", description = "Devuelve una lista de todas las brigadas registradas.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de brigadas",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Brigada::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerTodas(): ResponseEntity<List<Brigada>> {
        return ResponseEntity.ok(brigadaService.obtenerTodas())
    }

    @Operation(summary = "Obtener brigada por ID", description = "Devuelve una brigada específica por su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Brigada encontrada",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Brigada::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Brigada no encontrada",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): ResponseEntity<Any> {
        return try {
            val brigada = brigadaService.obtenerPorId(id)
                ?: throw NoSuchElementException("Brigada con ID $id no encontrada")
            ResponseEntity.ok(brigada)
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("error" to e.message))
        }
    }

    @Operation(summary = "Crear nueva brigada", description = "Crea una nueva brigada con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "201",
                description = "Brigada creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Brigada::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Error en los datos proporcionados",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody request: BrigadaCreateRequest): ResponseEntity<Any> {
        return try {
            val brigada = brigadaService.crear(request)
            ResponseEntity.status(HttpStatus.CREATED).body(brigada)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Error al crear la brigada: ${e.message}"))
        }
    }

    @Operation(summary = "Actualizar brigada", description = "Actualiza una brigada existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Brigada actualizada",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Brigada::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Error en los datos proporcionados",
                content = [Content(mediaType = "application/json")]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Brigada no encontrada",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody request: BrigadaUpdateRequest): ResponseEntity<Any> {
        return try {
            val brigada = brigadaService.actualizar(id, request)
            ResponseEntity.ok(brigada)
        } catch (e: IllegalArgumentException) {
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        } catch (e: NoSuchElementException) {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("error" to e.message))
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Error al actualizar la brigada: ${e.message}"))
        }
    }

    @Operation(summary = "Eliminar brigada", description = "Elimina una brigada mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Brigada eliminada",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "{\"message\": \"Brigada eliminada\"}")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Brigada no encontrada",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Int): ResponseEntity<Any> {
        return try {
            val resultado = brigadaService.eliminar(id)
            if (resultado > 0) {
                ResponseEntity.ok(mapOf("message" to "Brigada eliminada"))
            } else {
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(mapOf("error" to "Brigada con ID $id no encontrada"))
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError().body(mapOf("error" to "Error al eliminar la brigada: ${e.message}"))
        }
    }

    @Operation(
        summary = "Obtener unidades asignadas a una brigada",
        description = "Devuelve una lista de nombres de unidades activas asignadas a una brigada específica, ordenadas alfabéticamente"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de nombres de unidades activas",
                content = [Content(mediaType = "application/json")]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Brigada no encontrada o sin unidades activas asignadas",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @GetMapping("/{brigadaId}/unidades-asignadas")
    fun obtenerUnidadesAsignadasABrigada(@PathVariable brigadaId: Int): ResponseEntity<Any> {
        return try {
            val unidades = brigadaService.obtenerUnidadesAsignadas(brigadaId)
            if (unidades.isEmpty()) {
                ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(mapOf("message" to "No hay unidades activas asignadas a esta brigada"))
            } else {
                ResponseEntity.ok(unidades)
            }
        } catch (e: Exception) {
            ResponseEntity.internalServerError()
                .body(mapOf("error" to "Error al obtener unidades asignadas: ${e.message}"))
        }
    }
}