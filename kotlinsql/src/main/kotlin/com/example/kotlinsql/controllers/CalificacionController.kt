package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.CalificacionCreateRequest
import com.example.kotlinsql.dto.CalificacionUpdateRequest
import com.example.kotlinsql.model.Calificacion
import com.example.kotlinsql.services.CalificacionService
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema

@RestController
@RequestMapping("/calificaciones")
class CalificacionController {

    @Autowired
    lateinit var calificacionService: CalificacionService

    @Operation(summary = "Obtener todas las calificaciones", description = "Devuelve una lista de todas las calificaciones registradas.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de calificaciones",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Calificacion::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerTodas(): List<Calificacion> = calificacionService.obtenerTodas()

    @Operation(summary = "Crear nueva calificación", description = "Crea una nueva calificación con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Calificación creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Calificacion::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Error al crear la calificación")])]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody calificacion: CalificacionCreateRequest): Calificacion? {
        return calificacionService.crear(calificacion)
    }

    @Operation(summary = "Actualizar calificación", description = "Actualiza una calificación existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Calificación actualizada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Calificacion::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Calificación no encontrada o sin cambios",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "No se realizaron cambios o la calificación no fue encontrada")])]
            )
        ]
    )
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody calificacion: CalificacionUpdateRequest): Calificacion? {
        return calificacionService.actualizar(id, calificacion)
    }

    @Operation(summary = "Eliminar calificación", description = "Elimina una calificación mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Calificación eliminada exitosamente",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Calificación eliminada")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Calificación no encontrada",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Calificación no encontrada")])]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Int): String {
        val resultado = calificacionService.eliminar(id)
        return if (resultado > 0) "Calificación eliminada" else "Calificación no encontrada"
    }
}

