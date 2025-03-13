package com.example.fusdeckotlin

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.ui.activities.instructor.InstructorActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val administrativoButton: Button = findViewById(R.id.administrativoButton)
        val instructorButton: Button = findViewById(R.id.instructorButton)
        val secretarioButton: Button = findViewById(R.id.secretarioButton)
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
            else -> {
                Toast.makeText(this, "Módulo no implementado", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
