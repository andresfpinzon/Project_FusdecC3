package com.example.fusdeckotlin.ui.activities.secretario.horario

import android.app.AlertDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.secretario.horario.HorarioAdapter
import models.secretario.horario.Horario

class HorarioActivity : AppCompatActivity() {

    private lateinit var tituloHorario: EditText
    private lateinit var horaInicio: EditText
    private lateinit var horaFin: EditText
    private lateinit var confirmarHorarioButton: Button
    private lateinit var cancelarHorarioButton: Button
    private lateinit var horariosRecyclerView: RecyclerView

    private val horarios = mutableListOf(Horario.horario1, Horario.horario2, Horario.horario3)
    private lateinit var adapter: HorarioAdapter

    private var isEditing: Boolean = false
    private var currentHorarioId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_horario)

        tituloHorario = findViewById(R.id.tituloHorario)
        horaInicio = findViewById(R.id.horaInicio)
        horaFin = findViewById(R.id.horaFin)
        confirmarHorarioButton = findViewById(R.id.confirmarHorarioButton)
        cancelarHorarioButton = findViewById(R.id.cancelarHorarioButton)
        horariosRecyclerView = findViewById(R.id.horariosRecyclerView)

        adapter = HorarioAdapter(horarios, ::onUpdateClick, ::onDeleteClick)
        horariosRecyclerView.layoutManager = LinearLayoutManager(this)
        horariosRecyclerView.adapter = adapter

        confirmarHorarioButton.setOnClickListener { guardarHorario() }
        cancelarHorarioButton.setOnClickListener { finish() }
    }

    private fun generarIdUnico(): String {
        return "HORA${horarios.size + 1}" // Genera un ID único basado en el tamaño de la lista
    }

    private fun guardarHorario() {
        val titulo = tituloHorario.text.toString().trim()
        val inicio = horaInicio.text.toString().trim()
        val fin = horaFin.text.toString().trim()

        if (titulo.isEmpty() || inicio.isEmpty() || fin.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        if (isEditing) {
            val horario = horarios.find { it.id == currentHorarioId }
            horario?.apply {
                tituloHorario = titulo
                horaInicio = inicio
                horaFin = fin
            }
            Toast.makeText(this, "Horario actualizado", Toast.LENGTH_SHORT).show()
            isEditing = false
            currentHorarioId = null
        } else {
            val nuevoHorario = Horario(generarIdUnico(), titulo, inicio, fin)
            horarios.add(nuevoHorario)
            Toast.makeText(this, "Horario agregado", Toast.LENGTH_SHORT).show()
        }

        adapter.notifyDataSetChanged()
        limpiarFormulario()
    }

    private fun limpiarFormulario() {
        tituloHorario.text.clear()
        horaInicio.text.clear()
        horaFin.text.clear()
    }

    private fun onUpdateClick(horario: Horario) {
        isEditing = true
        currentHorarioId = horario.id
        tituloHorario.setText(horario.tituloHorario)
        horaInicio.setText(horario.horaInicio)
        horaFin.setText(horario.horaFin)
    }

    private fun onDeleteClick(horario: Horario) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar este horario?")

        builder.setPositiveButton("Sí") { _, _ ->
            horarios.remove(horario)
            adapter.notifyDataSetChanged()
            Toast.makeText(this, "Horario eliminado", Toast.LENGTH_SHORT).show()
        }

        builder.setNegativeButton("No") { dialog, _ ->
            dialog.dismiss()
        }

        val dialog = builder.create()
        dialog.show()
    }
}