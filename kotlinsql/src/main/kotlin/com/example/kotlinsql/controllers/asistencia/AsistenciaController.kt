package com.example.kotlinsql.controllers.asistencia

import com.example.kotlinsql.dto.asistencia.AsistenciaCreateRequest
import com.example.kotlinsql.dto.asistencia.AsistenciaUpdateRequest
import com.example.kotlinsql.model.asistencia.Asistencia
import com.example.kotlinsql.services.asistencia.AsistenciaService
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
@RequestMapping("/asistencias")
class AsistenciaController {

    @Autowired
    lateinit var asistenciaService: AsistenciaService

    @Operation(summary = "Obtener todas las asistencias", description = "Devuelve una lista de todas las asistencias registradas.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de asistencias",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Asistencia::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerTodas(): List<Asistencia> = asistenciaService.obtenerTodas()

    @Operation(summary = "Crear nueva asistencia", description = "Crea una nueva asistencia con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Asistencia creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Asistencia::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Error al crear la asistencia")])]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody asistencia: AsistenciaCreateRequest): Asistencia? {
        return asistenciaService.crear(asistencia)
    }

    @Operation(summary = "Actualizar asistencia", description = "Actualiza una asistencia existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Asistencia creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Asistencia::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Asistencia no encontrada o sin cambios",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "No se realizaron cambios o la asistencia no fue encontrada")])]
            )
        ]
    )
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody asistencia: AsistenciaUpdateRequest): Asistencia? {
        return asistenciaService.actualizar(id, asistencia)
    }

    @Operation(summary = "Eliminar asistencia", description = "Elimina una asistencia mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Asistencia eliminada exitosamente",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Asistencia eliminada")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Asistencia no encontrada",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Asistencia no encontrada")])]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Int): String {
        val resultado = asistenciaService.eliminar(id)
        return if (resultado > 0) "Asistencia eliminada" else "Asistencia no encontrada"
    }
}

