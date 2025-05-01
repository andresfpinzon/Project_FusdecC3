package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.*
import com.example.kotlinsql.services.ComandoService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid
import io.swagger.v3.oas.annotations.tags.Tag
import io.swagger.v3.oas.annotations.Operation

@RestController
@RequestMapping("/api/comandos")
@CrossOrigin(origins = ["http://localhost:4200"])
@Tag(name = "Comandos", description = "API para gestionar comandos")
class ComandoController(private val comandoService: ComandoService) {

    @Operation(summary = "Obtener todos los comandos")
    @GetMapping
    fun obtenerTodos(): ResponseEntity<List<ComandoResponse>> {
        val comandos = comandoService.obtenerTodos()
        return if (comandos.isEmpty()) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.ok(comandos)
        }
    }

    @Operation(summary = "Crear nuevo comando")
    @PostMapping
    fun crear(@Valid @RequestBody request: ComandoCreateRequest): ResponseEntity<ComandoResponse> {
        val comando = comandoService.crear(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(comando)
    }

    @Operation(summary = "Obtener comando por ID")
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): ResponseEntity<ComandoResponse> {
        val comando = comandoService.obtenerPorId(id)
        return if (comando != null) {
            ResponseEntity.ok(comando)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "Actualizar comando")
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody request: ComandoUpdateRequest): ResponseEntity<ComandoResponse> {
        val comando = comandoService.actualizar(id, request)
        return if (comando != null) {
            ResponseEntity.ok(comando)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "Asignar fundación a comando")
    @PutMapping("/{id}/fundacion")
    fun asignarFundacion(
        @PathVariable id: Int,
        @RequestParam fundacionNombre: String
    ): ResponseEntity<ComandoResponse> {
        val comando = comandoService.asignarFundacion(id, fundacionNombre)
        return if (comando != null) {
            ResponseEntity.ok(comando)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "Desactivar comando")
    @PutMapping("/{id}/desactivar")
    fun desactivar(@PathVariable id: Int): ResponseEntity<ComandoResponse> {
        val comando = comandoService.desactivar(id)
        return if (comando != null) {
            ResponseEntity.ok(comando)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "Obtener brigadas de un comando")
    @GetMapping("/{id}/brigadas")
    fun obtenerBrigadas(@PathVariable id: Int): ResponseEntity<List<BrigadaResponse>> {
        val brigadas = comandoService.obtenerBrigadasPorComandoId(id)
        return if (brigadas.isNotEmpty()) {
            ResponseEntity.ok(brigadas)
        } else {
            ResponseEntity.noContent().build()
        }
    }
}