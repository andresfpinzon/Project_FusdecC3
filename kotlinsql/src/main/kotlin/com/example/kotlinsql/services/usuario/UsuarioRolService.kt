package com.example.kotlinsql.services.usuario

import com.example.kotlinsql.dto.usuario.UsuarioRolCreateRequest
import com.example.kotlinsql.dto.usuario.UsuarioRolResponse
import com.example.kotlinsql.model.usuario.UsuarioRol
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
            rolId = rs.getInt("rol_id")
        )
    }

    val rowMapperResponse = RowMapper<UsuarioRolResponse> { rs, _ ->
        UsuarioRolResponse(
            usuarioNumeroDocumento = rs.getString("usuario_numero_documento"),
            rolId = rs.getInt("rol_id"),
            rolNombre = rs.getString("nombre")
        )
    }


    fun obtenerTodos(): List<UsuarioRol> {
        val sql = "SELECT * FROM usuario_rol"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(rol: UsuarioRolCreateRequest): UsuarioRol? {
        val sql = "INSERT INTO usuario_rol (usuario_numero_documento, rol_id) VALUES (?, ?) RETURNING usuario_numero_documento, rol_id"
        return jdbcTemplate.queryForObject(sql, rowMapper, rol.usuarioNumeroDocumento, rol.rolId)
    }

    fun eliminar(usuarioNumeroDocumento: String, rolId: Int): Int {
        val sql = "DELETE FROM usuario_rol WHERE usuario_numero_documento = ? AND rol_id = ?"
        return jdbcTemplate.update(sql, usuarioNumeroDocumento, rolId)
    }


    fun obtenerPorDocumento(documento: String): List<UsuarioRol> {
        val sql = "SELECT * FROM usuario_rol WHERE usuario_numero_documento = ?"
        return jdbcTemplate.query(sql, rowMapper, documento)
    }

    fun obtenerConNombreRolPorDocumento(documento: String): List<UsuarioRolResponse> {
        val sql = """
        SELECT ur.usuario_numero_documento, r.id AS rol_id, r.nombre 
        FROM usuario_rol ur
        JOIN rol r ON ur.rol_id = r.id
        WHERE ur.usuario_numero_documento = ?
    """.trimIndent()
        return jdbcTemplate.query(sql, rowMapperResponse, documento)
    }

}
