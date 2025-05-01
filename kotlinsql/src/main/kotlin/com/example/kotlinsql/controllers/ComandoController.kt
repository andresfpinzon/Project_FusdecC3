package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.*
import com.example.kotlinsql.exceptions.DuplicateEntityException
import com.example.kotlinsql.exceptions.EntityNotFoundException
import com.example.kotlinsql.services.ComandoService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import jakarta.validation.Valid
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag

@RestController
@RequestMapping("/api/comandos")
@CrossOrigin(origins = ["http://localhost:4200"])
@Tag(name = "Comandos", description = "API para gestionar comandos")
class ComandoController(private val comandoService: ComandoService) {

    @ExceptionHandler(DuplicateEntityException::class)
    fun handleDuplicateEntity(e: DuplicateEntityException): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(mapOf("error" to e.message!!))
    }

    @ExceptionHandler(EntityNotFoundException::class)
    fun handleEntityNotFound(e: EntityNotFoundException): ResponseEntity<Map<String, String>> {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(mapOf("error" to e.message!!))
    }

    @GetMapping
    fun obtenerTodos(): ResponseEntity<List<ComandoResponse>> {
        val comandos = comandoService.obtenerTodos()
        return if (comandos.isEmpty()) {
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.ok(comandos)
        }
    }

    @PostMapping
    fun crear(@Valid @RequestBody request: ComandoCreateRequest): ResponseEntity<ComandoResponse> {
        return try {
            val comando = comandoService.crear(request)
            ResponseEntity.status(HttpStatus.CREATED).body(comando)
        } catch (e: DuplicateEntityException) {
            throw e
        } catch (e: EntityNotFoundException) {
            throw e
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @PutMapping("/{id}")
    fun actualizar(
        @PathVariable id: Int,
        @Valid @RequestBody request: ComandoUpdateRequest
    ): ResponseEntity<ComandoResponse> {
        return try {
            val comando = comandoService.actualizar(id, request)
            ResponseEntity.ok(comando)
        } catch (e: DuplicateEntityException) {
            throw e
        } catch (e: EntityNotFoundException) {
            throw e
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): ResponseEntity<ComandoResponse> {
        val comando = comandoService.obtenerPorId(id)
            ?: throw EntityNotFoundException("No se encontró el comando con id $id")
        return ResponseEntity.ok(comando)
    }

    @PutMapping("/{id}/desactivar")
    fun desactivar(@PathVariable id: Int): ResponseEntity<ComandoResponse> {
        val comando = comandoService.desactivar(id)
            ?: throw EntityNotFoundException("No se encontró el comando con id $id")
        return ResponseEntity.ok(comando)
    }
}