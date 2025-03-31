package com.example.fusdeckotlin

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.ui.activities.administrativo.AdministrativoActivity
import com.example.fusdeckotlin.ui.activities.general.login.LoginActivity
import com.example.fusdeckotlin.ui.activities.instructor.InstructorActivity
import com.example.fusdeckotlin.ui.activities.root.RootActivity
import com.example.fusdeckotlin.ui.activities.secretario.SecretarioActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val administrativoButton: Button = findViewById(R.id.administrativoButton)
        val instructorButton: Button = findViewById(R.id.instructorButton)
        val secretarioButton: Button = findViewById(R.id.secretarioButton)
        val loginButton: Button = findViewById(R.id.loginButton)

        val rootButton: Button = findViewById(R.id.rootButton)

        administrativoButton.setOnClickListener {
            abrirPantalla("Administrativo")
        }

        instructorButton.setOnClickListener {
            abrirPantalla("Instructor")
        }

        secretarioButton.setOnClickListener {
            abrirPantalla("Secretario")
        }

        loginButton.setOnClickListener {
            abrirPantalla("Secretario")
        }

        loginButton.setOnClickListener {
            // Cambiamos esto para que vaya a LoginActivity
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
            // Opcional: agregar animación de transición
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }

        rootButton.setOnClickListener {
            abrirPantalla("Root")
        }
    }

    private fun abrirPantalla(rol: String) {
        Toast.makeText(this, "Accediendo como $rol", Toast.LENGTH_SHORT).show()

        when (rol) {
            "Instructor" -> {
                val intent = Intent(this, InstructorActivity::class.java)
                startActivity(intent)
            }
            "Administrativo" -> {
                val intent = Intent(this, AdministrativoActivity::class.java)
                startActivity(intent)
            }
            "Secretario" -> {
                val intent = Intent(this, SecretarioActivity::class.java)
                startActivity(intent)
            }
            "Root" -> {
                val intent = Intent(this, RootActivity::class.java)
                startActivity(intent)
            }
            else -> {
                Toast.makeText(this, "Módulo no implementado", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
