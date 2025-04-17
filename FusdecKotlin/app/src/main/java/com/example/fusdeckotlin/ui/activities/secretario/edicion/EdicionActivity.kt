package com.example.fusdeckotlin.ui.activities.secretario.edicion

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.app.DatePickerDialog
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
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.secretario.curso.CursoServices
import com.example.fusdeckotlin.services.secretario.edicion.EdicionServices
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServices
import com.example.fusdeckotlin.ui.adapters.secretario.edicion.EdicionAdapter
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Calendar

class EdicionActivity : AppCompatActivity() {

    private lateinit var tituloEditText: EditText
    private lateinit var fechaInicioEditText: EditText
    private lateinit var fechaFinEditText: EditText
    private lateinit var seleccionarCursoButton: Button
    private lateinit var cursoSeleccionadoText: TextView
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var searchEditText: EditText
    private lateinit var edicionesRecyclerView: RecyclerView

    private val edicionService = EdicionServices()
    private val cursoService = CursoServices()
    private val estudianteService = EstudianteServices()
    private lateinit var adapter: EdicionAdapter

    private var isEditing: Boolean = false
    private var currentEdicionId: String? = null
    private var cursoSeleccionado: Curso? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edicion)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarEdiciones()
        configurarBusqueda()
    }

    private fun initViews() {
        tituloEditText = findViewById(R.id.tituloEdicionEditText)
        fechaInicioEditText = findViewById(R.id.fechaInicioEditText)
        fechaFinEditText = findViewById(R.id.fechaFinEditText)
        seleccionarCursoButton = findViewById(R.id.seleccionarCursoButton)
        cursoSeleccionadoText = findViewById(R.id.cursoSeleccionadoText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        edicionesRecyclerView = findViewById(R.id.edicionesRecyclerView)
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
        adapter = EdicionAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick,
            ::onInfoClick
        )
        edicionesRecyclerView.layoutManager = LinearLayoutManager(this)
        edicionesRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        fechaInicioEditText.setOnClickListener { mostrarDatePicker(fechaInicioEditText) }
        fechaFinEditText.setOnClickListener { mostrarDatePicker(fechaFinEditText) }
        seleccionarCursoButton.setOnClickListener { mostrarDialogoSeleccionCurso() }
        confirmarButton.setOnClickListener { guardarEdicion() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarEdiciones() {
        lifecycleScope.launch {
            val result = edicionService.listarEdicionesActivas()
            result.onSuccess { ediciones ->
                adapter.actualizarLista(ediciones)
            }.onFailure { error ->
                showError("Error al cargar ediciones: ${error.message}")
            }
        }
    }

    private fun mostrarDatePicker(editText: EditText) {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val selectedDate = LocalDate.of(year, month + 1, dayOfMonth)
                editText.setText(selectedDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun mostrarDialogoSeleccionCurso() {
        lifecycleScope.launch {
            val result = cursoService.listarCursosActivos()
            result.onSuccess { cursos ->
                mostrarDialogoSeleccionCurso(cursos)
            }.onFailure { error ->
                showError("Error al cargar cursos: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionCurso(cursos: List<Curso>) {
        val cursosArray = cursos.map {
            "• ${it.getNombreCurso()}"
        }.toTypedArray()

        AlertDialog.Builder(this)
            .setTitle("Seleccionar Curso")
            .setItems(cursosArray) { _, which ->
                cursoSeleccionado = cursos[which]
                actualizarTextoCursoSeleccionado()
            }
            .setNegativeButton("Cancelar") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    @SuppressLint("SetTextI18n")
    private fun actualizarTextoCursoSeleccionado() {
        cursoSeleccionado?.let { curso ->
            cursoSeleccionadoText.text =
                "Curso seleccionado: ${curso.getNombreCurso()} (${curso.getId()})"
        } ?: run {
            cursoSeleccionadoText.text = "Ningún curso seleccionado"
        }
    }

    private fun guardarEdicion() {
        val titulo = tituloEditText.text.toString().trim()
        val fechaInicioStr = fechaInicioEditText.text.toString().trim()
        val fechaFinStr = fechaFinEditText.text.toString().trim()

        if (titulo.isEmpty() || fechaInicioStr.isEmpty() || fechaFinStr.isEmpty() || cursoSeleccionado == null) {
            showError("Por favor, complete todos los campos y seleccione un curso")
            return
        }

        lifecycleScope.launch {
            try {
                val fechaInicio = LocalDate.parse(fechaInicioStr, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
                val fechaFin = LocalDate.parse(fechaFinStr, DateTimeFormatter.ofPattern("yyyy/MM/dd"))
                val cursoId = cursoSeleccionado!!.getId()

                if (isEditing && currentEdicionId != null) {
                    edicionService.actualizarEdicion(
                        currentEdicionId!!,
                        titulo,
                        fechaInicio,
                        fechaFin,
                        cursoId,
                        true
                    ).onSuccess {
                        showSuccess("Edición actualizada")
                        resetEditingState()
                        cargarEdiciones()
                    }.onFailure { error ->
                        showError("Error al actualizar: ${error.message}")
                    }
                } else {
                    edicionService.crearEdicion(
                        titulo,
                        fechaInicio,
                        fechaFin,
                        cursoId,
                    ).onSuccess {
                        showSuccess("Edición creada")
                        resetEditingState()
                        cargarEdiciones()
                    }.onFailure { error ->
                        showError("Error al crear: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                showError("Error en fechas: ${e.message}")
            }
        }
    }

    private fun onUpdateClick(edicion: Edicion) {
        isEditing = true
        currentEdicionId = edicion.getId()
        tituloEditText.setText(edicion.getNombreEdicion())
        fechaInicioEditText.setText(edicion.getFechaInicio().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
        fechaFinEditText.setText(edicion.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))

        // Cargar curso
        lifecycleScope.launch {
            val result = cursoService.obtenerCursoPorId(edicion.getCursoId())
            result.onSuccess { curso ->
                cursoSeleccionado = curso
                actualizarTextoCursoSeleccionado()
            }.onFailure { error ->
                showError("Error al cargar curso: ${error.message}")
            }
        }
    }

    private fun onDeleteClick(edicion: Edicion) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar esta edición?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    val result = edicionService.desactivarEdicion(edicion.getId())
                    result.onSuccess {
                        showSuccess("Edición eliminada")
                        cargarEdiciones()
                    }.onFailure { error ->
                        showError(error.message ?: "Error al eliminar")
                    }
                }
            }
            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    private fun onInfoClick(edicion: Edicion) {
        lifecycleScope.launch {
            try {
                // Obtener todos los estudiantes activos
                val resultEstudiantes = estudianteService.listarEstudiantesActivos()

                resultEstudiantes.onSuccess { todosEstudiantes ->
                    // Filtrar estudiantes cuyo campo coincida
                    val estudiantesEdicion = todosEstudiantes.filter { estudiante ->
                        estudiante.getEdicion() == edicion.getNombreEdicion()
                    }.map { estudiante ->
                        "• Num: ${estudiante.getNumeroDocumento()} - ${estudiante.getNombre()} ${estudiante.getApellido()}"
                    }.toTypedArray()

                    runOnUiThread {
                        if (estudiantesEdicion.isNotEmpty()) {
                            mostrarDialogoEstudiantes(estudiantesEdicion)
                        } else {
                            mostrarDialogoEstudiantes(
                                arrayOf("No hay estudiantes asociados a la edición: ${edicion.getNombreEdicion()}")
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
            "No hay estudiantes inscritos en esta edición."
        }

        estudiantesTextView.text = textoFormateado

        cerrarBtn.setOnClickListener { dialog.dismiss() }

        dialog.show()
    }

    private fun resetEditingState() {
        isEditing = false
        currentEdicionId = null
        cursoSeleccionado = null
        tituloEditText.text.clear()
        fechaInicioEditText.text.clear()
        fechaFinEditText.text.clear()
        cursoSeleccionadoText.text = "Ningún curso seleccionado"
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}