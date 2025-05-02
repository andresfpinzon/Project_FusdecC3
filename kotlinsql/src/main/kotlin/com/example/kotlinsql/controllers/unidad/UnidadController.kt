package com.example.kotlinsql.controllers.unidad

import com.example.kotlinsql.dto.unidad.CreateUnidadDto
import com.example.kotlinsql.dto.unidad.UpdateUnidadDto
import com.example.kotlinsql.model.unidad.Unidad
import com.example.kotlinsql.services.unidad.UnidadServices
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/unidades")
class UnidadController (
    private val unidadServices: UnidadServices
) {
    @Operation(summary = "Crear nueva unidad", description = "Crea una nueva unidad con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Unidad creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Unidad::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(
                    mediaType = "text/plain",
                    examples = [ExampleObject(value = "Error al crear la unidad")]
                )]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody unidad: CreateUnidadDto): ResponseEntity<Unidad> {
        val unidadCreada = unidadServices.crearUnidadService(unidad)
        return ResponseEntity.status(HttpStatus.CREATED).body(unidadCreada)
    }


    @Operation(
        summary = "Obtener todas las unidades",
        description = "Devuelve una lista de todas las unidades registradas."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de unidades",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Unidad::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerTodas(): ResponseEntity<List<Unidad>> {
        val unidades = unidadServices.obtenerUnidades()
        return ResponseEntity.ok(unidades)
    }

    @Operation(summary = "Obtener unidad por ID", description = "Devuelve una unidad específica mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Unidad encontrada",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Unidad::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Unidad no encontrada",
                content = [Content(
                    mediaType = "text/plain",
                    examples = [ExampleObject(value = "Unidad no encontrada")]
                )]
            )
        ]
    )
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Long): ResponseEntity<Unidad> {
        val unidad = unidadServices.obtenerUnidadPorId(id)
        return if (unidad != null) {
            ResponseEntity.ok(unidad)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @Operation(summary = "Actualizar unidad", description = "Actualiza una unidad existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Unidad actualizada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Unidad::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(
                    mediaType = "text/plain",
                    examples = [ExampleObject(value = "Error al actualizar la unidad")]
                )]
            )
        ]
    )
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Long, @Valid @RequestBody unidad: UpdateUnidadDto): ResponseEntity<Unidad> {
        val unidadActualizada = unidadServices.actualizarUnidad(id, unidad)
        return if (unidadActualizada != null) {
            ResponseEntity.ok(unidadActualizada)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body(null)
        }
    }

    @Operation(summary = "Eliminar unidad por ID", description = "Elimina una unidad específica mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Unidad eliminada exitosamente",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Unidad eliminada")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Unidad no encontrada",
                content = [Content(
                    mediaType = "text/plain",
                    examples = [ExampleObject(value = "Unidad no encontrada")]
                )]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Long): ResponseEntity<String> {
        return if (unidadServices.eliminarUnidadPorId(id)) {
            ResponseEntity.ok("Unidad eliminada")
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unidad no encontrada")
        }
    }
}