package com.example.fusdeckotlin.ui.activities.administrativo.comando

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
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import com.example.fusdeckotlin.services.administrativo.brigada.BrigadaServices
import com.example.fusdeckotlin.services.administrativo.comando.ComandoServices
import com.example.fusdeckotlin.services.root.fundacion.FundacionService
import com.example.fusdeckotlin.ui.adapters.administrativo.comando.ComandoAdapter
import kotlinx.coroutines.launch

class ComandoActivity : AppCompatActivity() {

    private lateinit var nombreEditText: EditText
    private lateinit var ubicacionEditText: EditText
    private lateinit var seleccionarFundacionButton: Button
    private lateinit var fundacionSeleccionadaText: TextView
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var searchEditText: EditText
    private lateinit var comandosRecyclerView: RecyclerView

    private val comandoService = ComandoServices()
    private val fundacionService = FundacionService()
    private val brigadaService = BrigadaServices()
    private lateinit var adapter: ComandoAdapter

    private var isEditing: Boolean = false
    private var currentComandoId: Int? = null
    private var fundacionSeleccionada: Fundacion? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comando)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarComandos()
        configurarBusqueda()
    }

    private fun initViews() {
        nombreEditText = findViewById(R.id.nombreComandoEditText)
        ubicacionEditText = findViewById(R.id.ubicacionComandoEditText)
        seleccionarFundacionButton = findViewById(R.id.seleccionarFundacionButton)
        fundacionSeleccionadaText = findViewById(R.id.fundacionSeleccionadaText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        comandosRecyclerView = findViewById(R.id.comandosRecyclerView)
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
        adapter = ComandoAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick,
            ::onInfoClick,
            fundacionService
        )
        comandosRecyclerView.layoutManager = LinearLayoutManager(this)
        comandosRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        seleccionarFundacionButton.setOnClickListener { mostrarDialogoSeleccionFundacion() }
        confirmarButton.setOnClickListener { guardarComando() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarComandos() {
        lifecycleScope.launch {
            val result = comandoService.listarComandosActivos()
            result.onSuccess { comandos ->
                adapter.actualizarLista(comandos)
            }.onFailure { error ->
                showError("Error al cargar comandos: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionFundacion() {
        lifecycleScope.launch {
            val result = fundacionService.listarTodasLasFundaciones()
            result.onSuccess { fundaciones ->
                mostrarDialogoSeleccionFundacion(fundaciones)
            }.onFailure { error ->
                showError("Error al cargar fundaciones: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionFundacion(fundaciones: List<Fundacion>) {
        val fundacionesArray = fundaciones.map {
            "• ${it.getNombreFundacion()}"
        }.toTypedArray()

        AlertDialog.Builder(this)
            .setTitle("Seleccionar Fundación")
            .setItems(fundacionesArray) { _, which ->
                fundacionSeleccionada = fundaciones[which]
                actualizarTextoFundacionSeleccionada()
            }
            .setNegativeButton("Cancelar") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    @SuppressLint("SetTextI18n")
    private fun actualizarTextoFundacionSeleccionada() {
        fundacionSeleccionada?.let { fundacion ->
            fundacionSeleccionadaText.text =
                "Fundación seleccionada: ${fundacion.getNombreFundacion()} (${fundacion.getId()})"
        } ?: run {
            fundacionSeleccionadaText.text = "Ninguna fundación seleccionada"
        }
    }

    private fun guardarComando() {
        val nombre = nombreEditText.text.toString().trim()
        val ubicacion = ubicacionEditText.text.toString().trim()

        if (nombre.isEmpty() || ubicacion.isEmpty() || fundacionSeleccionada == null) {
            showError("Por favor, complete todos los campos y seleccione una fundación")
            return
        }

        lifecycleScope.launch {
            val fundacionId = fundacionSeleccionada!!.getId()

            if (isEditing && currentComandoId != null) {
                comandoService.actualizarComando(
                    currentComandoId!!,
                    nombre,
                    ubicacion,
                    fundacionId
                ).onSuccess {
                    showSuccess("Comando actualizado")
                    resetEditingState()
                    cargarComandos()
                }.onFailure { error ->
                    showError("Error al actualizar: ${error.message}")
                }
            } else {
                comandoService.crearComando(
                    nombre,
                    ubicacion,
                    fundacionId
                ).onSuccess {
                    showSuccess("Comando creado")
                    resetEditingState()
                    cargarComandos()
                }.onFailure { error ->
                    showError("Error al crear: ${error.message}")
                }
            }
        }
    }

    private fun onUpdateClick(comando: Comando) {
        isEditing = true
        currentComandoId = comando.getId()
        nombreEditText.setText(comando.getNombreComando())
        ubicacionEditText.setText(comando.getUbicacionComando())

        // Cargar fundación desde el ID
        lifecycleScope.launch {
            val result = fundacionService.obtenerFundacionPorId(comando.getFundacionId())
            result.onSuccess { fundacion ->
                runOnUiThread {
                    fundacionSeleccionada = fundacion
                    actualizarTextoFundacionSeleccionada()
                }
            }.onFailure { error ->
                runOnUiThread {
                    showError("Error al cargar fundación: ${error.message}")
                }
            }
        }
    }

    private fun onDeleteClick(comando: Comando) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar este comando?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    val result = comandoService.desactivarComando(comando.getId())
                    result.onSuccess {
                        showSuccess("Comando eliminado")
                        cargarComandos()
                    }.onFailure { error ->
                        showError(error.message ?: "Error al eliminar")
                    }
                }
            }
            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    private fun onInfoClick(comando: Comando) {
        lifecycleScope.launch {
            try {
                val resultBrigadas = brigadaService.listarBrigadasActivas()

                resultBrigadas.onSuccess { todasBrigadas ->
                    val brigadasComando = todasBrigadas.filter { brigada ->
                        brigada.getComandoId() == comando.getId()
                    }.map { brigada ->
                        "• ${brigada.getNombreBrigada()} (${brigada.getUbicacionBrigada()})"
                    }.toTypedArray()

                    runOnUiThread {
                        if (brigadasComando.isNotEmpty()) {
                            mostrarDialogoBrigadas(brigadasComando, comando.getNombreComando())
                        } else {
                            mostrarDialogoBrigadas(
                                arrayOf("No hay brigadas asociadas a este comando"),
                                comando.getNombreComando()
                            )
                        }
                    }
                }.onFailure { error ->
                    runOnUiThread {
                        showError("Error al cargar brigadas: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Error inesperado: ${e.message}")
                }
            }
        }
    }

    private fun mostrarDialogoBrigadas(brigadas: Array<String>, nombreComando: String) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_info_button, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        val tituloTextView = dialogView.findViewById<TextView>(R.id.tituloDialogo)
        val brigadasTextView = dialogView.findViewById<TextView>(R.id.contenidoTextView)
        val cerrarBtn = dialogView.findViewById<TextView>(R.id.btnCerrar)

        tituloTextView.text = "Brigadas del comando:"
        brigadasTextView.text = brigadas.joinToString("\n")

        cerrarBtn.setOnClickListener { dialog.dismiss() }
        dialog.show()
    }

    private fun resetEditingState() {
        isEditing = false
        currentComandoId = null
        fundacionSeleccionada = null
        nombreEditText.text.clear()
        ubicacionEditText.text.clear()
        fundacionSeleccionadaText.text = "Ninguna fundación seleccionada"
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}