package com.example.fusdeckotlin.ui.activities.administrativo.unidad

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView // Importación CORRECTA
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.unidad.CreateUnidadDto
import com.example.fusdeckotlin.dto.administrativo.unidad.UpdateUnidadDto
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import com.example.fusdeckotlin.services.administrativo.unidad.UnidadServices
import com.example.fusdeckotlin.ui.adapters.administrativo.unidad.UnidadAdapter
import kotlinx.coroutines.launch

class UnidadActivity : AppCompatActivity() {

    private lateinit var nombreUnidadEditText: EditText
    private lateinit var brigadaUnidadEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var comandosEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var unidadesRecyclerView: RecyclerView
    private lateinit var searchViewUnidad: SearchView

    private val unidadServices = UnidadServices()
    private lateinit var adapter: UnidadAdapter

    private var isEditing: Boolean = false
    private var currentUnidadId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_unidad)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarUnidades()
    }

    private fun initViews() {
        nombreUnidadEditText = findViewById(R.id.nombreUnidadEditText)
        brigadaUnidadEditText = findViewById(R.id.brigadaUnidadEditText)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        comandosEditText = findViewById(R.id.comandosEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        estadoSwitch = findViewById(R.id.estadoUnidadSwitch)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        unidadesRecyclerView = findViewById(R.id.unidadesRecyclerView)
        searchViewUnidad = findViewById(R.id.searchViewUnidad)
    }

    private fun setupRecyclerView() {
        adapter = UnidadAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        unidadesRecyclerView.layoutManager = LinearLayoutManager(this)
        unidadesRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        confirmarButton.setOnClickListener { guardarUnidad() }
        cancelarButton.setOnClickListener { finish() }

        searchViewUnidad.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean = false
            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter(newText)
                return false
            }
        })
    }

    private fun cargarUnidades() {
        lifecycleScope.launch {
            val result = unidadServices.listarUnidadesActivas()
            result.onSuccess { unidades ->
                adapter.actualizarLista(unidades)
            }.onFailure { error ->
                showError("Error al cargar unidades: ${error.message}")
            }
        }
    }

    private fun guardarUnidad() {
        val nombreUnidad = nombreUnidadEditText.text.toString().trim()
        val brigadaId = brigadaUnidadEditText.text.toString().trim()
        val usuarioId = usuarioIdEditText.text.toString().trim()
        val comandos = comandosEditText.text.toString().trim().split(",").map { it.trim() }
        val estudiantes = estudiantesEditText.text.toString().trim().split(",").map { it.trim() }
        val estadoUnidad = estadoSwitch.isChecked

//        if (nombreUnidad.isEmpty() || brigadaId.isEmpty() || usuarioId.isEmpty() || comandos.isEmpty() || estudiantes.isEmpty()) {
//            showError("Por favor, complete todos los campos")
//            return
//        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentUnidadId != null) {
                    actualizarUnidad(nombreUnidad, brigadaId, usuarioId, comandos, estudiantes, estadoUnidad)
                } else {
                    crearUnidad(nombreUnidad, brigadaId, usuarioId, comandos, estudiantes, estadoUnidad)
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }

    private suspend fun actualizarUnidad(
        nombre: String,
        brigadaId: String,
        usuarioId: String,
        comandos: List<String>,
        estudiantes: List<String>,
        estado: Boolean
    ) {
        val updateData = UpdateUnidadDto(
            nombreUnidad = nombre,
            brigadaId = brigadaId,
            usuarioId = usuarioId,
            comandos = comandos,
            estudiantes = estudiantes,
            estadoUnidad = estado
        )

        unidadServices.updateUnidadServices(currentUnidadId!!, updateData)
            .onSuccess {
                showSuccess("Unidad actualizada con éxito")
                resetEditingState()
                cargarUnidades()
            }.onFailure { error ->
                showError("Error al actualizar: ${error.message}")
            }
    }

    private suspend fun crearUnidad(
        nombre: String,
        brigadaId: String,
        usuarioId: String,
        comandos: List<String>,
        estudiantes: List<String>,
        estado: Boolean
    ) {
        val createData = CreateUnidadDto(
            nombreUnidad = nombre,
            brigadaId = brigadaId,
            usuarioId = usuarioId,
            comandos = comandos,
            estudiantes = estudiantes,
        )

        unidadServices.createUnidadServices(createData)
            .onSuccess {
                showSuccess("Unidad creada con éxito")
                resetEditingState()
                cargarUnidades()
            }.onFailure { error ->
                showError("Error al crear: ${error.message}")
            }
    }

    private fun resetEditingState() {
        isEditing = false
        currentUnidadId = null
        limpiarFormulario()
    }

    private fun limpiarFormulario() {
        nombreUnidadEditText.text.clear()
        brigadaUnidadEditText.text.clear()
        usuarioIdEditText.text.clear()
        comandosEditText.text.clear()
        estudiantesEditText.text.clear()
        estadoSwitch.isChecked = false
    }

    private fun onUpdateClick(unidad: Unidad) {
        isEditing = true
        currentUnidadId = unidad.getId()
        nombreUnidadEditText.setText(unidad.getNombreUnidad())
        brigadaUnidadEditText.setText(unidad.getBrigadaId())
        usuarioIdEditText.setText(unidad.getUsuarioId())
        comandosEditText.setText(unidad.getComandos().joinToString(", "))
        estadoSwitch.isChecked = unidad.getEstadoUnidad()
    }

    private fun onDeleteClick(unidad: Unidad) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar unidad")
            .setMessage("¿Estás seguro de que deseas eliminar esta unidad?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    unidadServices.deleteUnidadById(unidad.getId()!!)
                        .onSuccess {
                            showSuccess("Unidad eliminada")
                            cargarUnidades()
                        }
                        .onFailure { error ->
                            showError(error.message ?: "Error al eliminar")
                        }
                }
            }
            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
            .show()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}