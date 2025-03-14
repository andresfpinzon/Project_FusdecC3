package com.example.fusdeckotlin.ui.activities.administrativo.brigada

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.R

class BrigadaActivity : AppCompatActivity() {

    private lateinit var nombreBrigadaEditText: EditText
    private lateinit var ubicacionBrigadaEditText: EditText
    private lateinit var comandoIdEditText: EditText
    private lateinit var unidadesEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_brigada)

        nombreBrigadaEditText = findViewById(R.id.nombreBrigadaEditText)
        ubicacionBrigadaEditText = findViewById(R.id.ubicacionBrigadaEditText)
        comandoIdEditText = findViewById(R.id.comandoIdEditText)
        unidadesEditText = findViewById(R.id.unidadesEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)

        confirmarButton.setOnClickListener {
            guardarBrigada()
        }

        cancelarButton.setOnClickListener {
            finish()
        }
    }

    private fun guardarBrigada() {
        val nombreBrigada = nombreBrigadaEditText.text.toString().trim()
        val ubicacionBrigada = ubicacionBrigadaEditText.text.toString().trim()
        val comandoId = comandoIdEditText.text.toString().trim()
        val unidades = unidadesEditText.text.toString().trim()

        if (nombreBrigada.isEmpty() || ubicacionBrigada.isEmpty() || comandoId.isEmpty() || unidades.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        Toast.makeText(this, "Brigada guardada exitosamente", Toast.LENGTH_SHORT).show()
        finish()
    }
}