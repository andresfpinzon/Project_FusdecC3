package com.example.kotlinsql.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder

@Component
class JwtFilter(val jwtUtil: JwtUtil) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            val token = authHeader.substring(7)
            try {
                val claims = jwtUtil.validateToken(token)
                val userId = claims["id"] as String
                val roles = claims["roles"] as List<*>

                // Construir authorities
                val authorities = roles.map {
                    SimpleGrantedAuthority(it.toString()) // ya viene con "ROLE_"
                }

                // Establecer el contexto de seguridad
                val authentication = UsernamePasswordAuthenticationToken(userId, null, authorities)
                SecurityContextHolder.getContext().authentication = authentication

                // También puedes dejar los atributos en request si los necesitas
                request.setAttribute("userId", userId)
                request.setAttribute("roles", roles)
            } catch (e: Exception) {
                response.status = HttpServletResponse.SC_UNAUTHORIZED
                response.writer.write("Token inválido")
                return
            }
        } else {
            response.status = HttpServletResponse.SC_UNAUTHORIZED
            response.writer.write("Token no proporcionado")
            return
        }

        filterChain.doFilter(request, response)
    }

    override fun shouldNotFilter(request: HttpServletRequest): Boolean {
        val path = request.requestURI
        return path.startsWith("/auth/login") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/swagger-ui") ||
                path.startsWith("/swagger-resources")
    }
}
