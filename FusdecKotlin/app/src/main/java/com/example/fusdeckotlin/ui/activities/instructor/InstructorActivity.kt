package com.example.fusdeckotlin.ui.activities.instructor

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.activities.instructor.asistencia.AsistenciaActivity

class InstructorActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_instructor)

        // Referencias a los botones
        val asistenciaButton: Button = findViewById(R.id.asistenciaButton)
        val volverButton: Button = findViewById(R.id.volverButton)

        // Botón para ir a Asistencia
        asistenciaButton.setOnClickListener {
            val intent = Intent(this, AsistenciaActivity::class.java)
            startActivity(intent)
        }

        // Botón para volver a MainActivity
        volverButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}