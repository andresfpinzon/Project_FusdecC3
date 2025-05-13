package com.example.kotlinsql.services.usuario

import com.example.kotlinsql.dto.usuario.UsuarioCreateRequest
import com.example.kotlinsql.dto.usuario.UsuarioUpdateRequest
import com.example.kotlinsql.model.usuario.Usuario
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
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
        val usuarioNormalizado = usuario.normalizar()

        validarExistenciaCorreoYDocumento(usuarioNormalizado.correo, usuarioNormalizado.numeroDocumento)

        val encryptedPassword = passwordEncoder.encode(usuarioNormalizado.password)
        val sql = """
            INSERT INTO usuario (numero_documento, nombre, apellido, correo, password, estado) 
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            usuarioNormalizado.numeroDocumento,
            usuarioNormalizado.nombre,
            usuarioNormalizado.apellido,
            usuarioNormalizado.correo,
            encryptedPassword,
            true
        ) ?: throw IllegalArgumentException("No se pudo crear el usuario")
    }

    fun actualizar(documento: String, usuario: UsuarioUpdateRequest): Usuario? {
        if (usuario.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val usuarioNormalizado = usuario.normalizar()

        // Verificar si el usuario existe primero
        val usuarioExiste = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM usuario WHERE numero_documento = ?",
            Int::class.java,
            documento
        ) ?: 0

        if (usuarioExiste == 0) {
            throw NoSuchElementException("No se encontró el usuario con documento $documento")
        }

        // Verificar correo duplicado (case-insensitive)
        usuarioNormalizado.correo?.let { nuevoCorreo ->
            val existeCorreoEnOtroUsuario = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM usuario WHERE LOWER(correo) = LOWER(?) AND numero_documento != ?",
                Int::class.java,
                nuevoCorreo,
                documento
            ) ?: 0

            if (existeCorreoEnOtroUsuario > 0) {
                throw IllegalArgumentException("El correo '$nuevoCorreo' ya está registrado por otro usuario")
            }
        }

        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        usuarioNormalizado.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        usuarioNormalizado.apellido?.let { campos.add("apellido = ?"); valores.add(it) }
        usuarioNormalizado.correo?.let { campos.add("correo = ?"); valores.add(it) }
        usuarioNormalizado.password?.let { campos.add("password = ?"); valores.add(passwordEncoder.encode(it)) }
        usuarioNormalizado.estado?.let { campos.add("estado = ?"); valores.add(it) }

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

        return jdbcTemplate.queryForObject(
            "SELECT * FROM usuario WHERE numero_documento = ?",
            rowMapper,
            documento
        )
    }

    fun eliminarPorDocumento(documento: String): Int {
        return try {
            val sql = "DELETE FROM usuario WHERE numero_documento = ?"
            jdbcTemplate.update(sql, documento)
        } catch (ex: DataIntegrityViolationException) {
            throw IllegalStateException("No se puede eliminar el usuario con documento $documento porque está asignado a una unidad.")
        }
    }

    private fun validarExistenciaCorreoYDocumento(correo: String, numeroDocumento: String) {
        val existeCorreo = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM usuario WHERE LOWER(correo) = LOWER(?)",
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