package com.example.kotlinsql.config

import com.example.kotlinsql.security.JwtFilter
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(val jwtFilter: JwtFilter) {

    @Bean
    fun filterRegistration(): FilterRegistrationBean<JwtFilter> {
        val registrationBean = FilterRegistrationBean(jwtFilter)
        registrationBean.addUrlPatterns(
            "/usuarios/*",
            "/rolesAsignados/*",
            "/roles/*",
            "/usuario-roles/*",
            "/brigadas/*",
            "/comandos/*",
            "/estudiantes/*",
            "/asistencias/*",
            "/asistencia-estudiantes/*",
            "/calificaciones/*",
            "/calificacion-estudiantes/*",
            "/usuarios-management/*",
            "/certificados/*",
            "/auditorias/*",
            "/unidades/*",
            "/ediciones/*",
            "/auditorias/*",
            "/fundaciones/*",
            "/colegios/*",
            "/cursos/*"


        )
        return registrationBean
    }

    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        config.allowCredentials = true
        config.addAllowedOrigin("http://localhost:5173" )
        config.addAllowedOrigin("http://10.0.2.2" )// Cambia esto en producción
        config.addAllowedHeader("*")
        config.addAllowedMethod("*")
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }

    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173", "http://10.0.2.2")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true)
            }
        }
    }
}

