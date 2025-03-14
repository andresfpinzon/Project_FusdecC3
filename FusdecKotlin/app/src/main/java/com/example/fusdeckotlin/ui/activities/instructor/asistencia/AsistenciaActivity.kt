package com.example.fusdeckotlin.ui.activities.instructor.asistencia

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
import com.example.fusdeckotlin.ui.adapters.AsistenciaAdapter
import models.instructor.asistencia.Asistencia
import servicios.instructor.asistencia.AsistenciaServicio
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class AsistenciaActivity : AppCompatActivity() {

    private lateinit var tituloEditText: EditText
    private lateinit var fechaEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var asistenciasRecyclerView: RecyclerView

    private val asistencias = mutableListOf(
        Asistencia.asistencia1,
        Asistencia.asistencia2
    )

    private lateinit var adapter: AsistenciaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_asistencia)

        tituloEditText = findViewById(R.id.tituloEditText)
        fechaEditText = findViewById(R.id.fechaEditText)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        asistenciasRecyclerView = findViewById(R.id.asistenciasRecyclerView)

        // Configurar RecyclerView
        adapter = AsistenciaAdapter(asistencias, ::onUpdateClick, ::onDeleteClick)
        asistenciasRecyclerView.layoutManager = LinearLayoutManager(this)
        asistenciasRecyclerView.adapter = adapter

        // Configurar selector de fecha
        fechaEditText.setOnClickListener {
            mostrarDatePicker()
        }

        // Botón confirmar
        confirmarButton.setOnClickListener {
            guardarAsistencia()
        }

        // Botón cancelar
        cancelarButton.setOnClickListener {
            finish()
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
                fechaEditText.setText(dateFormat.format(selectedDate.time))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun guardarAsistencia() {
        val titulo = tituloEditText.text.toString().trim()
        val fecha = fechaEditText.text.toString().trim()
        val usuarioId = usuarioIdEditText.text.toString().trim()
        val estudiantes = estudiantesEditText.text.toString().trim()

        if (titulo.isEmpty() || fecha.isEmpty() || usuarioId.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        val nuevaAsistencia = Asistencia(
            id = "ASIS${asistencias.size + 1}",
            tituloAsistencia = titulo,
            fechaAsistencia = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(fecha)!!,
            usuarioId = usuarioId,
            estadoAsistencia = true,
            estudiantes = estudiantes.split(",")
        )

        asistencias.add(nuevaAsistencia)
        adapter.notifyDataSetChanged()

        Toast.makeText(this, "Asistencia guardada exitosamente", Toast.LENGTH_SHORT).show()

        limpiarFormulario()
    }

    private fun limpiarFormulario() {
        tituloEditText.text.clear()
        fechaEditText.text.clear()
        usuarioIdEditText.text.clear()
        estudiantesEditText.text.clear()
    }

    private fun onUpdateClick(asistencia: Asistencia) {
        tituloEditText.setText(asistencia.tituloAsistencia)
        fechaEditText.setText(SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(asistencia.fechaAsistencia))
        usuarioIdEditText.setText(asistencia.usuarioId)
        estudiantesEditText.setText(asistencia.estudiantes.joinToString(", "))

        asistencias.remove(asistencia)
        adapter.notifyDataSetChanged()
    }

    private fun onDeleteClick(asistencia: Asistencia) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta asistencia?")

        builder.setPositiveButton("Sí") { _, _ ->
            // Eliminar la asistencia de la lista
            asistencias.remove(asistencia)
            adapter.notifyDataSetChanged()
            Toast.makeText(this, "Asistencia eliminada", Toast.LENGTH_SHORT).show()
        }

        builder.setNegativeButton("No") { dialog, _ ->
            dialog.dismiss() // Cierra el cuadro de diálogo sin hacer nada
        }

        val dialog = builder.create()
        dialog.show()
    }

}