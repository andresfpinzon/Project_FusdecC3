package com.example.kotlinsql.services

import com.example.kotlinsql.dto.UsuarioRolCreateRequest
import com.example.kotlinsql.model.UsuarioRol
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class UsuarioRolService {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    val rowMapper = RowMapper<UsuarioRol> { rs, _ ->
        UsuarioRol(
            usuarioNumeroDocumento = rs.getString("usuario_numero_documento"),
            rol = rs.getString("rol")
        )
    }

    fun obtenerTodos(): List<UsuarioRol> {
        val sql = "SELECT * FROM usuario_rol"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(rol: UsuarioRolCreateRequest): UsuarioRol? {
        val sql = "INSERT INTO usuario_rol (usuario_numero_documento, rol) VALUES (?, ?) RETURNING *"
        return jdbcTemplate.queryForObject(sql, rowMapper, rol.usuarioNumeroDocumento, rol.rol)
    }

    fun eliminar(usuarioNumeroDocumento: String, rol: String): Int {
        val sql = "DELETE FROM usuario_rol WHERE usuario_numero_documento = ? AND rol = ?"
        return jdbcTemplate.update(sql, usuarioNumeroDocumento, rol)
    }

    fun obtenerPorDocumento(documento: String): List<UsuarioRol> {
        val sql = "SELECT * FROM usuario_rol WHERE usuario_numero_documento = ?"
        return jdbcTemplate.query(sql, rowMapper, documento)
    }
}
