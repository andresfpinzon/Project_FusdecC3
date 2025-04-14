package com.example.kotlinsql.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*


@Component
class JwtUtil(
    @Value("\${JWT_SECRET}") private val secretKey: String
) {

    fun generateToken(usuarioId: String, roles: List<String>): String {
        val now = Date()
        val exp = Date(now.time + 1000 * 60 * 60 * 12) // 12 horas

        return Jwts.builder()
            .claim("id", usuarioId)
            .claim("roles", roles)
            .setIssuedAt(now)
            .setExpiration(exp)
            .signWith(SignatureAlgorithm.HS256, secretKey.toByteArray())
            .compact()
    }

    fun validateToken(token: String): Map<String, Any> {
        val claims = Jwts.parser()
            .setSigningKey(secretKey.toByteArray())
            .parseClaimsJws(token)
            .body

        return mapOf(
            "id" to claims["id"] as String,
            "roles" to claims["roles"] as List<*>
        )
    }
}
