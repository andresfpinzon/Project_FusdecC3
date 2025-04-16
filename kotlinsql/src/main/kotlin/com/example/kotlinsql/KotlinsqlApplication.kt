package com.example.kotlinsql

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener

@SpringBootApplication
class KotlinsqlApplication {

	@EventListener(ApplicationReadyEvent::class)
	fun showSwaggerUrl() {
		println("🚀 Swagger UI disponible en: http://localhost:8080/swagger-ui.html")
	}
}

fun main(args: Array<String>) {
	runApplication<KotlinsqlApplication>(*args)

}