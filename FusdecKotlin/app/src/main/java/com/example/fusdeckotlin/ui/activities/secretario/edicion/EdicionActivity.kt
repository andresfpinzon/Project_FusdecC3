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
import com.example.fusdeckotlin.services.secretario.edicion.EdicionServices
import com.example.fusdeckotlin.ui.adapters.secretario.edicion.EdicionAdapter
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
    private lateinit var edicionesRecyclerView: RecyclerView

    private val ediciones = mutableListOf<Edicion>(Edicion.edicion1, Edicion.edicion2, Edicion.edicion3)
    private lateinit var adapter: EdicionAdapter

    private var isEditing: Boolean = false
    private var currentEdicionId: String? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edicion)

        tituloEdicion = findViewById(R.id.tituloEdicion)
        fechaInicioEdicion = findViewById(R.id.fechaInicioEdicion)
        fechaFinEdicion = findViewById(R.id.fechaFinEdicion)
        cursoId = findViewById(R.id.cursoId)
        confirmarEdicionButton = findViewById(R.id.confirmarEdicionButton)
        cancelarEdicionButton = findViewById(R.id.cancelarEdicionButton)
        edicionesRecyclerView = findViewById(R.id.edicionesRecyclerView)

        // Configurar RecyclerView
        adapter = EdicionAdapter(ediciones, ::onUpdateClick, ::onDeleteClick)
        edicionesRecyclerView.layoutManager = LinearLayoutManager(this)
        edicionesRecyclerView.adapter = adapter

        // Configurar selector de fecha
        fechaInicioEdicion.setOnClickListener {
            mostrarDatePicker()
        }

        fechaFinEdicion.setOnClickListener {
            mostrarDatePicker()
        }

        confirmarEdicionButton.setOnClickListener {
            guardarEdicion()
        }

        cancelarEdicionButton.setOnClickListener {
            finish() // Cierra la Activity sin guardar datos
        }
    }

    private fun mostrarDatePicker() {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val selectedDate = Calendar.getInstance()
                selectedDate.set(year, month, dayOfMonth)
                val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
                fechaInicioEdicion.setText(dateFormat.format(selectedDate.time))
                fechaFinEdicion.setText(dateFormat.format(selectedDate.time))

            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun generarIdUnico(): String {
        // Generar un ID único
        return "ASIS${ediciones.size + 1}"
    }

    private fun guardarEdicion() {
        val titulo = tituloEdicion.text.toString().trim()
        val fechaInicio = fechaInicioEdicion.text.toString().trim()
        val fechaFin = fechaFinEdicion.text.toString().trim()
        val curso = cursoId.text.toString().trim()

        if (titulo.isEmpty() || fechaInicio.isEmpty() || fechaFin.isEmpty() || curso.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                // Actualizar la edicion existente
                EdicionServices.actualizarEdicion(
                    currentEdicionId!!,
                    titulo,
                    SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(fechaInicio)!!,
                    SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(fechaFin)!!,
                    true,
                    curso
                )
                Toast.makeText(this, "Edicion actualizada exitosamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentEdicionId = null
            } else {
                // Crear una nueva edicion
                val id = generarIdUnico()
                val nuevaEdicion = EdicionServices.crearEdicion(
                    id,
                    titulo,
                    SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(fechaInicio)!!,
                    SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(fechaFin)!!,
                    curso,
                    true
                )
                Toast.makeText(this, "Asistencia guardada exitosamente", Toast.LENGTH_SHORT).show()
            }

            adapter.notifyDataSetChanged()
            limpiarFormulario()
        } catch (e: IllegalArgumentException) {
            Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        tituloEdicion.text.clear()
        fechaInicioEdicion.text.clear()
        fechaFinEdicion.text.clear()
        cursoId.text.clear()
    }

    private fun onUpdateClick(edicion: Edicion) {
        isEditing = true
        currentEdicionId = edicion.getId()
        tituloEdicion.setText(edicion.getTituloEdicion())
        fechaInicioEdicion.setText(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(edicion.getFechaInicioEdicion()))
        fechaInicioEdicion.setText(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(edicion.getFechaFinEdicion()))
        cursoId.setText(edicion.getCursoId())
    }

    private fun onDeleteClick(edicion: Edicion) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta edicion?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                EdicionServices.desactivarEdicion(edicion.getId())
                ediciones.remove(edicion)
                adapter.notifyDataSetChanged()
                Toast.makeText(this, "Edicion eliminada", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ ->
            dialog.dismiss()
        }

        val dialog = builder.create()
        dialog.show()
    }

}