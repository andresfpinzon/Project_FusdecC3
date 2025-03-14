package com.example.fusdeckotlin.ui.activities.administrativo.comando

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.R


class ComandoActivity : AppCompatActivity(){

    private lateinit var nombreComandoEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comando)

        nombreComandoEditText = findViewById(R.id.nombreComandoEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)

        confirmarButton.setOnClickListener {
            val nombreComando = nombreComandoEditText.text.toString()

            if (nombreComando.isEmpty()) {
                Toast.makeText(this, "Por favor, llena todos los campos", Toast.LENGTH_SHORT).show()
            } else {
                // Guardar comando
                Toast.makeText(this, "Comando guardado", Toast.LENGTH_SHORT).show()
            }
        }

        cancelarButton.setOnClickListener {
            finish()
        }

        confirmarButton.setOnClickListener {
            guardarComando()
        }
    }

    private fun guardarComando (){
        val nombreComando = nombreComandoEditText.text.toString()


        if (nombreComando.isEmpty()) {
            Toast.makeText(this, "Por favor, llena todos los campos", Toast.LENGTH_SHORT).show()
        } else {
            // Guardar comando
            Toast.makeText(this, "Comando guardado", Toast.LENGTH_SHORT).show()
        }


    }


}