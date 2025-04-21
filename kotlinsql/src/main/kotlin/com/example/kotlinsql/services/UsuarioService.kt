package com.example.kotlinsql.services

import com.example.kotlinsql.dto.UsuarioCreateRequest
import com.example.kotlinsql.dto.UsuarioUpdateRequest
import com.example.kotlinsql.model.Usuario
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.dao.EmptyResultDataAccessException
import java.sql.ResultSet

@Service
class UsuarioService(
    private val jdbcTemplate: JdbcTemplate,
    private val passwordEncoder: PasswordEncoder
) {

    private val rowMapper = RowMapper<Usuario> { rs: ResultSet, _: Int ->
        Usuario(
            numeroDocumento = rs.getString("numero_documento"),
            nombre = rs.getString("nombre"),
            apellido = rs.getString("apellido"),
            correo = rs.getString("correo"),
            password = rs.getString("password"),
            estado = rs.getBoolean("estado"),
            createdAt = rs.getString("created_at"),
            updatedAt = rs.getString("updated_at")
        )
    }

    fun obtenerTodos(): List<Usuario> {
        val sql = "SELECT * FROM usuario"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(usuario: UsuarioCreateRequest): Usuario {
        validarExistenciaCorreoYDocumento(usuario.correo, usuario.numeroDocumento)

        val encryptedPassword = passwordEncoder.encode(usuario.password)
        val sql = """
            INSERT INTO usuario (numero_documento, nombre, apellido, correo, password, estado) 
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            usuario.numeroDocumento,
            usuario.nombre,
            usuario.apellido,
            usuario.correo,
            encryptedPassword,
            true
        ) ?: throw IllegalArgumentException("No se pudo crear el usuario")
    }

    fun actualizar(documento: String, usuario: UsuarioUpdateRequest): Usuario? {
        if (usuario.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        usuario.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        usuario.apellido?.let { campos.add("apellido = ?"); valores.add(it) }
        usuario.correo?.let { campos.add("correo = ?"); valores.add(it) }
        usuario.password?.let { campos.add("password = ?"); valores.add(passwordEncoder.encode(it)) }
        usuario.estado?.let { campos.add("estado = ?"); valores.add(it) }

        campos.add("updated_at = CURRENT_TIMESTAMP")
        valores.add(documento)

        val sql = """
        UPDATE usuario 
        SET ${campos.joinToString(", ")} 
        WHERE numero_documento = ?
    """.trimIndent()

        val filasActualizadas = jdbcTemplate.update(sql, *valores.toTypedArray())

        if (filasActualizadas == 0) {
            throw NoSuchElementException("No se encontró el usuario con documento $documento para actualizar")
        }

        val sqlSelect = "SELECT * FROM usuario WHERE numero_documento = ?"
        return jdbcTemplate.queryForObject(sqlSelect, rowMapper, documento)
    }

    fun eliminarPorDocumento(documento: String): Int {
        val sql = "DELETE FROM usuario WHERE numero_documento = ?"
        return jdbcTemplate.update(sql, documento)
    }

    private fun validarExistenciaCorreoYDocumento(correo: String, numeroDocumento: String) {
        val existeCorreo = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM usuario WHERE correo = ?",
            Int::class.java,
            correo
        ) ?: 0

        val existeDocumento = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM usuario WHERE numero_documento = ?",
            Int::class.java,
            numeroDocumento
        ) ?: 0

        if (existeCorreo > 0) {
            throw IllegalArgumentException("El correo ya está registrado")
        }

        if (existeDocumento > 0) {
            throw IllegalArgumentException("El número de documento ya está registrado")
        }
    }

    fun obtenerPorDocumento(documento: String): Usuario? {
        val sql = "SELECT * FROM usuario WHERE numero_documento = ? AND estado = true"
        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, documento)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }
}
private fun UsuarioUpdateRequest.isEmpty(): Boolean {
    return nombre == null && apellido == null && correo == null && password == null && estado == null
}