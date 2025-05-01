package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.*
import com.example.kotlinsql.services.BrigadaService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag

@RestController
@RequestMapping("/api/brigadas")
@CrossOrigin(origins = ["http://localhost:4200"])
@Tag(name = "Brigadas", description = "API para gestionar brigadas")
class BrigadaController(private val brigadaService: BrigadaService) {

    @Operation(summary = "Obtener todas las brigadas activas")
    @GetMapping
    fun obtenerTodos(): ResponseEntity<List<BrigadaResponse>> {
        val brigadas = brigadaService.obtenerTodos()
        return if (brigadas.isEmpty()) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.ok(brigadas)
        }
    }

    @Operation(summary = "Crear una nueva brigada")
    @PostMapping
    fun crear(@Valid @RequestBody request: BrigadaCreateRequest): ResponseEntity<BrigadaResponse> {
        return try {
            val brigada = brigadaService.crear(request)
            ResponseEntity.status(HttpStatus.CREATED).body(brigada)
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @Operation(summary = "Actualizar una brigada existente")
    @PutMapping("/{id}")
    fun actualizar(
        @PathVariable id: Int,
        @Valid @RequestBody request: BrigadaUpdateRequest
    ): ResponseEntity<BrigadaResponse> {
        return try {
            val brigada = brigadaService.actualizar(id, request)
            if (brigada != null) {
                ResponseEntity.ok(brigada)
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @Operation(summary = "Obtener una brigada por su ID")
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): ResponseEntity<BrigadaResponse> {
        val brigada = brigadaService.obtenerPorId(id)
        return if (brigada != null) {
            ResponseEntity.ok(brigada)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "Desactivar una brigada")
    @PutMapping("/{id}/desactivar")
    fun desactivar(@PathVariable id: Int): ResponseEntity<BrigadaResponse> {
        val brigada = brigadaService.desactivar(id)
        return if (brigada != null) {
            ResponseEntity.ok(brigada)
        } else {
            ResponseEntity.notFound().build()
        }
    }
}