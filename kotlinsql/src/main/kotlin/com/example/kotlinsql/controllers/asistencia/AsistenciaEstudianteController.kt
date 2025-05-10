package com.example.kotlinsql.controllers.asistencia

import com.example.kotlinsql.dto.asistencia.AsistenciaEstudianteCreateRequest
import com.example.kotlinsql.model.asistencia.AsistenciaEstudiante
import com.example.kotlinsql.services.asistencia.AsistenciaEstudianteService
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
@RequestMapping("/asistencia-estudiantes")
class AsistenciaEstudianteController {

    @Autowired
    lateinit var service: AsistenciaEstudianteService

    @Operation(summary = "Listar relaciones asistencia-estudiante", description = "Obtiene todas las relaciones asistencia-estudiante registradas.")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Listado de relaciones",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = AsistenciaEstudiante::class))]
        )]
    )
    @GetMapping
    fun obtenerTodos(): List<AsistenciaEstudiante> = service.obtenerTodos()

    @Operation(summary = "Registrar asistencia de estudiante", description = "Crea una relación entre una asistencia y un estudiante.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Relación creada",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = AsistenciaEstudiante::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Datos inválidos para registrar la asistencia")])]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody request: AsistenciaEstudianteCreateRequest): AsistenciaEstudiante? {
        return service.crear(request)
    }

    @Operation(summary = "Eliminar asistencia de estudiante", description = "Elimina la relación entre una asistencia y un estudiante.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Relación eliminada",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Relación asistencia-estudiante eliminada")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Relación no encontrada",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Relación no encontrada")])]
            )
        ]
    )
    @DeleteMapping("/{asistenciaId}/{estudianteId}")
    fun eliminar(
        @PathVariable asistenciaId: Int,
        @PathVariable estudianteId: String
    ): String {
        val res = service.eliminar(asistenciaId, estudianteId)
        return if (res > 0) "Relación asistencia-estudiante eliminada" else "Relación no encontrada"
    }
}
