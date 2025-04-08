package com.example.fusdeckotlin.ui.activities.instructor.asistencia

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.instructor.asistencia.AsistenciaAdapter
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import com.example.fusdeckotlin.services.instructor.asistencia.AsistenciaServices
import kotlinx.coroutines.launch
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

    private val asistenciaServicio = AsistenciaServices()
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

        // Configurar RecyclerView
        adapter = AsistenciaAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        asistenciasRecyclerView.layoutManager = LinearLayoutManager(this)
        asistenciasRecyclerView.adapter = adapter

        // Cargar asistencias al iniciar
        cargarAsistencias()

        // Configurar DatePicker
        fechaEditText.setOnClickListener { mostrarDatePicker() }

        // Botón confirmar
        confirmarButton.setOnClickListener { guardarAsistencia() }

        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarAsistencias() {
        lifecycleScope.launch {
            val result = asistenciaServicio.listarAsistenciasActivas()
            result.onSuccess { asistencias ->
                adapter.actualizarLista(asistencias)
            }.onFailure { error ->
                Toast.makeText(
                    this@AsistenciaActivity,
                    "Error al cargar asistencias: ${error.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun mostrarDatePicker() {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val selectedDate = LocalDate.of(year, month + 1, dayOfMonth)
                fechaEditText.setText(selectedDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun guardarAsistencia() {
        val titulo = tituloEditText.text.toString().trim()
        val fechaStr = fechaEditText.text.toString().trim()
        val usuarioId = usuarioIdEditText.text.toString().trim()
        val estudiantes = estudiantesEditText.text.toString().trim()

        if (titulo.isEmpty() || fechaStr.isEmpty() || usuarioId.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
                val estudiantesList = estudiantes.split(",").map { it.trim() }

                if (isEditing && currentAsistenciaId != null) {
                    asistenciaServicio.actualizarAsistencia(
                        currentAsistenciaId!!,
                        titulo,
                        fecha,
                        usuarioId,
                        true,
                        estudiantesList
                    ).onSuccess {
                        Toast.makeText(this@AsistenciaActivity, "Asistencia actualizada", Toast.LENGTH_SHORT).show()
                        resetEditingState()
                        cargarAsistencias()
                    }.onFailure { error ->
                        showError("Error al actualizar: ${error.message}")
                    }
                } else {
                    asistenciaServicio.crearAsistencia(
                        titulo,
                        fecha,
                        usuarioId,
                        estudiantesList
                    ).onSuccess {
                        Toast.makeText(this@AsistenciaActivity, "Asistencia creada", Toast.LENGTH_SHORT).show()
                        resetEditingState()
                        cargarAsistencias()
                    }.onFailure { error ->
                        showError("Error al crear: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }


    private fun resetEditingState() {
        isEditing = false
        currentAsistenciaId = null
        limpiarFormulario()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
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
        fechaEditText.setText(asistencia.getFechaAsistencia()
            .format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
        usuarioIdEditText.setText(asistencia.getUsuarioId())

        // Usar getEstudiantesIds() para obtener los ID
        val estudiantesIds = asistencia.getEstudiantesIds()
        estudiantesEditText.setText(estudiantesIds.joinToString(", "))
    }

    private fun onDeleteClick(asistencia: Asistencia) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta asistencia?")

        builder.setPositiveButton("Sí") { _, _ ->
            lifecycleScope.launch {
                val result = asistenciaServicio.desactivarAsistencia(asistencia.getId())
                result.onSuccess {
                    Toast.makeText(
                        this@AsistenciaActivity,
                        "Asistencia eliminada",
                        Toast.LENGTH_SHORT
                    ).show()
                    cargarAsistencias()
                }.onFailure { error ->
                    Toast.makeText(
                        this@AsistenciaActivity,
                        error.message ?: "Error al eliminar",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }
}

