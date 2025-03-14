package com.example.fusdeckotlin.ui.activities.administrativo.unidad

import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import com.example.fusdeckotlin.R

class UnidadActivity : AppCompatActivity() {

    private lateinit var nombreUnidadEditText: EditText
    private lateinit var ubicacionUnidadEditText: EditText
    private lateinit var brigadaIdEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_unidad)

        nombreUnidadEditText = findViewById(R.id.nombreUnidadEditText)
        ubicacionUnidadEditText = findViewById(R.id.ubicacionUnidadEditText)
        brigadaIdEditText = findViewById(R.id.brigadaIdEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)

        confirmarButton.setOnClickListener {
            guardarUnidad()
        }

        cancelarButton.setOnClickListener {
            finish()
        }
    }

    private fun guardarUnidad() {
        val nombreUnidad = nombreUnidadEditText.text.toString().trim()
        val ubicacionUnidad = ubicacionUnidadEditText.text.toString().trim()
        val brigadaId = brigadaIdEditText.text.toString().trim()

        if (nombreUnidad.isEmpty() || ubicacionUnidad.isEmpty() || brigadaId.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        Toast.makeText(this, "Unidad guardada exitosamente", Toast.LENGTH_SHORT).show()
        finish()
    }



}