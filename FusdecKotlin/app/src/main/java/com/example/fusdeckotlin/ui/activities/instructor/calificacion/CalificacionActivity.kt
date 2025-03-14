package com.example.fusdeckotlin.ui.activities.instructor.calificacion

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.R

class CalificacionActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_calificacion)

        // Mensaje de prueba
        Toast.makeText(this, "Módulo de Calificación", Toast.LENGTH_SHORT).show()
    }
}