package com.example.fusdeckotlin.ui.activities.root

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R

class RootActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_root)

        // Referencias a los botones
        val fundacionButton: Button = findViewById(R.id.fundacionButton)
        val volverButton: Button = findViewById(R.id.volverButton)

        // Botón para ir a Fundación
        fundacionButton.setOnClickListener {
            Toast.makeText(this, "Módulo de Fundación", Toast.LENGTH_SHORT).show()
        }

        // Botón para volver a MainActivity
        volverButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish() // Opcional: Cierra la actividad actual
        }
    }
}



//val fundacionButton: Button = findViewById(R.id.fundacionButton)
//fundacionButton.setOnClickListener {
//
//}