package com.example.fusdeckotlin.ui.activities.instructor

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.auth.AuthManager
import com.example.fusdeckotlin.ui.activities.instructor.asistencia.AsistenciaActivity
import com.example.fusdeckotlin.ui.activities.secretario.estudiante.EstudianteActivity

class InstructorActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_instructor)

        // Referencias a los botones
        val asistenciaButton: Button = findViewById(R.id.asistenciaButton)
        val estudianteButton: Button = findViewById(R.id.estudianteButton)
        val logoutButton: Button = findViewById(R.id.logoutButton)

        // Botón para ir a Asistencia
        asistenciaButton.setOnClickListener {
            val intent = Intent(this, AsistenciaActivity::class.java)
            startActivity(intent)
        }

        estudianteButton.setOnClickListener {

            val intent = Intent(this, EstudianteActivity::class.java)
            startActivity(intent)

        }

        logoutButton.setOnClickListener {
            AuthManager.clearToken()
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}