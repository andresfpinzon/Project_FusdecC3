package com.example.fusdeckotlin.ui.activities.administrativo.brigada

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.inputmethod.EditorInfo
import android.view.inputmethod.InputMethodManager
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.services.administrativo.brigada.BrigadaServices
import com.example.fusdeckotlin.services.administrativo.comando.ComandoServices
import com.example.fusdeckotlin.services.administrativo.unidad.UnidadServices
import com.example.fusdeckotlin.ui.adapters.administrativo.brigada.BrigadaAdapter
import kotlinx.coroutines.launch

class BrigadaActivity : AppCompatActivity() {

    private lateinit var nombreEditText: EditText
    private lateinit var ubicacionEditText: EditText
    private lateinit var seleccionarComandoButton: Button
    private lateinit var comandoSeleccionadoText: TextView
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var searchEditText: EditText
    private lateinit var brigadasRecyclerView: RecyclerView

    private val brigadaService = BrigadaServices()
    private val comandoService = ComandoServices()
    private val unidadService = UnidadServices()
    private lateinit var adapter: BrigadaAdapter

    private var isEditing: Boolean = false
    private var currentBrigadaId: Int? = null
    private var comandoSeleccionado: Comando? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_brigada)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarBrigadas()
        configurarBusqueda()
    }

    private fun initViews() {
        nombreEditText = findViewById(R.id.nombreBrigadaEditText)
        ubicacionEditText = findViewById(R.id.ubicacionBrigadaEditText)
        seleccionarComandoButton = findViewById(R.id.seleccionarComandoButton)
        comandoSeleccionadoText = findViewById(R.id.comandoSeleccionadoText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        brigadasRecyclerView = findViewById(R.id.brigadasRecyclerView)
        searchEditText = findViewById(R.id.searchEditText)
    }

    private fun configurarBusqueda() {
        searchEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                adapter.filter.filter(s.toString())
            }
        })

        searchEditText.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                hideKeyboard()
                true
            } else {
                false
            }
        }
    }

    private fun hideKeyboard() {
        val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(searchEditText.windowToken, 0)
    }

    private fun setupRecyclerView() {
        adapter = BrigadaAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick,
            ::onInfoClick
        )
        brigadasRecyclerView.layoutManager = LinearLayoutManager(this)
        brigadasRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        seleccionarComandoButton.setOnClickListener { mostrarDialogoSeleccionComando() }
        confirmarButton.setOnClickListener { guardarBrigada() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarBrigadas() {
        lifecycleScope.launch {
            val result = brigadaService.listarBrigadasActivas()
            result.onSuccess { brigadas ->
                adapter.actualizarLista(brigadas)
            }.onFailure { error ->
                showError("Error al cargar brigadas: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionComando() {
        lifecycleScope.launch {
            val result = comandoService.listarComandosActivos()
            result.onSuccess { comandos ->
                mostrarDialogoSeleccionComando(comandos)
            }.onFailure { error ->
                showError("Error al cargar comandos: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionComando(comandos: List<Comando>) {
        val comandosArray = comandos.map {
            "• ${it.getNombreComando()}"
        }.toTypedArray()

        AlertDialog.Builder(this)
            .setTitle("Seleccionar Comando")
            .setItems(comandosArray) { _, which ->
                comandoSeleccionado = comandos[which]
                actualizarTextoComandoSeleccionado()
            }
            .setNegativeButton("Cancelar") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    @SuppressLint("SetTextI18n")
    private fun actualizarTextoComandoSeleccionado() {
        comandoSeleccionado?.let { comando ->
            comandoSeleccionadoText.text =
                "Comando seleccionado: ${comando.getNombreComando()} (${comando.getId()})"
        } ?: run {
            comandoSeleccionadoText.text = "Ningún comando seleccionado"
        }
    }

    private fun guardarBrigada() {
        val nombre = nombreEditText.text.toString().trim()
        val ubicacion = ubicacionEditText.text.toString().trim()

        if (nombre.isEmpty() || ubicacion.isEmpty() || comandoSeleccionado == null) {
            showError("Por favor, complete todos los campos y seleccione un comando")
            return
        }

        lifecycleScope.launch {
            val comandoId = comandoSeleccionado!!.getId().toIntOrNull() ?: run {
                showError("ID de comando inválido")
                return@launch
            }

            if (isEditing && currentBrigadaId != null) {
                brigadaService.actualizarBrigada(
                    currentBrigadaId!!,
                    nombre,
                    ubicacion,
                    comandoId
                ).onSuccess {
                    showSuccess("Brigada actualizada")
                    resetEditingState()
                    cargarBrigadas()
                }.onFailure { error ->
                    showError("Error al actualizar: ${error.message}")
                }
            } else {
                brigadaService.crearBrigada(
                    nombre,
                    ubicacion,
                    comandoId
                ).onSuccess {
                    showSuccess("Brigada creada")
                    resetEditingState()
                    cargarBrigadas()
                }.onFailure { error ->
                    showError("Error al crear: ${error.message}")
                }
            }
        }
    }

    private fun onUpdateClick(brigada: Brigada) {
        isEditing = true
        currentBrigadaId = brigada.getId()
        nombreEditText.setText(brigada.getNombreBrigada())
        ubicacionEditText.setText(brigada.getUbicacionBrigada())

        // Cargar comando desde el ID
        lifecycleScope.launch {
            val result = comandoService.obtenerComandoPorId(brigada.getComandoId().toString())
            result.onSuccess { comando ->
                runOnUiThread {
                    comandoSeleccionado = comando
                    actualizarTextoComandoSeleccionado()
                }
            }.onFailure { error ->
                runOnUiThread {
                    showError("Error al cargar comando: ${error.message}")
                }
            }
        }
    }

    private fun onDeleteClick(brigada: Brigada) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar esta brigada?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    val result = brigadaService.desactivarBrigada(brigada.getId())
                    result.onSuccess {
                        showSuccess("Brigada eliminada")
                        cargarBrigadas()
                    }.onFailure { error ->
                        showError(error.message ?: "Error al eliminar")
                    }
                }
            }
            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    private fun onInfoClick(brigada: Brigada) {
        lifecycleScope.launch {
            try {
                val resultUnidades = unidadService.listarUnidadesActivas()

                resultUnidades.onSuccess { todasUnidades ->
                    val unidadesBrigada = todasUnidades.filter { unidad ->
                        unidad.getBrigadaId() == brigada.getId().toString()
                    }.map { unidad ->
                        "• ${unidad.getNombreUnidad()}"
                    }.toTypedArray()

                    runOnUiThread {
                        if (unidadesBrigada.isNotEmpty()) {
                            mostrarDialogoUnidades(unidadesBrigada, brigada.getNombreBrigada())
                        } else {
                            mostrarDialogoUnidades(
                                arrayOf("No hay unidades asociadas a esta brigada"),
                                brigada.getNombreBrigada()
                            )
                        }
                    }
                }.onFailure { error ->
                    runOnUiThread {
                        showError("Error al cargar unidades: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Error inesperado: ${e.message}")
                }
            }
        }
    }

    private fun mostrarDialogoUnidades(unidades: Array<String>, nombreBrigada: String) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_info_button, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        val tituloTextView = dialogView.findViewById<TextView>(R.id.tituloDialogo)
        val unidadesTextView = dialogView.findViewById<TextView>(R.id.contenidoTextView)
        val cerrarBtn = dialogView.findViewById<TextView>(R.id.btnCerrar)

        tituloTextView.text = "Unidades de la brigada:"
        unidadesTextView.text = unidades.joinToString("\n")

        cerrarBtn.setOnClickListener { dialog.dismiss() }
        dialog.show()
    }

    private fun resetEditingState() {
        isEditing = false
        currentBrigadaId = null
        comandoSeleccionado = null
        nombreEditText.text.clear()
        ubicacionEditText.text.clear()
        comandoSeleccionadoText.text = "Ningún comando seleccionado"
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}