package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.BrigadaCreateRequest
import com.example.kotlinsql.dto.BrigadaUpdateRequest
import com.example.kotlinsql.model.Brigada
import com.example.kotlinsql.services.BrigadaService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
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
    fun obtenerTodas(): List<Brigada> = brigadaService.obtenerTodas()

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
                content = [Content(mediaType = "text/plain")]
            )
        ]
    )
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): Brigada? = brigadaService.obtenerPorId(id)

    @Operation(summary = "Crear nueva brigada", description = "Crea una nueva brigada con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Brigada creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Brigada::class))]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody request: BrigadaCreateRequest): Brigada? {
        return brigadaService.crear(request)
    }

    @Operation(summary = "Actualizar brigada", description = "Actualiza una brigada existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Brigada actualizada",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Brigada::class))]
            )
        ]
    )
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody request: BrigadaUpdateRequest): Brigada? {
        return brigadaService.actualizar(id, request)
    }

    @Operation(summary = "Eliminar brigada", description = "Elimina una brigada mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Brigada eliminada",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Brigada eliminada")])]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Int): String {
        val resultado = brigadaService.eliminar(id)
        return if (resultado > 0) "Brigada eliminada" else "Brigada no encontrada"
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
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = List::class))
                ]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Brigada no encontrada o sin unidades activas asignadas",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @GetMapping("/{brigadaId}/unidades-asignadas")
    fun obtenerUnidadesAsignadasABrigada(@PathVariable brigadaId: Int): List<String> {
        return brigadaService.obtenerUnidadesAsignadas(brigadaId)
    }
}