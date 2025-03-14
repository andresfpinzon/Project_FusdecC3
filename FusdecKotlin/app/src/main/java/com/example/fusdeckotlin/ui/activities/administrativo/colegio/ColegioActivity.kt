package com.example.fusdeckotlin.ui.activities.administrativo.colegio


import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.R

class ColegioActivity : AppCompatActivity() {

    private lateinit var nombreColegioEditText: EditText
    private lateinit var emailColegioEditText: EditText
    private lateinit var estadoColegioSwitch: Switch
    private lateinit var estudiantesEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_colegio)

        nombreColegioEditText = findViewById(R.id.nombreColegioEditText)
        emailColegioEditText = findViewById(R.id.emailColegioEditText)
        estadoColegioSwitch = findViewById(R.id.estadoColegioSwitch)
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
        val nombreColegio = nombreColegioEditText.text.toString().trim()
        val emailColegio = emailColegioEditText.text.toString().trim()
        val estadoColegio = estadoColegioSwitch.isChecked.toString()
        val estudiantes = estudiantesEditText.text.toString().trim()

        if (nombreColegio.isEmpty() || emailColegio.isEmpty() || estadoColegio.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        Toast.makeText(this, "Colegio guardado exitosamente", Toast.LENGTH_SHORT).show()
        finish()
    }
}