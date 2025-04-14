package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.CalificacionEstudianteCreateRequest
import com.example.kotlinsql.model.CalificacionEstudiante
import com.example.kotlinsql.services.CalificacionEstudianteService
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
@RequestMapping("/calificaciones-estudiantes")
class CalificacionEstudianteController {

    @Autowired
    lateinit var service: CalificacionEstudianteService

    @Operation(summary = "Obtener todas las asignaciones calificación-estudiante", description = "Devuelve todas las relaciones entre calificaciones y estudiantes.")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de relaciones",
        content = [Content(mediaType = "application/json", schema = Schema(implementation = CalificacionEstudiante::class))]
    )
    @GetMapping
    fun obtenerTodos(): List<CalificacionEstudiante> = service.obtenerTodos()

    @Operation(summary = "Asignar calificación a estudiante", description = "Crea una nueva relación entre una calificación y un estudiante.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Relación creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = CalificacionEstudiante::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Error en los datos enviados",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Datos inválidos")])]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody request: CalificacionEstudianteCreateRequest): CalificacionEstudiante? {
        return service.crear(request)
    }

    @Operation(summary = "Eliminar relación calificación-estudiante", description = "Elimina una relación específica entre una calificación y un estudiante.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Relación eliminada exitosamente",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Relación eliminada")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Relación no encontrada",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "No se encontró la relación")])]
            )
        ]
    )
    @DeleteMapping("/{calificacionId}/{estudianteId}")
    fun eliminar(
        @PathVariable calificacionId: Int,
        @PathVariable estudianteId: String
    ): String {
        val resultado = service.eliminar(calificacionId, estudianteId)
        return if (resultado > 0) "Relación eliminada" else "No se encontró la relación"
    }
}
