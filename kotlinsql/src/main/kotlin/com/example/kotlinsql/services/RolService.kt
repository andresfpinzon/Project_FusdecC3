package com.example.kotlinsql.services

import com.example.kotlinsql.model.Rol
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class RolService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Rol> { rs, _ ->
        Rol(
            id = rs.getInt("id"),
            nombre = rs.getString("nombre"),
        )
    }

    fun obtenerTodos(): List<Rol> {
        val sql = "SELECT * FROM rol"
        return jdbcTemplate.query(sql, rowMapper)
    }

    
}