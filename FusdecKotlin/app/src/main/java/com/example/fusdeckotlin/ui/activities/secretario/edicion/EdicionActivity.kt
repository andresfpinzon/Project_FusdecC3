package com.example.fusdeckotlin.ui.activities.secretario.edicion

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.instructor.asistencia.AsistenciaAdapter
import models.secretario.edicion.Edicion
import java.text.SimpleDateFormat
import java.util.*

class EdicionActivity : AppCompatActivity() {

    private lateinit var tituloEdicion: EditText
    private lateinit var fechaInicioEdicion: EditText
    private lateinit var fechaFinEdicion: EditText
    private lateinit var cursoId: EditText
    private lateinit var confirmarEdicionButton: Button
    private lateinit var cancelarEdicionButton: Button
    private val ediciones = mutableListOf<Edicion>(Edicion.edicion1,Edicion.edicion2,Edicion.edicion3) // Lista de asistencias simulada

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edicion)

        tituloEdicion = findViewById(R.id.tituloEdicion)
        fechaInicioEdicion = findViewById(R.id.fechaInicioEdicion)
        fechaFinEdicion = findViewById(R.id.fechaFinEdicion)
        cursoId = findViewById(R.id.cursoId)
        confirmarEdicionButton = findViewById(R.id.confirmarEdicionButton)
        cancelarEdicionButton = findViewById(R.id.cancelarEdicionButton)

        confirmarEdicionButton.setOnClickListener {
            crearEdicion()
        }

        cancelarEdicionButton.setOnClickListener {
            finish() // Cierra la Activity sin guardar datos
        }
    }

    private fun crearEdicion() {
        val titulo = tituloEdicion.text.toString()
        val fechaInicio = fechaInicioEdicion.text.toString()
        val fechaFin = fechaFinEdicion.text.toString()
        val curso = cursoId.text.toString().split(",")

        if (titulo.isBlank() || curso.isEmpty()) {
            Toast.makeText(this, "Faltan datos", Toast.LENGTH_SHORT).show()
            return
        }

    }
}