package com.example.kotlinsql.controllers

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.servlet.resource.NoResourceFoundException

@ControllerAdvice
class GlobalExceptionHandler {

    // 1. Manejar errores de validación (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationExceptions(ex: MethodArgumentNotValidException): ResponseEntity<Map<String, Any>> {
        val errors = ex.bindingResult.fieldErrors.associate { error ->
            error.field to (error.defaultMessage ?: "Error de validación")
        }
        return ResponseEntity
            .badRequest()
            .body(mapOf(
                "status" to HttpStatus.BAD_REQUEST.value(),
                "message" to "Error de validación",
                "errors" to errors,
                "timestamp" to System.currentTimeMillis()
            ))
    }

    // 2. Maneja TUS errores de servicio (IllegalArgumentException)
    @ExceptionHandler(IllegalArgumentException::class)
    fun handleServiceExceptions(ex: IllegalArgumentException): ResponseEntity<Map<String, Any>> {
        return ResponseEntity
            .status(HttpStatus.CONFLICT) // Usa CONFLICT (409) para errores de negocio
            .body(mapOf(
                "status" to HttpStatus.CONFLICT.value(),
                "message" to ex.message.orEmpty(),
                "timestamp" to System.currentTimeMillis()
            ))
    }

    // 3. Maneja otros errores inesperados
    @ExceptionHandler(Exception::class)
    fun handleGeneralExceptions(ex: Exception): ResponseEntity<Map<String, Any>> {
        return ResponseEntity
            .internalServerError()
            .body(mapOf(
                "status" to HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "message" to "Error interno del servidor",
                "timestamp" to System.currentTimeMillis()
            ))
    }

    @ExceptionHandler(NoResourceFoundException::class)
    fun handleNoResourceFound(ex: NoResourceFoundException): ResponseEntity<Map<String, Any>> {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(mapOf(
                "status" to HttpStatus.NOT_FOUND.value(),
                "message" to "Recurso no encontrado: ${ex.resourcePath}",
                "timestamp" to System.currentTimeMillis()
            ))
    }

}
