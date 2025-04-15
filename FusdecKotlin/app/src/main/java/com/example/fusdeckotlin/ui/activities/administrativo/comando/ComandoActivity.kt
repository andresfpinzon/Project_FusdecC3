package com.example.fusdeckotlin.ui.activities.administrativo.comando

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView // Importación CORRECTA
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

    // Views
    private lateinit var nombreComandoEditText: EditText
    private lateinit var ubicacionComandoEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var comandosRecyclerView: RecyclerView
    private lateinit var searchView: SearchView
    private lateinit var brigadaSpinner: Spinner

    // Services & Adapter
    private val comandoServices = ComandoServices()
    private lateinit var adapter: ComandoAdapter

    // State
    private var isEditing = false
    private var currentComandoId: String? = null
    private var comandosOriginales: List<Comando> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comando)

        initViews()
        setupRecyclerView()
        setupListeners()
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
        searchView = findViewById(R.id.searchViewComando)
        brigadaSpinner = findViewById(R.id.brigadaSpinner)

        // Configuración básica del spinner con datos estáticos
        val brigadas = listOf("BRIG01", "BRIG02", "BRIG03") // Datos de ejemplo
        val spinnerAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, brigadas)
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        brigadaSpinner.adapter = spinnerAdapter
    }

    private fun setupRecyclerView() {
        adapter = ComandoAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        comandosRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@ComandoActivity)
            adapter = this@ComandoActivity.adapter
        }
    }

    private fun setupListeners() {
        confirmarButton.setOnClickListener { guardarComando() }
        cancelarButton.setOnClickListener { finish() }

        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?) = false
            override fun onQueryTextChange(newText: String?) = true.also {
                filtrarComandos(newText.orEmpty())
            }
        })
    }

    private fun cargarComandos() {
        lifecycleScope.launch {
            try {
                val result = comandoServices.getComandoActives()
                result.onSuccess { comandos ->
                    comandosOriginales = comandos
                    runOnUiThread {
                        adapter.actualizarLista(comandos)
                        if (comandos.isEmpty()) {
                            showInfo("No hay comandos registrados")
                        }
                    }
                }.onFailure { error ->
                    runOnUiThread {
                        showError("Error al cargar comandos: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Error inesperado: ${e.message}")
                }
            }
        }
    }

    private fun filtrarComandos(query: String) {
        val texto = query.lowercase().trim()
        adapter.actualizarLista(
            if (texto.isEmpty()) comandosOriginales
            else comandosOriginales.filter {
                it.getNombreComando().lowercase().contains(texto) ||
                        it.getUbicacionComando().lowercase().contains(texto) ||
                        it.getFundacionId().lowercase().contains(texto)
            }
        )
    }

    private fun guardarComando() {
        val nombre = nombreComandoEditText.text.toString().trim()
        val ubicacion = ubicacionComandoEditText.text.toString().trim()
        val fundacionId = usuarioIdEditText.text.toString().trim()
        val estado = estadoSwitch.isChecked
        val brigada = brigadaSpinner.selectedItem.toString()

        if (nombre.isEmpty() || ubicacion.isEmpty() || fundacionId.isEmpty()) {
            showError("Complete todos los campos obligatorios")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentComandoId != null) {
                    actualizarComando(nombre, ubicacion, fundacionId, estado, brigada)
                } else {
                    crearComando(nombre, ubicacion, fundacionId, brigada)
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
                runOnUiThread {
                    showSuccess("Comando actualizado")
                    resetForm()
                    cargarComandos()
                }
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

        comandoServices.createComando(createData)
            .onSuccess {
                runOnUiThread {
                    showSuccess("Comando creado")
                    resetForm()
                    cargarComandos()
                }
            }.onFailure { error ->
                showError("Error al crear: ${error.message}")
            }
    }

    private fun resetForm() {
        isEditing = false
        currentComandoId = null
        nombreComandoEditText.text.clear()
        ubicacionComandoEditText.text.clear()
        usuarioIdEditText.text.clear()
        estadoSwitch.isChecked = false
        brigadaSpinner.setSelection(0)
        searchView.setQuery("", false)
    }

    private fun onUpdateClick(comando: Comando) {
        isEditing = true
        currentComandoId = comando.getId()
        nombreComandoEditText.setText(comando.getNombreComando())
        ubicacionComandoEditText.setText(comando.getUbicacionComando())
        usuarioIdEditText.setText(comando.getFundacionId())
        estadoSwitch.isChecked = comando.getEstadoComando()

        // Seleccionar la brigada en el spinner
        comando.getBrigadas().firstOrNull()?.let { brigada ->
            val spinnerAdapter = brigadaSpinner.adapter as? ArrayAdapter<*>
            val position = spinnerAdapter?.let { adapter ->
                (0 until adapter.count).indexOfFirst { i ->
                    adapter.getItem(i) == brigada
                }.takeIf { it >= 0 } ?: 0
            } ?: 0
            brigadaSpinner.setSelection(position)
        }
    }

    private fun onDeleteClick(comando: Comando) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar comando")
            .setMessage("¿Confirmas que deseas eliminar este comando?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    comandoServices.deleteComandoById(comando.getId()!!)
                        .onSuccess {
                            runOnUiThread {
                                showSuccess("Comando eliminado")
                                cargarComandos()
                            }
                        }
                        .onFailure { error ->
                            showError("Error al eliminar: ${error.message}")
                        }
                }
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showInfo(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}