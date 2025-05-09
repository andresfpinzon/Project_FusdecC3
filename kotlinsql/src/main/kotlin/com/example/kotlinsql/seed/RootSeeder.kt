package com.example.kotlinsql.seed

import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class RootSeeder(
    private val jdbcTemplate: JdbcTemplate,
    private val passwordEncoder: PasswordEncoder,
    @Value("\${ROOT_EMAIL}") private val rootEmail: String,
    @Value("\${ROOT_PASSWORD}") private val rootPassword: String
) {

    @PostConstruct
    fun seedRootUser() {
        // Verificar si el usuario root ya existe
        val rootUser = jdbcTemplate.queryForList(
            "SELECT * FROM usuario WHERE correo = ?", rootEmail
        )
        if (rootUser.isNotEmpty()) {
            println("✅ Usuario root ya existe.")
            return
        }

        println("⏳ Creando usuario root...")

        val documento = "123456789"
        val nombre = "fundacion"
        val apellido = "fusdec"
        val passwordHash = passwordEncoder.encode(rootPassword)

        jdbcTemplate.update(
            """INSERT INTO usuario (numero_documento, nombre, apellido, correo, password)
               VALUES (?, ?, ?, ?, ?)""",
            documento, nombre, apellido, rootEmail, passwordHash
        )

        val rolId = jdbcTemplate.queryForObject(
            "SELECT id FROM rol WHERE nombre = ?", Int::class.java, "Root"
        ) ?: run {
            jdbcTemplate.update(
                "INSERT INTO rol (nombre) VALUES (?)", "Root"
            )
            jdbcTemplate.queryForObject(
                "SELECT id FROM rol WHERE nombre = ?", Int::class.java, "Root"
            ) ?: throw Exception("Error al crear el rol Root")
        }

        jdbcTemplate.update(
            "INSERT INTO usuario_rol (usuario_numero_documento, rol_id) VALUES (?, ?)",
            documento, rolId
        )

        println("✅ Usuario root creado exitosamente.")
    }
}
