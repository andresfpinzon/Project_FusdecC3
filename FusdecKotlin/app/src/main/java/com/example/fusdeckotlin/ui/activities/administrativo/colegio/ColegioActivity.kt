package com.example.fusdeckotlin.ui.activities.administrativo.colegio


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
import com.example.fusdeckotlin.models.administrativo.colegio.Colegio
import com.example.fusdeckotlin.services.administrativo.colegio.ColegioServices
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServices
import com.example.fusdeckotlin.ui.adapters.administrativo.colegio.ColegioAdapter
import kotlinx.coroutines.launch

class ColegioActivity : AppCompatActivity() {

    private lateinit var nombreEditText: EditText
    private lateinit var emailEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var searchEditText: EditText
    private lateinit var colegiosRecyclerView: RecyclerView

    private val colegioService = ColegioServices()
    private val estudianteService = EstudianteServices()
    private lateinit var adapter: ColegioAdapter

    private var isEditing: Boolean = false
    private var currentColegioId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_colegio)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarColegios()
        configurarBusqueda()
    }

    private fun initViews() {
        nombreEditText = findViewById(R.id.nombreColegioEditText)
        emailEditText = findViewById(R.id.emailColegioEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        colegiosRecyclerView = findViewById(R.id.colegiosRecyclerView)
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
        adapter = ColegioAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick,
            ::onInfoClick
        )
        colegiosRecyclerView.layoutManager = LinearLayoutManager(this)
        colegiosRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        confirmarButton.setOnClickListener { guardarColegio() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarColegios() {
        lifecycleScope.launch {
            val result = colegioService.listarColegiosActivos()
            result.onSuccess { colegios ->
                adapter.actualizarLista(colegios)
            }.onFailure { error ->
                showError("Error al cargar colegios: ${error.message}")
            }
        }
    }

    private fun guardarColegio() {
        val nombre = nombreEditText.text.toString().trim()
        val email = emailEditText.text.toString().trim()

        if (nombre.isEmpty() || email.isEmpty()) {
            showError("Por favor, complete todos los campos")
            return
        }

        lifecycleScope.launch {
            if (isEditing && currentColegioId != null) {
                colegioService.actualizarColegio(
                    currentColegioId!!,
                    nombre,
                    email,
                    true
                ).onSuccess {
                    showSuccess("Colegio actualizado")
                    resetEditingState()
                    cargarColegios()
                }.onFailure { error ->
                    showError("Error al actualizar: ${error.message}")
                }
            } else {
                colegioService.crearColegio(
                    nombre,
                    email
                ).onSuccess {
                    showSuccess("Colegio creado")
                    resetEditingState()
                    cargarColegios()
                }.onFailure { error ->
                    showError("Error al crear: ${error.message}")
                }
            }
        }
    }

    private fun onUpdateClick(colegio: Colegio) {
        isEditing = true
        nombreEditText.setText(colegio.getNombreColegio())
        emailEditText.setText(colegio.getEmailColegio())
    }

    private fun onDeleteClick(colegio: Colegio) {

    }

    private fun onInfoClick(colegio: Colegio) {


    }

    private fun mostrarDialogoEstudiantes(estudiantes: Array<String>) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_estudiantes_asistencia, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        val estudiantesTextView = dialogView.findViewById<TextView>(R.id.estudiantesTextView)
        val cerrarBtn = dialogView.findViewById<TextView>(R.id.btnCerrar)

        val textoFormateado = if (estudiantes.isNotEmpty()) {
            estudiantes.joinToString("\n") { linea ->
                val partes = linea.split(" - ")
                val numero = partes.getOrNull(0) ?: ""
                val nombre = partes.getOrNull(1) ?: ""
                "$numero  $nombre"
            }
        } else {
            "No hay estudiantes asociados a este colegio."
        }

        estudiantesTextView.text = textoFormateado

        cerrarBtn.setOnClickListener { dialog.dismiss() }

        dialog.show()
    }

    private fun resetEditingState() {
        isEditing = false
        currentColegioId = null
        nombreEditText.text.clear()
        emailEditText.text.clear()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}