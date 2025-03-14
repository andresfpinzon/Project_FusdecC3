package com.example.fusdeckotlin.ui.activities.administrativo.colegio

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import models.administrativo.colegio.Colegio
import models.administrativo.colegio.ColegioServicio
import java.util.UUID
import com.example.fusdeckotlin.R
import java.lang.IllegalArgumentException


class ColegioActivity : AppCompatActivity() {

    private lateinit var nombreColegioEditText: EditText
    private lateinit var emailColegioEditText: EditText
    private lateinit var estadoColegioEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var colegios: MutableList<Colegio>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_colegio)

        nombreColegioEditText = findViewById(R.id.nombreColegioEditText)
        emailColegioEditText = findViewById(R.id.emailColegioEditText)
        estadoColegioEditText = findViewById(R.id.estadoColegioEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)

        confirmarButton.setOnClickListener {
            guardarColegio()
        }

        cancelarButton.setOnClickListener {
            finish()
        }
    }

    private fun guardarColegio() {
        try {
            val estadoColegio = estadoColegioEditText.text.toString().toBoolean()
            val estudiantes = estudiantesEditText.text.toString().split(",")
            val nuevoColegio = ColegioServicio.crearColegio(
                colegios,
                UUID.randomUUID().toString(),
                nombreColegioEditText.text.toString(),
                emailColegioEditText.text.toString(),
                estadoColegio,
                estudiantes
            )
            Toast.makeText(this, "Colegio creado: ${nuevoColegio.nombreColegio}", Toast.LENGTH_SHORT).show()
            finish()
        } catch (e: IllegalArgumentException) {
            Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
        }
    }
}