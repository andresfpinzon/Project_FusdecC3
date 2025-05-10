package com.example.kotlinsql.controllers.colegio

import com.example.kotlinsql.dto.colegio.ColegioCreateRequest
import com.example.kotlinsql.dto.colegio.ColegioUpdateRequest
import com.example.kotlinsql.dto.estudiante.EstudianteResumenResponse
import com.example.kotlinsql.model.colegio.Colegio
import com.example.kotlinsql.services.colegio.ColegioService
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
@RequestMapping("/colegios")
class ColegioController (){
    @Autowired
    lateinit var colegioService: ColegioService

    @Operation(summary = "Obtener todos los colegios", description = "Devuelve una lista de todos los Colegios registrados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de colegios",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Colegio::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerTodas(): List<Colegio> = colegioService.obtenerTodas()

    @Operation(summary = "Crear nuevo colegio", description = "Crea una nuevo colegio con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Colegio creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Colegio::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Error al crear el colegio")])]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody colegio: ColegioCreateRequest): Colegio? {
        return colegioService.crear(colegio)
    }

    @Operation(summary = "Actualizar colegio", description = "Actualiza un colegio existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Colegio creado exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Colegio::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Colegio no encontrado o sin cambios",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "No se realizaron cambios o el colegio no fue encontrado")])]
            )
        ]
    )
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody colegio: ColegioUpdateRequest): Colegio? {
        return colegioService.actualizar(id, colegio)
    }

    @Operation(summary = "Eliminar colegio", description = "Elimina un colegio mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Colegio eliminado exitosamente",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Colegio eliminada")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Colegio no encontrada",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Colegio no encontrado")])]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Int): String {
        val resultado = colegioService.eliminar(id)
        return if (resultado > 0) "Colegio eliminada" else "Colegio no encontrado"
    }

    @Operation(summary = "Obtener colegio por ID", description = "Devuelve un colegio dado su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Colegio encontrado",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Colegio::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Colegio no encontrado",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Colegio no encontrado")])]
            )
        ]
    )
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): Any {
        return colegioService.obtenerPorId(id) ?: "Colegio no encontrado"
    }

    @Operation(summary = "Obtener estudiantes del colegio",
        description = "Devuelve una lista de estudiantes pertenecientes a este colegio")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de estudiantes",
                content = [Content(mediaType = "application/json",
                    schema = Schema(implementation = EstudianteResumenResponse::class))])
        ]
    )
    @GetMapping("/{id}/estudiantes")
    fun obtenerEstudiantesDelColegio(@PathVariable id: Int): List<EstudianteResumenResponse> {
        return colegioService.obtenerEstudiantesPorColegio(id)
    }

}