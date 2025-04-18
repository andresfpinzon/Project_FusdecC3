package com.example.fusdeckotlin.ui.activities.administrativo.brigada

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.brigada.CrearBrigadaRequest
import com.example.fusdeckotlin.dto.administrativo.brigada.ActualizarBrigadaRequest
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.services.administrativo.brigada.BrigadaServices
import com.example.fusdeckotlin.ui.adapters.administrativo.brigada.BrigadaAdapter
import kotlinx.coroutines.launch

class BrigadaActivity : AppCompatActivity() {

//    private lateinit var nombreBrigadaEditText: EditText
//    private lateinit var ubicacionBrigadaEditText: EditText
//    private lateinit var comandoIdEditText: EditText
//    private lateinit var unidadesEditText: EditText
//    private lateinit var confirmarButton: Button
//    private lateinit var cancelarButton: Button
//    private lateinit var brigadasRecyclerView: RecyclerView
//    private lateinit var searchView: SearchView
//
//    private val brigadaServices = BrigadaServices()
//    private lateinit var adapter: BrigadaAdapter
//
//    private var isEditing: Boolean = false
//    private var currentBrigadaId: String? = null
//    private var brigadasOriginales: List<Brigada> = emptyList()
//
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        setContentView(R.layout.activity_brigada)
//
//        initViews()
//        setupRecyclerView()
//        setupListeners()
//        setupSearchView()
//        cargarBrigadas()
//    }
//
//    private fun initViews() {
//        nombreBrigadaEditText = findViewById(R.id.nombreBrigadaEditText)
//        ubicacionBrigadaEditText = findViewById(R.id.ubicacionBrigadaEditText)
//        comandoIdEditText = findViewById(R.id.comandoIdEditText)
//        unidadesEditText = findViewById(R.id.unidadesEditText)
//        confirmarButton = findViewById(R.id.confirmarButton)
//        cancelarButton = findViewById(R.id.cancelarButton)
//        brigadasRecyclerView = findViewById(R.id.brigadasRecyclerView)
//        searchView = findViewById(R.id.searchView)
//    }
//
//    private fun setupRecyclerView() {
//        adapter = BrigadaAdapter(
//            emptyList(),
//            ::onUpdateClick,
//            ::onDeleteClick
//        )
//        brigadasRecyclerView.layoutManager = LinearLayoutManager(this)
//        brigadasRecyclerView.adapter = adapter
//    }
//
//    private fun setupListeners() {
//        confirmarButton.setOnClickListener { guardarBrigada() }
//        cancelarButton.setOnClickListener { finish() }
//    }
//
//    private fun setupSearchView() {
//        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
//            override fun onQueryTextSubmit(query: String?): Boolean = false
//
//            override fun onQueryTextChange(newText: String?): Boolean {
//                filtrarBrigadas(newText.orEmpty())
//                return true
//            }
//        })
//    }
//
//    private fun filtrarBrigadas(textoBusqueda: String) {
//        val texto = textoBusqueda.lowercase().trim()
//        adapter.actualizarLista(
//            if (texto.isEmpty()) brigadasOriginales
//            else brigadasOriginales.filter {
//                it.getNombreBrigada().lowercase().contains(texto) ||
//                        it.getUbicacionBrigada().lowercase().contains(texto) ||
//                        it.getComandoId().lowercase().contains(texto)
//            }
//        )
//    }
//
//    private fun cargarBrigadas() {
//        lifecycleScope.launch {
//            try {
//                val result = brigadaServices.listarBrigadasActivas()
//                result.onSuccess { brigadas ->
//                    brigadasOriginales = brigadas
//                    runOnUiThread {
//                        adapter.actualizarLista(brigadas)
//                        if (brigadas.isEmpty()) {
//                            showInfo("No hay brigadas registradas")
//                        }
//                    }
//                }.onFailure { error ->
//                    runOnUiThread {
//                        showError("Error al cargar brigadas: ${error.message}")
//                    }
//                }
//            } catch (e: Exception) {
//                runOnUiThread {
//                    showError("Error inesperado: ${e.message}")
//                }
//            }
//        }
//    }
//
//    private fun guardarBrigada() {
//        val nombre = nombreBrigadaEditText.text.toString().trim()
//        val ubicacion = ubicacionBrigadaEditText.text.toString().trim()
//        val comandoId = comandoIdEditText.text.toString().trim()
//        val unidades = unidadesEditText.text.toString().trim().split(",").map { it.trim() }
//
////        if (nombre.isEmpty() || ubicacion.isEmpty() || comandoId.isEmpty() || unidades.isEmpty()) {
////            showError("Por favor, complete todos los campos")
////            return
////        }
//
//        lifecycleScope.launch {
//            try {
//                if (isEditing && currentBrigadaId != null) {
//                    actualizarBrigada(nombre, ubicacion, comandoId, unidades)
//                } else {
//                    crearBrigada(nombre, ubicacion, comandoId, unidades)
//                }
//            } catch (e: Exception) {
//                showError("Error: ${e.message}")
//            }
//        }
//    }
//
//    private suspend fun actualizarBrigada(
//        nombre: String,
//        ubicacion: String,
//        comandoId: String,
//        unidades: List<String>
//    ) {
//        val updateData = ActualizarBrigadaRequest(
//            nombreBrigada = nombre,
//            ubicacionBrigada = ubicacion,
//            estadoBrigada = true,
//            comandoId = comandoId,
//            unidades = unidades
//        )
//
//        brigadaServices.actualizarBrigada(currentBrigadaId!!, updateData)
//            .onSuccess {
//                runOnUiThread {
//                    showSuccess("Brigada actualizada con éxito")
//                    resetEditingState()
//                    cargarBrigadas()
//                    searchView.setQuery("", false)
//                }
//            }.onFailure { error ->
//                runOnUiThread {
//                    showError("Error al actualizar: ${error.message}")
//                }
//            }
//    }
//
//    private suspend fun crearBrigada(
//        nombre: String,
//        ubicacion: String,
//        comandoId: String,
//        unidades: List<String>
//    ) {
//        val createData = CrearBrigadaRequest(
//            nombreBrigada = nombre,
//            ubicacionBrigada = ubicacion,
//            comandoId = comandoId,
//            unidades = unidades
//        )
//
//        brigadaServices.createBrigada(createData)
//            .onSuccess {
//                runOnUiThread {
//                    showSuccess("Brigada creada con éxito")
//                    resetEditingState()
//                    cargarBrigadas()
//                    searchView.setQuery("", false)
//                }
//            }.onFailure { error ->
//                runOnUiThread {
//                    showError("Error al crear: ${error.message}")
//                }
//            }
//    }
//
//    private fun resetEditingState() {
//        isEditing = false
//        currentBrigadaId = null
//        limpiarFormulario()
//    }
//
//    private fun limpiarFormulario() {
//        nombreBrigadaEditText.text.clear()
//        ubicacionBrigadaEditText.text.clear()
//        comandoIdEditText.text.clear()
//        unidadesEditText.text.clear()
//    }
//
//    private fun onUpdateClick(brigada: Brigada) {
//        isEditing = true
//        currentBrigadaId = brigada.getId()
//        nombreBrigadaEditText.setText(brigada.getNombreBrigada())
//        ubicacionBrigadaEditText.setText(brigada.getUbicacionBrigada())
//        comandoIdEditText.setText(brigada.getComandoId())
//        unidadesEditText.setText(brigada.getUnidadesIds().joinToString(", "))
//    }
//
//    private fun onDeleteClick(brigada: Brigada) {
//        AlertDialog.Builder(this)
//            .setTitle("Eliminar brigada")
//            .setMessage("¿Estás seguro de que deseas eliminar esta brigada?")
//            .setPositiveButton("Sí") { _, _ ->
//                lifecycleScope.launch {
//                    brigadaServices.deleteBrigadaById(brigada.getId()!!)
//                        .onSuccess {
//                            runOnUiThread {
//                                showSuccess("Brigada eliminada")
//                                cargarBrigadas()
//                                searchView.setQuery("", false)
//                            }
//                        }
//                        .onFailure { error ->
//                            runOnUiThread {
//                                showError(error.message ?: "Error al eliminar")
//                            }
//                        }
//                }
//            }
//            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
//            .show()
//    }
//
//    private fun showError(message: String) {
//        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
//    }
//
//    private fun showSuccess(message: String) {
//        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
//    }
//
//    private fun showInfo(message: String) {
//        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
//    }
}