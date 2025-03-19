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
import com.example.fusdeckotlin.ui.adapters.instructor.asistencia.AsistenciaAdapter
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import com.example.fusdeckotlin.services.instructor.asistencia.AsistenciaServicio
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

class AsistenciaActivity : AppCompatActivity() {

    private lateinit var tituloEditText: EditText
    private lateinit var fechaEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var asistenciasRecyclerView: RecyclerView

    private val asistencias = mutableListOf(Asistencia.asistencia1, Asistencia.asistencia2)
    private lateinit var adapter: AsistenciaAdapter

    private var isEditing: Boolean = false
    private var currentAsistenciaId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_asistencia)

        // Inicializar vistas
        tituloEditText = findViewById(R.id.tituloEditText)
        fechaEditText = findViewById(R.id.fechaEditText)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        asistenciasRecyclerView = findViewById(R.id.asistenciasRecyclerView)

        // Configurar RecyclerView con asistencias activas
        adapter = AsistenciaAdapter(
            AsistenciaServicio.listarAsistenciasActivas(asistencias),
            ::onUpdateClick,
            ::onDeleteClick
        )
        asistenciasRecyclerView.layoutManager = LinearLayoutManager(this)
        asistenciasRecyclerView.adapter = adapter

        // Configurar DatePicker
        fechaEditText.setOnClickListener { mostrarDatePicker() }

        // Botón confirmar
        confirmarButton.setOnClickListener { guardarAsistencia() }

        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }
    }

    private fun mostrarDatePicker() {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val selectedDate = LocalDate.of(year, month + 1, dayOfMonth)
                val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                fechaEditText.setText(selectedDate.format(formatter))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun generarIdUnico(): String = "ASIS${asistencias.size + 1}"

    private fun guardarAsistencia() {
        val titulo = tituloEditText.text.toString().trim()
        val fechaStr = fechaEditText.text.toString().trim()
        val usuarioId = usuarioIdEditText.text.toString().trim()
        val estudiantes = estudiantesEditText.text.toString().trim()

        if (titulo.isEmpty() || fechaStr.isEmpty() || usuarioId.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
            val fecha = LocalDate.parse(fechaStr, formatter)

            if (isEditing) {
                // Actualizar la asistencia existente
                AsistenciaServicio.actualizarAsistencia(
                    asistencias,
                    currentAsistenciaId!!,
                    titulo,
                    fecha,
                    usuarioId,
                    true,
                    estudiantes.split(",")
                )
                Toast.makeText(this, "Asistencia actualizada exitosamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentAsistenciaId = null
            } else {
                // Crear nueva asistencia
                val id = generarIdUnico()
                AsistenciaServicio.crearAsistencia(
                    asistencias,
                    id,
                    titulo,
                    fecha,
                    usuarioId,
                    true,
                    estudiantes.split(",")
                )
                Toast.makeText(this, "Asistencia guardada exitosamente", Toast.LENGTH_SHORT).show()
            }
            actualizarLista()
            limpiarFormulario()
        } catch (e: Exception) {
            Toast.makeText(this, "Error en el formato de la fecha", Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        tituloEditText.text.clear()
        fechaEditText.text.clear()
        usuarioIdEditText.text.clear()
        estudiantesEditText.text.clear()
    }

    private fun onUpdateClick(asistencia: Asistencia) {
        isEditing = true
        currentAsistenciaId = asistencia.getId()
        tituloEditText.setText(asistencia.getTituloAsistencia())
        fechaEditText.setText(asistencia.getFechaAsistencia().toString())
        usuarioIdEditText.setText(asistencia.getUsuarioId())
        estudiantesEditText.setText(asistencia.getEstudiantes().joinToString(", "))
    }

    private fun onDeleteClick(asistencia: Asistencia) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta asistencia?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                AsistenciaServicio.desactivarAsistencia(asistencias, asistencia.getId())
                actualizarLista()
                Toast.makeText(this, "Asistencia eliminada", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }

    private fun actualizarLista() {
        adapter.actualizarLista(AsistenciaServicio.listarAsistenciasActivas(asistencias))
    }
}

