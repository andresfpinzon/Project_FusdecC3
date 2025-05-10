package com.example.kotlinsql.services.usuario

import com.example.kotlinsql.model.usuario.Rol
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class RolService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Rol> { rs, _ ->
        Rol(
            id = rs.getInt("id"),
            nombre = rs.getString("nombre")
        )
    }

    fun obtenerTodos(): List<Rol> {
        val sql = "SELECT * FROM rol"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun obtenerPorId(id: Int): Rol? {
        val sql = "SELECT * FROM rol WHERE id = ?"
        return jdbcTemplate.queryForObject(sql, rowMapper, id)
    }

    fun obtenerPorNombre(nombre: String): Rol? {
        val sql = "SELECT * FROM rol WHERE nombre = ?"
        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, nombre)
        } catch (e: Exception) {
            null
        }
    }
}