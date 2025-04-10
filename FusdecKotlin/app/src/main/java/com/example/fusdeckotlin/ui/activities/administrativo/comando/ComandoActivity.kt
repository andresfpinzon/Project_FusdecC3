package com.example.fusdeckotlin.ui.activities.administrativo.comando

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.comando.CreateComandoDto
import com.example.fusdeckotlin.dto.administrativo.comando.UpdateComandoDto
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.services.administrativo.comando.ComandoServices
import com.example.fusdeckotlin.ui.adapters.administrador.comandoAdapter.ComandoAdapter
import kotlinx.coroutines.launch

class ComandoActivity : AppCompatActivity() {

    private lateinit var nombreComandoEditText: EditText
    private lateinit var ubicacionComandoEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var comandosRecyclerView: RecyclerView
    private lateinit var searchViewComando: SearchView
    private lateinit var brigadaSpinner: Spinner

    private val comandoServices = ComandoServices()
    private lateinit var adapter: ComandoAdapter

    private var isEditing: Boolean = false
    private var currentComandoId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comando)

        initViews()
        setupRecyclerView()
        setupListeners()
        setupSpinner()
        cargarComandos()
    }

    private fun initViews() {
        nombreComandoEditText = findViewById(R.id.nombreComandoEditText)
        ubicacionComandoEditText = findViewById(R.id.ubicacionComandoEditText)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        estadoSwitch = findViewById(R.id.estadoComandoSwitch)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        comandosRecyclerView = findViewById(R.id.comandosRecyclerView)
        searchViewComando = findViewById(R.id.searchViewComando)
        brigadaSpinner = findViewById(R.id.brigadaSpinner)
    }

    private fun setupRecyclerView() {
        adapter = ComandoAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        comandosRecyclerView.layoutManager = LinearLayoutManager(this)
        comandosRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        confirmarButton.setOnClickListener { guardarComando() }
        cancelarButton.setOnClickListener { finish() }

        searchViewComando.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean = false

            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter(newText)
                return false
            }
        })
    }

    private fun setupSpinner() {
        val brigadas = listOf("BRIG01", "BRIG02", "BRIG03", "BRIG04")
        val spinnerAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, brigadas)
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        brigadaSpinner.adapter = spinnerAdapter
    }

    private fun cargarComandos() {
        lifecycleScope.launch {
            val result = comandoServices.getComandoActives()
            result.onSuccess { comandos ->
                adapter.actualizarLista(comandos)
            }.onFailure { error ->
                showError("Error al cargar comandos: ${error.message}")
            }
        }
    }

    private fun guardarComando() {
        val nombreComando = nombreComandoEditText.text.toString().trim()
        val ubicacionComando = ubicacionComandoEditText.text.toString().trim()
        val fundacionId = usuarioIdEditText.text.toString().trim()
        val estadoComando = estadoSwitch.isChecked
        val brigadaSeleccionada = brigadaSpinner.selectedItem.toString()

        if (nombreComando.isEmpty() || ubicacionComando.isEmpty() || fundacionId.isEmpty()) {
            showError("Por favor, complete todos los campos obligatorios")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentComandoId != null) {
                    actualizarComando(nombreComando, ubicacionComando, fundacionId, estadoComando, brigadaSeleccionada)
                } else {
                    crearComando(nombreComando, ubicacionComando, fundacionId, brigadaSeleccionada)
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }

    private suspend fun actualizarComando(
        nombre: String,
        ubicacion: String,
        fundacionId: String,
        estado: Boolean,
        brigada: String
    ) {
        val updateData = UpdateComandoDto(
            nombreComando = nombre,
            ubicacionComando = ubicacion,
            fundacionId = fundacionId,
            estadoComando = estado,
            brigadas = listOf(brigada)
        )

        comandoServices.updateComando(currentComandoId!!, updateData)
            .onSuccess {
                showSuccess("Comando actualizado con éxito")
                resetEditingState()
                cargarComandos()
            }.onFailure { error ->
                showError("Error al actualizar: ${error.message}")
            }
    }

    private suspend fun crearComando(
        nombre: String,
        ubicacion: String,
        fundacionId: String,
        brigada: String
    ) {
        val createData = CreateComandoDto(
            nombreComando = nombre,
            ubicacionComando = ubicacion,
            fundacionId = fundacionId,
            brigadas = listOf(brigada)
        )
                    // El estado no se incluye en CreateComandoDto según tu definición

                    comandoServices.createComando(createData)
                .onSuccess {
                    showSuccess("Comando creado con éxito")
                    resetEditingState()
                    cargarComandos()
                }.onFailure { error ->
                    showError("Error al crear: ${error.message}")
                }
    }

    private fun resetEditingState() {
        isEditing = false
        currentComandoId = null
        limpiarFormulario()
    }

    private fun limpiarFormulario() {
        nombreComandoEditText.text.clear()
        ubicacionComandoEditText.text.clear()
        usuarioIdEditText.text.clear()
        estadoSwitch.isChecked = false
        brigadaSpinner.setSelection(0)
    }

    private fun onUpdateClick(comando: Comando) {
        isEditing = true
        currentComandoId = comando.getId()
        nombreComandoEditText.setText(comando.getNombreComando())
        ubicacionComandoEditText.setText(comando.getUbicacionComando())
        usuarioIdEditText.setText(comando.getFundacionId())
        estadoSwitch.isChecked = comando.getEstadoComando()

        // Obtener la primera brigada del comando (si existe)
        val primeraBrigada = comando.getBrigadas().firstOrNull() ?: ""

        // Buscar la posición en el spinner
        val spinnerAdapter = brigadaSpinner.adapter as? ArrayAdapter<Any>
        val brigadaIndex = spinnerAdapter?.getPosition(primeraBrigada) ?: 0

        // Establecer la selección
        brigadaSpinner.setSelection(brigadaIndex)
    }

    private fun onDeleteClick(comando: Comando) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar comando")
            .setMessage("¿Estás seguro de que deseas eliminar este comando?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    comandoServices.deleteComandoById(comando.getId()!!)
                        .onSuccess {
                            showSuccess("Comando eliminado")
                            cargarComandos()
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