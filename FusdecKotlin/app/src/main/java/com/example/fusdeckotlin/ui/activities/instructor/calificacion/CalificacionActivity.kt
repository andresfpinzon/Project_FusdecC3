package com.example.fusdeckotlin.ui.activities.instructor.calificacion

import android.app.AlertDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.instructor.calificacion.Calificacion
import com.example.fusdeckotlin.services.instructor.calificacion.CalificacionServices
import com.example.fusdeckotlin.ui.adapters.instructor.calificacion.CalificacionAdapter
import kotlinx.coroutines.launch

class CalificacionActivity : AppCompatActivity() {

    private lateinit var tituloEditText: EditText
    private lateinit var aprobadoSwitch: Switch
    private lateinit var usuarioIdEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var calificacionesRecyclerView: RecyclerView

    private val calificacionServicio = CalificacionServices()
    private lateinit var adapter: CalificacionAdapter

    private var isEditing: Boolean = false
    private var currentCalificacionId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_calificacion)

        // Inicializar vistas
        tituloEditText = findViewById(R.id.tituloEditText)
        aprobadoSwitch = findViewById(R.id.aprobadoSwitch)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        calificacionesRecyclerView = findViewById(R.id.calificacionesRecyclerView)

        // Configurar RecyclerView
        adapter = CalificacionAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        calificacionesRecyclerView.layoutManager = LinearLayoutManager(this)
        calificacionesRecyclerView.adapter = adapter

        // Cargar calificaciones al iniciar
        cargarCalificaciones()

        // Configurar Switch
        aprobadoSwitch.setOnCheckedChangeListener { _, isChecked ->
            aprobadoSwitch.text = if (isChecked) "Aprobado" else "Reprobado"
        }

        // Botón confirmar
        confirmarButton.setOnClickListener { guardarCalificacion() }

        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarCalificaciones() {
        lifecycleScope.launch {
            val result = calificacionServicio.listarCalificacionesActivas()
            result.onSuccess { calificaciones ->
                adapter.actualizarLista(calificaciones)
            }.onFailure { error ->
                Toast.makeText(
                    this@CalificacionActivity,
                    "Error al cargar calificaciones: ${error.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun guardarCalificacion() {
        val titulo = tituloEditText.text.toString().trim()
        val aprobado = aprobadoSwitch.isChecked
        val usuarioId = usuarioIdEditText.text.toString().trim()
        val estudiantes = estudiantesEditText.text.toString().trim()

        if (titulo.isEmpty() || usuarioId.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val estudiantesList = estudiantes.split(",").map { it.trim() }

                if (isEditing && currentCalificacionId != null) {
                    calificacionServicio.actualizarCalificacion(
                        currentCalificacionId!!,
                        titulo,
                        aprobado,
                        usuarioId,
                        true,
                        estudiantesList
                    ).onSuccess {
                        Toast.makeText(this@CalificacionActivity, "Calificación actualizada", Toast.LENGTH_SHORT).show()
                        resetEditingState()
                        cargarCalificaciones()
                    }.onFailure { error ->
                        showError("Error al actualizar: ${error.message}")
                    }
                } else {
                    calificacionServicio.crearCalificacion(
                        titulo,
                        aprobado,
                        usuarioId,
                        estudiantesList
                    ).onSuccess {
                        Toast.makeText(this@CalificacionActivity, "Calificación creada", Toast.LENGTH_SHORT).show()
                        resetEditingState()
                        cargarCalificaciones()
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
        currentCalificacionId = null
        limpiarFormulario()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun limpiarFormulario() {
        tituloEditText.text.clear()
        aprobadoSwitch.isChecked = false
        usuarioIdEditText.text.clear()
        estudiantesEditText.text.clear()
    }

    private fun onUpdateClick(calificacion: Calificacion) {
        isEditing = true
        currentCalificacionId = calificacion.getId()
        tituloEditText.setText(calificacion.getTituloCalificacion())
        aprobadoSwitch.isChecked = calificacion.getAprobado()
        usuarioIdEditText.setText(calificacion.getUsuarioId())

        // Usar getEstudiantesIds() para obtener los ID
        val estudiantesIds = calificacion.getEstudiantesIds()
        estudiantesEditText.setText(estudiantesIds.joinToString(", "))
    }

    private fun onDeleteClick(calificacion: Calificacion) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta calificación?")

        builder.setPositiveButton("Sí") { _, _ ->
            lifecycleScope.launch {
                val result = calificacionServicio.desactivarCalificacion(calificacion.getId())
                result.onSuccess {
                    Toast.makeText(
                        this@CalificacionActivity,
                        "Calificación eliminada",
                        Toast.LENGTH_SHORT
                    ).show()
                    cargarCalificaciones()
                }.onFailure { error ->
                    Toast.makeText(
                        this@CalificacionActivity,
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