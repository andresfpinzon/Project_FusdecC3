package com.example.kotlinsql.controllers.fundacion

import com.example.kotlinsql.model.fundacion.Fundacion
import com.example.kotlinsql.services.fundacion.FundacionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema

@RestController
@RequestMapping("/fundaciones")
class FundacionController {

    @Autowired
    lateinit var fundacionService: FundacionService

    @Operation(
        summary = "Obtener todas las fundaciones",
        description = "Devuelve una lista de todas las fundaciones registradas."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de fundaciones",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Fundacion::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerTodas(): List<Fundacion> = fundacionService.obtenerTodas()

    @Operation(summary = "Obtener fundación por ID", description = "Devuelve una fundación dado su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Fundación encontrada",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Fundacion::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Fundación no encontrada",
                content = [Content(mediaType = "text/plain", examples = [io.swagger.v3.oas.annotations.media.ExampleObject(value = "Fundación no encontrada")])]
            )
        ]
    )
    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): Any {
        return fundacionService.obtenerPorId(id) ?: "Fundación no encontrada"
    }


}