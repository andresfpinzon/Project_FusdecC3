package com.example.fusdeckotlin.ui.activities.administrativo.unidad

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
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import com.example.fusdeckotlin.services.administrativo.brigada.BrigadaServices
import com.example.fusdeckotlin.services.administrativo.unidad.UnidadServices
import com.example.fusdeckotlin.services.administrativo.usuario.UsuarioServices
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServices
import com.example.fusdeckotlin.ui.adapters.administrativo.unidad.UnidadAdapter
import kotlinx.coroutines.launch

class UnidadActivity : AppCompatActivity() {

    private lateinit var nombreEditText: EditText
    private lateinit var seleccionarBrigadaButton: Button
    private lateinit var brigadaSeleccionadaText: TextView
    private lateinit var seleccionarUsuarioButton: Button
    private lateinit var usuarioSeleccionadoText: TextView
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var searchEditText: EditText
    private lateinit var unidadesRecyclerView: RecyclerView

    private val unidadService = UnidadServices()
    private val brigadaService = BrigadaServices()
    private val usuarioService = UsuarioServices()
    private val estudianteService = EstudianteServices()
    private lateinit var adapter: UnidadAdapter

    private var isEditing: Boolean = false
    private var currentUnidadId: String? = null
    private var brigadaSeleccionada: Brigada? = null
    private var usuarioSeleccionado: Usuario? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_unidad)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarUnidades()
        configurarBusqueda()
    }

    private fun initViews() {
        nombreEditText = findViewById(R.id.nombreUnidadEditText)
        seleccionarBrigadaButton = findViewById(R.id.seleccionarBrigadaButton)
        brigadaSeleccionadaText = findViewById(R.id.brigadaSeleccionadaText)
        seleccionarUsuarioButton = findViewById(R.id.seleccionarUsuarioButton)
        usuarioSeleccionadoText = findViewById(R.id.usuarioSeleccionadoText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        unidadesRecyclerView = findViewById(R.id.unidadesRecyclerView)
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
        adapter = UnidadAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick,
            ::onInfoClick,
            brigadaService,
            usuarioService
        )
        unidadesRecyclerView.layoutManager = LinearLayoutManager(this)
        unidadesRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        seleccionarBrigadaButton.setOnClickListener { mostrarDialogoSeleccionBrigada() }
        seleccionarUsuarioButton.setOnClickListener { mostrarDialogoSeleccionUsuario() }
        confirmarButton.setOnClickListener { guardarUnidad() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarUnidades() {
        lifecycleScope.launch {
            val result = unidadService.listarUnidadesActivas()
            result.onSuccess { unidades ->
                adapter.actualizarLista(unidades)
            }.onFailure { error ->
                showError("Error al cargar unidades: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionBrigada() {
        lifecycleScope.launch {
            val result = brigadaService.listarBrigadasActivas()
            result.onSuccess { brigadas ->
                mostrarDialogoSeleccionBrigada(brigadas)
            }.onFailure { error ->
                showError("Error al cargar brigadas: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionBrigada(brigadas: List<Brigada>) {
        val brigadasArray = brigadas.map {
            "• ${it.getNombreBrigada()}"
        }.toTypedArray()

        AlertDialog.Builder(this)
            .setTitle("Seleccionar Brigada")
            .setItems(brigadasArray) { _, which ->
                brigadaSeleccionada = brigadas[which]
                actualizarTextoBrigadaSeleccionada()
            }
            .setNegativeButton("Cancelar") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    private fun mostrarDialogoSeleccionUsuario() {
        lifecycleScope.launch {
            val result = usuarioService.getUsersActives()
            result.onSuccess { usuarios ->
                mostrarDialogoSeleccionUsuario(usuarios)
            }.onFailure { error ->
                showError("Error al cargar usuarios: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionUsuario(usuarios: List<Usuario>) {
        val usuariosArray = usuarios.map {
            "• ${it.getNombreUsuario()} ${it.getApellidoUsuario()} (${it.getNumeroDocumento()})"
        }.toTypedArray()

        AlertDialog.Builder(this)
            .setTitle("Seleccionar Usuario")
            .setItems(usuariosArray) { _, which ->
                usuarioSeleccionado = usuarios[which]
                actualizarTextoUsuarioSeleccionado()
            }
            .setNegativeButton("Cancelar") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    @SuppressLint("SetTextI18n")
    private fun actualizarTextoBrigadaSeleccionada() {
        brigadaSeleccionada?.let { brigada ->
            brigadaSeleccionadaText.text =
                "Brigada seleccionada: ${brigada.getNombreBrigada()} (${brigada.getId()})"
        } ?: run {
            brigadaSeleccionadaText.text = "Ninguna brigada seleccionada"
        }
    }

    @SuppressLint("SetTextI18n")
    private fun actualizarTextoUsuarioSeleccionado() {
        usuarioSeleccionado?.let { usuario ->
            usuarioSeleccionadoText.text =
                "Usuario seleccionado: ${usuario.getNombreUsuario()} ${usuario.getApellidoUsuario()} (${usuario.getNumeroDocumento()})"
        } ?: run {
            usuarioSeleccionadoText.text = "Ningún usuario seleccionado"
        }
    }

    private fun guardarUnidad() {
        val nombre = nombreEditText.text.toString().trim()

        if (nombre.isEmpty() || brigadaSeleccionada == null || usuarioSeleccionado == null) {
            showError("Por favor, complete todos los campos y seleccione una brigada y usuario")
            return
        }

        lifecycleScope.launch {
            val brigadaId = brigadaSeleccionada!!.getId()
            val usuarioId = usuarioSeleccionado!!.getNumeroDocumento()

            if (isEditing && currentUnidadId != null) {
                unidadService.actualizarUnidad(
                    currentUnidadId!!,
                    nombre,
                    brigadaId,
                    usuarioId,
                    true
                ).onSuccess {
                    showSuccess("Unidad actualizada")
                    resetEditingState()
                    cargarUnidades()
                }.onFailure { error ->
                    showError("Error al actualizar: ${error.message}")
                }
            } else {
                unidadService.crearUnidad(
                    nombre,
                    brigadaId,
                    usuarioId
                ).onSuccess {
                    showSuccess("Unidad creada")
                    resetEditingState()
                    cargarUnidades()
                }.onFailure { error ->
                    showError("Error al crear: ${error.message}")
                }
            }
        }
    }

    private fun onUpdateClick(unidad: Unidad) {
        isEditing = true
        currentUnidadId = unidad.getId().toString()
        nombreEditText.setText(unidad.getNombreUnidad())

        // Cargar brigada
        lifecycleScope.launch {
            val resultBrigada = brigadaService.obtenerBrigadaPorId(unidad.getBrigadaId().toString())
            resultBrigada.onSuccess { brigada ->
                brigadaSeleccionada = brigada
                actualizarTextoBrigadaSeleccionada()
            }.onFailure { error ->
                showError("Error al cargar brigada: ${error.message}")
            }

            // Cargar usuario
            val resultUsuario = usuarioService.getUserByDocument(unidad.getUsuarioId())
            resultUsuario.onSuccess { usuario ->
                usuarioSeleccionado = usuario
                actualizarTextoUsuarioSeleccionado()
            }.onFailure { error ->
                showError("Error al cargar usuario: ${error.message}")
            }
        }
    }

    private fun onDeleteClick(unidad: Unidad) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar esta unidad?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    val result = unidadService.desactivarUnidad(unidad.getId().toString())
                    result.onSuccess {
                        showSuccess("Unidad eliminada")
                        cargarUnidades()
                    }.onFailure { error ->
                        showError(error.message ?: "Error al eliminar")
                    }
                }
            }
            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    private fun onInfoClick(unidad: Unidad) {
        lifecycleScope.launch {
            try {
                // Obtener todos los estudiantes activos
                val resultEstudiantes = estudianteService.listarEstudiantesActivos()

                resultEstudiantes.onSuccess { todosEstudiantes ->
                    // Filtrar estudiantes cuyo campo unidad coincida
                    val estudiantesUnidad = todosEstudiantes.filter { estudiante ->
                        estudiante.getUnidad() == unidad.getId()
                    }.map { estudiante ->
                        "• Num: ${estudiante.getNumeroDocumento()} - ${estudiante.getNombre()} ${estudiante.getApellido()}"
                    }.toTypedArray()

                    runOnUiThread {
                        if (estudiantesUnidad.isNotEmpty()) {
                            mostrarDialogoEstudiantes(estudiantesUnidad, unidad.getNombreUnidad())
                        } else {
                            mostrarDialogoEstudiantes(
                                arrayOf("No hay estudiantes asociados a la unidad: ${unidad.getNombreUnidad()}"),
                                unidad.getNombreUnidad()
                            )
                        }
                    }
                }.onFailure { error ->
                    runOnUiThread {
                        showError("Error al cargar estudiantes: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Error inesperado: ${e.message}")
                }
            }
        }
    }

    private fun mostrarDialogoEstudiantes(estudiantes: Array<String>, nombreUnidad: String) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_info_button, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        val tituloTextView = dialogView.findViewById<TextView>(R.id.tituloDialogo)
        val contenidoTextView = dialogView.findViewById<TextView>(R.id.contenidoTextView)
        val cerrarBtn = dialogView.findViewById<TextView>(R.id.btnCerrar)

        tituloTextView.text = "Estudiantes de la unidad: $nombreUnidad"

        val textoFormateado = if (estudiantes.isNotEmpty()) {
            estudiantes.joinToString("\n") { linea ->
                val partes = linea.split(" - ")
                val numero = partes.getOrNull(0) ?: ""
                val nombre = partes.getOrNull(1) ?: ""
                "$numero  $nombre"
            }
        } else {
            "No hay estudiantes asignados a esta unidad."
        }

        contenidoTextView.text = textoFormateado

        cerrarBtn.setOnClickListener { dialog.dismiss() }
        dialog.show()
    }

    private fun resetEditingState() {
        isEditing = false
        currentUnidadId = null
        brigadaSeleccionada = null
        usuarioSeleccionado = null
        nombreEditText.text.clear()
        brigadaSeleccionadaText.text = "Ninguna brigada seleccionada"
        usuarioSeleccionadoText.text = "Ningún usuario seleccionado"
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}