package com.example.kotlinsql.controllers

import com.example.kotlinsql.model.Fundacion
import com.example.kotlinsql.services.FundacionService
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

}