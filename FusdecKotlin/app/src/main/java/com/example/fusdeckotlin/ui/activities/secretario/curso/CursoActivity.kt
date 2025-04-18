package com.example.fusdeckotlin.ui.activities.secretario.curso

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
import com.example.fusdeckotlin.models.secretario.curso.Curso
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import com.example.fusdeckotlin.services.secretario.curso.CursoServices
import com.example.fusdeckotlin.services.secretario.edicion.EdicionServices
import com.example.fusdeckotlin.services.root.fundacion.FundacionService
import com.example.fusdeckotlin.ui.adapters.secretario.curso.CursoAdapter
import kotlinx.coroutines.launch

class CursoActivity : AppCompatActivity() {

    private lateinit var tituloCurso: EditText
    private lateinit var descripcionCurso: EditText
    private lateinit var intensidadHorariaCurso: EditText
    private lateinit var seleccionarFundacionButton: Button
    private lateinit var fundacionSeleccionadaText: TextView
    private lateinit var confirmarCursoButton: Button
    private lateinit var cancelarCursoButton: Button
    private lateinit var searchEditText: EditText
    private lateinit var cursosRecyclerView: RecyclerView

    private val cursoServicio = CursoServices()
    private val edicionService = EdicionServices()
    private val fundacionService = FundacionService()
    private lateinit var adapter: CursoAdapter

    private var isEditing: Boolean = false
    private var currentCursoId: String? = null
    private var fundacionSeleccionada: Fundacion? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_curso)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarCursos()
        configurarBusqueda()
    }

    private fun initViews() {
        tituloCurso = findViewById(R.id.tituloCurso)
        descripcionCurso = findViewById(R.id.descripcionCurso)
        intensidadHorariaCurso = findViewById(R.id.intensidadHorariaCurso)
        seleccionarFundacionButton = findViewById(R.id.seleccionarFundacionButton)
        fundacionSeleccionadaText = findViewById(R.id.fundacionSeleccionadaText)
        confirmarCursoButton = findViewById(R.id.confirmarCursoButton)
        cancelarCursoButton = findViewById(R.id.cancelarCursoButton)
        searchEditText = findViewById(R.id.searchEditText)
        cursosRecyclerView = findViewById(R.id.cursosRecyclerView)
    }

    private fun setupRecyclerView() {
        adapter = CursoAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick,
            ::onInfoClick
        )
        cursosRecyclerView.layoutManager = LinearLayoutManager(this)
        cursosRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        seleccionarFundacionButton.setOnClickListener { mostrarDialogoSeleccionFundaciones() }
        confirmarCursoButton.setOnClickListener { guardarCurso() }
        cancelarCursoButton.setOnClickListener { finish() }
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

    private fun cargarCursos() {
        lifecycleScope.launch {
            val result = cursoServicio.listarCursosActivos()
            result.onSuccess { cursos ->
                adapter.actualizarLista(cursos)
            }.onFailure { error ->
                showError("Error al cargar cursos: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionFundaciones() {
        lifecycleScope.launch {
            val result = fundacionService.listarTodasLasFundaciones()
            result.onSuccess { fundaciones ->
                mostrarDialogoSeleccion(fundaciones)
            }.onFailure { error ->
                showError("Error al cargar fundaciones: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccion(fundaciones: List<Fundacion>) {
        val fundacionesArray = fundaciones.map {
            "${it.getNombreFundacion()}"
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

    private fun actualizarTextoFundacionSeleccionada() {
        fundacionSeleccionada?.let { fundacion ->
            fundacionSeleccionadaText.text =
                "Fundación seleccionada: ${fundacion.getNombreFundacion()}"
        } ?: run {
            fundacionSeleccionadaText.text = "Ninguna fundación seleccionada"
        }
    }

    private fun guardarCurso() {
        val nombre = tituloCurso.text.toString().trim()
        val descripcion = descripcionCurso.text.toString().trim()
        val intensidadHoraria = intensidadHorariaCurso.text.toString().trim()
        val fundacionId = fundacionSeleccionada?.getId() ?: ""

        if (nombre.isEmpty() || descripcion.isEmpty() || intensidadHoraria.isEmpty() || fundacionId.isEmpty()) {
            showError("Por favor, complete todos los campos y seleccione una fundación")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentCursoId != null) {
                    cursoServicio.actualizarCurso(
                        id = currentCursoId!!,
                        nombre = nombre,
                        descripcion = descripcion,
                        intensidadHoraria = intensidadHoraria,
                        fundacionId = fundacionId,
                        estado = true
                    ).onSuccess {
                        showSuccess("Curso actualizado")
                        resetEditingState()
                        cargarCursos()
                    }.onFailure { error ->
                        showError("Error al actualizar: ${error.message}")
                    }
                } else {
                    cursoServicio.crearCurso(
                        nombre = nombre,
                        descripcion = descripcion,
                        intensidadHoraria = intensidadHoraria,
                        fundacionId = fundacionId
                    ).onSuccess {
                        showSuccess("Curso creado")
                        resetEditingState()
                        cargarCursos()
                    }.onFailure { error ->
                        showError("Error al crear: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }

    private fun resetEditingState() {
        isEditing = false
        currentCursoId = null
        fundacionSeleccionada = null
        limpiarFormulario()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun limpiarFormulario() {
        tituloCurso.text.clear()
        descripcionCurso.text.clear()
        intensidadHorariaCurso.text.clear()
        fundacionSeleccionadaText.text = "Ninguna fundación seleccionada"
    }

    private fun onUpdateClick(curso: Curso) {
        isEditing = true
        currentCursoId = curso.getId()
        tituloCurso.setText(curso.getNombreCurso())
        descripcionCurso.setText(curso.getDescripcionCurso())
        intensidadHorariaCurso.setText(curso.getIntensidadHorariaCurso())

        // Cargar fundación seleccionada
        lifecycleScope.launch {
            val result = fundacionService.obtenerFundacionPorId(curso.getFundacionId())
            result.onSuccess { fundacion ->
                fundacionSeleccionada = fundacion
                actualizarTextoFundacionSeleccionada()
            }.onFailure { error ->
                showError("Error al cargar fundación: ${error.message}")
            }
        }
    }

    private fun onDeleteClick(curso: Curso) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar este curso?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    val result = cursoServicio.desactivarCurso(curso.getId())
                    result.onSuccess {
                        showSuccess("Curso eliminado")
                        cargarCursos()
                    }.onFailure { error ->
                        showError(error.message ?: "Error al eliminar")
                    }
                }
            }
            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    private fun onInfoClick(curso: Curso) {
        lifecycleScope.launch {
            try {
                // Obtener todas las ediciones del curso
                val resultEdiciones = edicionService.listarEdicionesActivas()

                resultEdiciones.onSuccess { todasEdiciones ->
                    // Filtrar ediciones que pertenecen a este curso
                    val edicionesDelCurso = todasEdiciones.filter {
                        it.getCursoId() == curso.getId()
                    }.map { edicion ->
                        "• ${edicion.getNombreEdicion()} (${edicion.getFechaInicio()} - ${edicion.getFechaFin()})"
                    }.toTypedArray()

                    runOnUiThread {
                        mostrarDialogoEdiciones(edicionesDelCurso)
                    }
                }.onFailure { error ->
                    runOnUiThread {
                        showError("Error al cargar ediciones: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Error inesperado: ${e.message}")
                }
            }
        }
    }

    private fun mostrarDialogoEdiciones(ediciones: Array<String>) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_info_button, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        val tituloTextView = dialogView.findViewById<TextView>(R.id.tituloDialogo)
        val contenidoTextView = dialogView.findViewById<TextView>(R.id.contenidoTextView)
        val cerrarBtn = dialogView.findViewById<TextView>(R.id.btnCerrar)

        tituloTextView.text = "Ediciones del curso:"

        contenidoTextView.text = if (ediciones.isNotEmpty()) {
            ediciones.joinToString("\n")
        } else {
            "No hay ediciones registradas para este curso."
        }

        cerrarBtn.setOnClickListener { dialog.dismiss() }
        dialog.show()
    }
}


