package com.example.fusdeckotlin.ui.activities.secretario.edicion

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
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import com.example.fusdeckotlin.services.secretario.edicion.EdicionServices
import com.example.fusdeckotlin.ui.adapters.secretario.edicion.EdicionAdapter
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

class EdicionActivity : AppCompatActivity() {

    private lateinit var tituloEditText: EditText
    private lateinit var fechaInicioEditText: EditText
    private lateinit var fechaFinEditText: EditText
    private lateinit var cursoIdEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var edicionesRecyclerView: RecyclerView

    private val edicionServicio = EdicionServices()
    private lateinit var adapter: EdicionAdapter

    private var isEditing: Boolean = false
    private var currentEdicionId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edicion)

        // Inicializar vistas
        tituloEditText = findViewById(R.id.tituloEdicion)
        fechaInicioEditText = findViewById(R.id.fechaInicioEdicion)
        fechaFinEditText = findViewById(R.id.fechaFinEdicion)
        cursoIdEditText = findViewById(R.id.cursoId)
        confirmarButton = findViewById(R.id.confirmarEdicionButton)
        cancelarButton = findViewById(R.id.cancelarEdicionButton)
        edicionesRecyclerView = findViewById(R.id.edicionesRecyclerView)

        // Configurar RecyclerView
        adapter = EdicionAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        edicionesRecyclerView.layoutManager = LinearLayoutManager(this)
        edicionesRecyclerView.adapter = adapter

        // Cargar ediciones al iniciar
        cargarEdiciones()

        // Configurar DatePickers
        fechaInicioEditText.setOnClickListener { mostrarDatePicker(fechaInicioEditText) }
        fechaFinEditText.setOnClickListener { mostrarDatePicker(fechaFinEditText) }

        // Botón confirmar
        confirmarButton.setOnClickListener { guardarEdicion() }

        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarEdiciones() {
        lifecycleScope.launch {
            val result = edicionServicio.listarEdicionesActivas()
            result.onSuccess { ediciones ->
                adapter.actualizarLista(ediciones)
            }.onFailure { error ->
                Toast.makeText(
                    this@EdicionActivity,
                    "Error al cargar ediciones: ${error.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun mostrarDatePicker(editText: EditText) {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val selectedDate = LocalDate.of(year, month + 1, dayOfMonth)
                editText.setText(selectedDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun guardarEdicion() {
        val titulo = tituloEditText.text.toString().trim()
        val fechaInicioStr = fechaInicioEditText.text.toString().trim()
        val fechaFinStr = fechaFinEditText.text.toString().trim()
        val cursoId = cursoIdEditText.text.toString().trim()

        if (titulo.isEmpty() || fechaInicioStr.isEmpty() || fechaFinStr.isEmpty() || cursoId.isEmpty() ) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val fechaInicio = LocalDate.parse(fechaInicioStr, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
                val fechaFin = LocalDate.parse(fechaFinStr, DateTimeFormatter.ofPattern("yyyy/MM/dd"))

                if (isEditing && currentEdicionId != null) {
                    edicionServicio.actualizarEdicion(
                        currentEdicionId!!,
                        titulo,
                        fechaInicio,
                        fechaFin,
                        cursoId,
                        true
                    ).onSuccess {
                        Toast.makeText(this@EdicionActivity, "Edición actualizada", Toast.LENGTH_SHORT).show()
                        resetEditingState()
                        cargarEdiciones()
                    }.onFailure { error ->
                        Toast.makeText(
                            this@EdicionActivity,
                            "Error al actualizar: ${error.message}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                } else {
                    edicionServicio.crearEdicion(
                        titulo,
                        fechaInicio,
                        fechaFin,
                        cursoId,
                    ).onSuccess {
                        Toast.makeText(this@EdicionActivity, "Edición creada", Toast.LENGTH_SHORT).show()
                        resetEditingState()
                        cargarEdiciones()
                    }.onFailure { error ->
                        Toast.makeText(
                            this@EdicionActivity,
                            "Error al crear: ${error.message}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            } catch (e: Exception) {
                Toast.makeText(
                    this@EdicionActivity,
                    "Error en fechas: ${e.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun resetEditingState() {
        isEditing = false
        currentEdicionId = null
        limpiarFormulario()
    }

    private fun limpiarFormulario() {
        tituloEditText.text.clear()
        fechaInicioEditText.text.clear()
        fechaFinEditText.text.clear()
        cursoIdEditText.text.clear()
    }

    private fun onUpdateClick(edicion: Edicion) {
        isEditing = true
        currentEdicionId = edicion.getId()
        tituloEditText.setText(edicion.getNombreEdicion())
        fechaInicioEditText.setText(edicion.getFechaInicio().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
        fechaFinEditText.setText(edicion.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
        cursoIdEditText.setText(edicion.getCursoId())
    }

    private fun onDeleteClick(edicion: Edicion) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar desactivación")
        builder.setMessage("¿Estás seguro de que deseas desactivar esta edición?")

        builder.setPositiveButton("Sí") { _, _ ->
            lifecycleScope.launch {
                val result = edicionServicio.desactivarEdicion(edicion.getId())
                result.onSuccess {
                    Toast.makeText(
                        this@EdicionActivity,
                        "Edición desactivada",
                        Toast.LENGTH_SHORT
                    ).show()
                    cargarEdiciones()
                }.onFailure { error ->
                    Toast.makeText(
                        this@EdicionActivity,
                        error.message ?: "Error al desactivar",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }
}