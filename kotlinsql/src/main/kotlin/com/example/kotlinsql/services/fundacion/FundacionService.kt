package com.example.kotlinsql.services.fundacion

import com.example.kotlinsql.dto.fundacion.FundacionCreateDto
import com.example.kotlinsql.dto.fundacion.UpdateFundacionDto
import com.example.kotlinsql.model.fundacion.Fundacion
import com.example.kotlinsql.repositories.fundacion.FundacionRepository
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class FundacionService(
    private val fundacionRepository: FundacionRepository
) {

    fun createFundacion(data: FundacionCreateDto): Fundacion{
        return try {
            if (fundacionRepository.existFundacionByName(data.nombre)) {
                throw IllegalArgumentException("Ya existe una fundación con ese nombre")
            }
            val fundacion = Fundacion(
                nombre = data.nombre
            )
            fundacionRepository.save(fundacion)
        } catch (e: DataIntegrityViolationException) {
            throw IllegalArgumentException("Error al crear la Fundacion: ${e.message}")
        }
    }
    fun updateFundacion(id: Long, data: UpdateFundacionDto): Fundacion? {
        val fundacion = fundacionRepository.findById(id).orElse(null)
            ?: throw IllegalArgumentException("Fundación con ID $id no encontrada")

        if (fundacionRepository.existFundacionByName(data.nombre!!) && fundacion.nombre != data.nombre) {
            throw IllegalArgumentException("Ya existe una fundación con ese nombre")
        }


        return try {
            fundacionRepository.save(fundacion)
        } catch (e: DataIntegrityViolationException) {
            throw IllegalArgumentException("Error al actualizar la Fundación: ${e.message}")
        }
    }
    fun getFundaciones(): List<Fundacion>{
        return try {
            fundacionRepository.findAll()
        } catch (e: Exception) {
            throw IllegalArgumentException("Error al obtener las fundaciones: ${e.message}")
        }
    }
    fun getFundacionById(id: Long): Fundacion? {
        return fundacionRepository.findById(id).orElse(null)
    }
    fun deleteFundacionById(id: Long): Boolean {
        return if (fundacionRepository.existsById(id)) {
            fundacionRepository.deleteById(id)
            true
        } else {
            false
        }
    }

}
