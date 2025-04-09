package com.example.fusdeckotlin.ui.activities.administrativo.brigada

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import android.widget.SearchView
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.brigada.CreateBrigadaDto
import com.example.fusdeckotlin.dto.administrativo.brigada.UpdateBrigadaDto
import com.example.fusdeckotlin.ui.adapters.administrador.brigadaAdapter.BrigadaAdapter
import com.example.fusdeckotlin.services.administrativo.brigada.BrigadaServices
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import kotlinx.coroutines.launch

class BrigadaActivity : AppCompatActivity() {

    private lateinit var nombreBrigadaEditText: EditText
    private lateinit var ubicacionBrigadaEditText: EditText
    private lateinit var comandoIdEditText: EditText
    private lateinit var unidadesEditText: EditText
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var brigadasRecyclerView: RecyclerView
    private lateinit var searchView: SearchView

    private val brigadaServices = BrigadaServices()
    private lateinit var adapter: BrigadaAdapter

    private var isEditing: Boolean = false
    private var currentBrigadaId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_brigada)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarBrigadas()
    }

    private fun initViews() {
        nombreBrigadaEditText = findViewById(R.id.nombreBrigadaEditText)
        ubicacionBrigadaEditText = findViewById(R.id.ubicacionBrigadaEditText)
        comandoIdEditText = findViewById(R.id.comandoIdEditText)
        unidadesEditText = findViewById(R.id.unidadesEditText)
        estadoSwitch = findViewById(R.id.estadoSwitch)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        brigadasRecyclerView = findViewById(R.id.brigadasRecyclerView)
        searchView = findViewById(R.id.searchView)
    }

    private fun setupRecyclerView() {
        adapter = BrigadaAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        brigadasRecyclerView.layoutManager = LinearLayoutManager(this)
        brigadasRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        confirmarButton.setOnClickListener { guardarBrigada() }
        cancelarButton.setOnClickListener { finish() }

        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean = false

            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter(newText)
                return false
            }
        })
    }

    private fun cargarBrigadas() {
        lifecycleScope.launch {
            val result = brigadaServices.getBrigadasActives()
            result.onSuccess { brigadas ->
                adapter.actualizarLista(brigadas)
            }.onFailure { error ->
                showError("Error al cargar brigadas: ${error.message}")
            }
        }
    }

    private fun guardarBrigada() {
        val nombreBrigada = nombreBrigadaEditText.text.toString().trim()
        val ubicacionBrigada = ubicacionBrigadaEditText.text.toString().trim()
        val estadoBrigada = estadoSwitch.isChecked
        val comandoId = comandoIdEditText.text.toString().trim()
        val unidades = unidadesEditText.text.toString().trim().split(",").map { it.trim() }

        if (nombreBrigada.isEmpty() || ubicacionBrigada.isEmpty() || comandoId.isEmpty() || unidades.isEmpty()) {
            showError("Por favor, complete todos los campos")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentBrigadaId != null) {
                    actualizarBrigada(nombreBrigada, ubicacionBrigada, estadoBrigada, comandoId, unidades)
                } else {
                    crearBrigada(nombreBrigada, ubicacionBrigada, estadoBrigada, comandoId, unidades)
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }

    private suspend fun actualizarBrigada(
        nombre: String,
        ubicacion: String,
        estado: Boolean,
        comandoId: String,
        unidades: List<String>
    ) {
        val updateData = UpdateBrigadaDto(
            nombreBrigada = nombre,
            ubicacionBrigada = ubicacion,
            estadoBrigada = estado,
            comandoId = comandoId,
            unidades = unidades
        )

        brigadaServices.updateBrigada(currentBrigadaId!!, updateData)
            .onSuccess {
                showSuccess("Brigada actualizada con éxito")
                resetEditingState()
                cargarBrigadas()
            }.onFailure { error ->
                showError("Error al actualizar: ${error.message}")
            }
    }

    private suspend fun crearBrigada(
        nombre: String,
        ubicacion: String,
        estado: Boolean,
        comandoId: String,
        unidades: List<String>
    ) {
        val createData = CreateBrigadaDto(
            nombreBrigada = nombre,
            ubicacionBrigada = ubicacion,
            estadoBrigada = estado,
            comandoId = comandoId,
            unidades = unidades
        )

        brigadaServices.createBrigada(createData)
            .onSuccess {
                showSuccess("Brigada creada con éxito")
                resetEditingState()
                cargarBrigadas()
            }.onFailure { error ->
                showError("Error al crear: ${error.message}")
            }
    }

    private fun resetEditingState() {
        isEditing = false
        currentBrigadaId = null
        limpiarFormulario()
    }

    private fun limpiarFormulario() {
        nombreBrigadaEditText.text.clear()
        ubicacionBrigadaEditText.text.clear()
        comandoIdEditText.text.clear()
        unidadesEditText.text.clear()
        estadoSwitch.isChecked = false
    }

    private fun onUpdateClick(brigada: Brigada) {
        isEditing = true
        currentBrigadaId = brigada.getId()
        nombreBrigadaEditText.setText(brigada.getNombreBrigada())
        ubicacionBrigadaEditText.setText(brigada.getUbicacionBrigada())
        comandoIdEditText.setText(brigada.getComandoId())
        unidadesEditText.setText(brigada.getUnidadesIds().joinToString(", "))
        estadoSwitch.isChecked = brigada.getEstadoBrigada()
    }

    private fun onDeleteClick(brigada: Brigada) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar brigada")
            .setMessage("¿Estás seguro de que deseas eliminar esta brigada?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    brigadaServices.deleteBrigadaById(brigada.getId()!!)
                        .onSuccess {
                            showSuccess("Brigada eliminada")
                            cargarBrigadas()
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