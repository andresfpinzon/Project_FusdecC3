package com.example.kotlinsql.services

import com.example.kotlinsql.model.Fundacion
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class FundacionService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Fundacion> { rs, _ ->
        Fundacion(
            id = rs.getInt("id"),
            nombre = rs.getString("nombre"),
            estado = rs.getBoolean("estado"),
        )
    }

    fun obtenerTodas(): List<Fundacion> {
        return jdbcTemplate.query("SELECT * FROM  fundacion", rowMapper)
    }
}
