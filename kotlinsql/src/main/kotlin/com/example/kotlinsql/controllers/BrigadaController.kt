package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.*
import com.example.kotlinsql.services.BrigadaService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid
import io.swagger.v3.oas.annotations.tags.Tag
import io.swagger.v3.oas.annotations.Operation

@RestController
@RequestMapping("/api/brigadas")
@CrossOrigin(origins = ["http://localhost:4200"])
@Tag(name = "Brigadas", description = "API para gestionar brigadas")
class BrigadaController(private val brigadaService: BrigadaService) {

    @Operation(summary = "Obtener todas las brigadas")
    @GetMapping
    fun obtenerTodos(): ResponseEntity<List<BrigadaResponse>> {
        val brigadas = brigadaService.obtenerTodos()
        return if (brigadas.isEmpty()) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.ok(brigadas)
        }
    }

    @Operation(summary = "Crear nueva brigada", description = "Crea una brigada y la asigna a un comando")
    @PostMapping
    fun crear(@Valid @RequestBody request: BrigadaCreateRequest): ResponseEntity<BrigadaResponse> {
        val brigada = brigadaService.crear(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(brigada)
    }

    @Operation(summary = "Obtener brigada por ID")
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): ResponseEntity<BrigadaResponse> {
        val brigada = brigadaService.obtenerPorId(id)
        return if (brigada != null) {
            ResponseEntity.ok(brigada)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "Actualizar brigada", description = "Actualiza una brigada y su asignación a comando")
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody request: BrigadaUpdateRequest): ResponseEntity<BrigadaResponse> {
        val brigada = brigadaService.actualizar(id, request)
        return if (brigada != null) {
            ResponseEntity.ok(brigada)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "Desactivar brigada")
    @PutMapping("/{id}/desactivar")
    fun desactivar(@PathVariable id: Int): ResponseEntity<BrigadaResponse> {
        val brigada = brigadaService.desactivar(id)
        return if (brigada != null) {
            ResponseEntity.ok(brigada)
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @Operation(summary = "Obtener unidades asignadas a una brigada", description = "Lista todas las unidades que pertenecen a una brigada específica")
    @GetMapping("/{id}/unidades")
    fun obtenerUnidades(@PathVariable id: Int): ResponseEntity<List<String>> {
        val unidades = brigadaService.obtenerNombresUnidadesPorBrigadaId(id)
        return if (unidades.isEmpty()) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.ok(unidades)
        }
    }
}