package com.example.kotlinsql.controllers.comando

import com.example.kotlinsql.dto.comando.ComandoCreateRequest
import com.example.kotlinsql.dto.comando.ComandoUpdateRequest
import com.example.kotlinsql.model.comando.Comando
import com.example.kotlinsql.services.comando.ComandoService
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
@RequestMapping("/comandos")
class ComandoController {

    @Autowired
    lateinit var comandoService: ComandoService

    @Operation(summary = "Obtener todos los comandos", description = "Devuelve una lista de todos los comandos registrados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de comandos",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Comando::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerTodos(): List<Comando> = comandoService.obtenerTodos()

    @Operation(summary = "Obtener comando por ID", description = "Devuelve un comando específico por su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Comando encontrado",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Comando::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Comando no encontrado",
                content = [Content(mediaType = "text/plain")]
            )
        ]
    )
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): Comando? = comandoService.obtenerPorId(id)

    @Operation(summary = "Crear nuevo comando", description = "Crea un nuevo comando con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Comando creado exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Comando::class))]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody request: ComandoCreateRequest): Comando? {
        return comandoService.crear(request)
    }

    @Operation(summary = "Actualizar comando", description = "Actualiza un comando existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Comando actualizado",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Comando::class))]
            )
        ]
    )
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody request: ComandoUpdateRequest): Comando? {
        return comandoService.actualizar(id, request)
    }

    @Operation(summary = "Eliminar comando", description = "Elimina un comando mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Comando eliminado",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Comando eliminado")])]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Int): String {
        val resultado = comandoService.eliminar(id)
        return if (resultado > 0) "Comando eliminado" else "Comando no encontrado"
    }

    @Operation(
        summary = "Obtener nombres de brigadas activas por comando",
        description = "Devuelve una lista de nombres de brigadas activas pertenecientes a un comando específico, ordenadas alfabéticamente"
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de nombres de brigadas activas",
                content = [Content(
                    mediaType = "application/json",
                    schema = Schema(implementation = List::class)
                )]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Comando no encontrado o sin brigadas activas",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )
    @GetMapping("/{comandoId}/brigadas-asignadas")
    fun obtenerBrigadasAsignadasAComando(@PathVariable comandoId: Int): List<String> {
        return comandoService.obtenerBrigadasAsignadas(comandoId)
    }
}