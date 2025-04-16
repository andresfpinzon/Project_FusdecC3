package com.example.fusdeckotlin.ui.activities.secretario

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.activities.secretario.curso.CursoActivity
import com.example.fusdeckotlin.ui.activities.secretario.edicion.EdicionActivity
import com.example.fusdeckotlin.ui.activities.secretario.estudiante.EstudianteActivity
import com.example.fusdeckotlin.ui.activities.secretario.horario.HorarioActivity

class SecretarioActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_secretario)


        val cursoButton: Button = findViewById(R.id.cursoButton)
        val edicionButton: Button = findViewById(R.id.edicionButton)
        val estudianteButton: Button = findViewById(R.id.estudianteButton)
        val horarioButton: Button = findViewById(R.id.horarioButton)
        val volverButton: Button = findViewById(R.id.volverButton)


        cursoButton.setOnClickListener {

            val intent = Intent(this, CursoActivity::class.java)
            startActivity(intent)
        }

        edicionButton.setOnClickListener {

            val intent = Intent(this, EdicionActivity::class.java)
            startActivity(intent)

        }

        estudianteButton.setOnClickListener {

            val intent = Intent(this, EstudianteActivity::class.java)
            startActivity(intent)

        }

        horarioButton.setOnClickListener {

            val intent = Intent(this, HorarioActivity::class.java)
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