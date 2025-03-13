package com.example.fusdeckotlin.ui.activities.instructor

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.activities.instructor.asistencia.AsistenciaActivity
import com.example.fusdeckotlin.ui.activities.instructor.calificacion.CalificacionActivity

class InstructorActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_instructor)

        // Botón para ir a Asistencia
        val asistenciaButton: Button = findViewById(R.id.asistenciaButton)
        asistenciaButton.setOnClickListener {
            val intent = Intent(this, AsistenciaActivity::class.java)
            startActivity(intent)
        }

        // Botón para ir a Calificación
        val calificacionButton: Button = findViewById(R.id.calificacionButton)
        calificacionButton.setOnClickListener {
            val intent = Intent(this, CalificacionActivity::class.java)
            startActivity(intent)
        }
    }
}