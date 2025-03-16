package com.example.fusdeckotlin.ui.activities.secretario

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.activities.secretario.edicion.EdicionActivity

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

            Toast.makeText(this, "Módulo de Curso", Toast.LENGTH_SHORT).show()
        }

        edicionButton.setOnClickListener {

            val intent = Intent(this, EdicionActivity::class.java)
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