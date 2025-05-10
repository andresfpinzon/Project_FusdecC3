package com.example.kotlinsql.controllers.estudiante

import com.example.kotlinsql.dto.estudiante.EstudianteCreateRequest
import com.example.kotlinsql.dto.estudiante.EstudianteUpdateRequest
import com.example.kotlinsql.model.estudiante.Estudiante
import com.example.kotlinsql.services.estudiante.EstudianteService
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
@RequestMapping("/estudiantes")
class EstudianteController {

    @Autowired
    lateinit var estudianteService: EstudianteService

    @Operation(summary = "Obtener todos los estudiantes", description = "Devuelve una lista de todos los estudiantes registrados.")
    @ApiResponses(
        value = [ApiResponse(
            responseCode = "200",
            description = "Lista de estudiantes",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = Estudiante::class))]
        )]
    )
    @GetMapping
    fun obtenerTodos(): List<Estudiante> = estudianteService.obtenerTodos()

    @Operation(summary = "Crear estudiante", description = "Crea un nuevo estudiante con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Estudiante creado exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Estudiante::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Error al crear el estudiante")])]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody request: EstudianteCreateRequest): Estudiante? {
        return estudianteService.crear(request)
    }

    @Operation(summary = "Actualizar estudiante", description = "Actualiza los datos de un estudiante.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Estudiante actualizado exitosamente",
                content = [Content(mediaType = "application/json",  schema = Schema(implementation = Estudiante::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Estudiante no encontrado",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "No se realizaron cambios o el estudiante no fue encontrado")])]
            )
        ]
    )
    @PutMapping("/{documento}")
    fun actualizar(@PathVariable documento: String, @Valid @RequestBody request: EstudianteUpdateRequest): Estudiante? {
        return estudianteService.actualizar(documento, request)
    }

    @Operation(summary = "Eliminar estudiante", description = "Elimina un estudiante por su número de documento.")
    @ApiResponses(
        value = [
            ApiResponse(responseCode = "200", description = "Estudiante eliminado",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Estudiante eliminado correctamente")])]),
            ApiResponse(responseCode = "404", description = "Estudiante no encontrado",
                content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Estudiante no encontrado")])])
        ]
    )
    @DeleteMapping("/{documento}")
    fun eliminar(@PathVariable documento: String): String {
        val filas = estudianteService.eliminar(documento)
        return if (filas > 0) "Estudiante eliminado correctamente" else "Estudiante no encontrado"
    }
}
