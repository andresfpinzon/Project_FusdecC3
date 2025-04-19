package com.example.kotlinsql.services

import com.example.kotlinsql.dto.UsuarioCreateRequest
import com.example.kotlinsql.dto.UsuarioUpdateRequest
import com.example.kotlinsql.model.Usuario
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.dao.EmptyResultDataAccessException

@Service
class UsuarioService {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    @Autowired
    lateinit var passwordEncoder: PasswordEncoder

    val rowMapper = RowMapper<Usuario> { rs, _ ->
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

    fun crear(usuario: UsuarioCreateRequest): Usuario? {
        val existeCorreo = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM usuario WHERE correo = ?",
            Int::class.java,
            usuario.correo
        ) ?: 0

        val existeDocumento = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM usuario WHERE numero_documento = ?",
            Int::class.java,
            usuario.numeroDocumento
        ) ?: 0

        if (existeCorreo > 0 || existeDocumento > 0) {
            throw IllegalArgumentException("El correo o documento ya está registrado")
        }

        val sql = """
        INSERT INTO usuario (numero_documento, nombre, apellido, correo, password, estado) 
        VALUES (?, ?, ?, ?, ?, ?)
        RETURNING *
    """.trimIndent()

        val encryptedPassword = passwordEncoder.encode(usuario.password)

        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            usuario.numeroDocumento,
            usuario.nombre,
            usuario.apellido,
            usuario.correo,
            encryptedPassword,
            true
        )
    }

    fun actualizar(documento: String, usuario: UsuarioUpdateRequest): Usuario? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        usuario.nombre?.let { campos.add("nombre = ?");valores.add(it)}
        usuario.apellido?.let { campos.add("apellido = ?");valores.add(it) }
        usuario.correo?.let { campos.add("correo = ?");valores.add(it) }
        usuario.password?.let { campos.add("password = ?");valores.add(passwordEncoder.encode(it)) }
        usuario.estado?.let { campos.add("estado = ?");valores.add(it) }

        if (campos.isEmpty()) return null

        campos.add("updated_at = CURRENT_TIMESTAMP")

        val sql = """
        UPDATE usuario 
        SET ${campos.joinToString(", ")} 
        WHERE numero_documento = ?
    """.trimIndent()

        valores.add(documento)
        jdbcTemplate.update(sql, *valores.toTypedArray())

        val sqlSelect = "SELECT * FROM usuario WHERE numero_documento = ?"
        return jdbcTemplate.queryForObject(sqlSelect, rowMapper, documento)

    }

    fun eliminarPorDocumento(documento: String): Int {
        val sql = "DELETE FROM usuario WHERE numero_documento = ?"
        return jdbcTemplate.update(sql, documento)
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