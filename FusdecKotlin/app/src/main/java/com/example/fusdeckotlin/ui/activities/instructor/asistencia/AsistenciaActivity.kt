package com.example.fusdeckotlin.ui.activities.instructor.asistencia

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
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.instructor.asistencia.AsistenciaServices
import com.example.fusdeckotlin.services.instructor.asistenciaestudiante.AsistenciaEstudianteService
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServices
import com.example.fusdeckotlin.ui.adapters.instructor.asistencia.AsistenciaAdapter
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Calendar

class AsistenciaActivity : AppCompatActivity() {

    private lateinit var tituloEditText: EditText
    private lateinit var fechaEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var seleccionarEstudiantesButton: Button
    private lateinit var estudiantesSeleccionadosText: TextView
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var searchEditText: EditText
    private lateinit var asistenciasRecyclerView: RecyclerView

    private val asistenciaService = AsistenciaServices()
    private val asistenciaEstudianteService = AsistenciaEstudianteService()
    private val estudianteService = EstudianteServices()
    private lateinit var adapter: AsistenciaAdapter

    private var isEditing: Boolean = false
    private var currentAsistenciaId: Int? = null
    private var estudiantesSeleccionados = mutableListOf<Estudiante>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_asistencia)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarAsistencias()
        configurarBusqueda()
    }

    private fun initViews() {
        tituloEditText = findViewById(R.id.tituloEditText)
        fechaEditText = findViewById(R.id.fechaEditText)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        seleccionarEstudiantesButton = findViewById(R.id.seleccionarEstudiantesButton)
        estudiantesSeleccionadosText = findViewById(R.id.estudiantesSeleccionadosText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        asistenciasRecyclerView = findViewById(R.id.asistenciasRecyclerView)
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
        adapter = AsistenciaAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick,
            ::onInfoClick
        )
        asistenciasRecyclerView.layoutManager = LinearLayoutManager(this)
        asistenciasRecyclerView.adapter = adapter
    }

    private fun setupListeners() {
        fechaEditText.setOnClickListener { mostrarDatePicker() }
        seleccionarEstudiantesButton.setOnClickListener { mostrarDialogoSeleccionEstudiantes() }
        confirmarButton.setOnClickListener { guardarAsistencia() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarAsistencias() {
        lifecycleScope.launch {
            val result = asistenciaService.listarAsistenciasActivas()
            result.onSuccess { asistencias ->
                adapter.actualizarLista(asistencias)
            }.onFailure { error ->
                showError("Error al cargar asistencias: ${error.message}")
            }
        }
    }

    private fun mostrarDatePicker() {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val selectedDate = LocalDate.of(year, month + 1, dayOfMonth)
                fechaEditText.setText(selectedDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun mostrarDialogoSeleccionEstudiantes() {
        lifecycleScope.launch {
            val result = estudianteService.listarEstudiantesActivos()
            result.onSuccess { estudiantes ->
                mostrarDialogoSeleccion(estudiantes)
            }.onFailure { error ->
                showError("Error al cargar estudiantes: ${error.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccion(estudiantes: List<Estudiante>) {
        val estudiantesArray = estudiantes.map {
            "${it.getNumeroDocumento()} - ${it.getNombre()} ${it.getApellido()}"
        }.toTypedArray()

        val seleccionados = BooleanArray(estudiantes.size) { index ->
            estudiantesSeleccionados.any { it.getNumeroDocumento() == estudiantes[index].getNumeroDocumento() }
        }

        AlertDialog.Builder(this)
            .setTitle("Seleccionar Estudiantes")
            .setMultiChoiceItems(estudiantesArray, seleccionados) { _, which, isChecked ->
                if (isChecked) {
                    estudiantesSeleccionados.add(estudiantes[which])
                } else {
                    estudiantesSeleccionados.removeAll {
                        it.getNumeroDocumento() == estudiantes[which].getNumeroDocumento()
                    }
                }
                actualizarTextoEstudiantesSeleccionados()
            }
            .setPositiveButton("Aceptar") { dialog, _ -> dialog.dismiss() }
            .setNegativeButton("Cancelar") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    @SuppressLint("SetTextI18n")
    private fun actualizarTextoEstudiantesSeleccionados() {
        if (estudiantesSeleccionados.isEmpty()) {
            estudiantesSeleccionadosText.text = "Ningún estudiante seleccionado"
        } else {
            estudiantesSeleccionadosText.text =
                "${estudiantesSeleccionados.size} estudiante(s) seleccionado(s): ${
                    estudiantesSeleccionados.joinToString(", ") {
                        "${it.getNumeroDocumento()} (${it.getNombre()} ${it.getApellido()})"
                    }
                }"
        }
    }

    private fun guardarAsistencia() {
        val titulo = tituloEditText.text.toString().trim()
        val fechaStr = fechaEditText.text.toString().trim()
        val usuarioId = usuarioIdEditText.text.toString().trim()

        if (titulo.isEmpty() || fechaStr.isEmpty() || usuarioId.isEmpty()) {
            showError("Por favor, complete todos los campos")
            return
        }

        lifecycleScope.launch {
            try {
                val fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("yyyy/MM/dd"))

                if (isEditing && currentAsistenciaId != null) {
                    // Actualizar asistencia
                    asistenciaService.actualizarAsistencia(
                        currentAsistenciaId!!,
                        titulo,
                        fecha,
                        true
                    ).onSuccess {
                        // Actualizar relaciones con estudiantes
                        actualizarRelacionesEstudiantes(currentAsistenciaId!!)
                        showSuccess("Asistencia actualizada")
                        resetEditingState()
                        cargarAsistencias()
                    }.onFailure { error ->
                        showError("Error al actualizar: ${error.message}")
                    }
                } else {
                    // Crear nueva asistencia
                    asistenciaService.crearAsistencia(
                        titulo,
                        fecha,
                        usuarioId
                    ).onSuccess { asistencia ->
                        // Crear relaciones con estudiantes seleccionados
                        estudiantesSeleccionados.forEach { estudiante ->
                            asistenciaEstudianteService.crearAsistenciaEstudiante(
                                asistencia.getId(),
                                estudiante.getNumeroDocumento()
                            )
                        }
                        showSuccess("Asistencia creada")
                        resetEditingState()
                        cargarAsistencias()
                    }.onFailure { error ->
                        showError("Error al crear: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }

    private suspend fun actualizarRelacionesEstudiantes(asistenciaId: Int) {
        val relacionesActualesResult = asistenciaEstudianteService.obtenerTodasLasRelaciones()

        relacionesActualesResult.onSuccess { todasRelaciones ->
            val relacionesActuales = todasRelaciones.filter { it.getAsistenciaId() == asistenciaId }

            val relacionesAEliminar = relacionesActuales.filter { actual ->
                !estudiantesSeleccionados.any { seleccionado ->
                    seleccionado.getNumeroDocumento() == actual.getEstudianteId()
                }
            }

            relacionesAEliminar.forEach { relacion ->
                asistenciaEstudianteService.eliminarAsistenciaEstudiante(
                    relacion.getAsistenciaId(),
                    relacion.getEstudianteId()
                )
            }

            val estudiantesAAgregar = estudiantesSeleccionados.filter { seleccionado ->
                !relacionesActuales.any { actual ->
                    actual.getEstudianteId() == seleccionado.getNumeroDocumento()
                }
            }

            estudiantesAAgregar.forEach { estudiante ->
                asistenciaEstudianteService.crearAsistenciaEstudiante(
                    asistenciaId,
                    estudiante.getNumeroDocumento()
                )
            }
        }.onFailure { error ->
            showError("Error al actualizar estudiantes: ${error.message}")
        }
    }

    private fun onUpdateClick(asistencia: Asistencia) {
        isEditing = true
        currentAsistenciaId = asistencia.getId()
        tituloEditText.setText(asistencia.getTitulo())
        fechaEditText.setText(asistencia.getFecha().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
        usuarioIdEditText.setText(asistencia.getUsuarioId())

        // Cargar estudiantes
        lifecycleScope.launch {
            // Id de estudiantes relacionados
            val resultRelaciones = asistenciaEstudianteService.obtenerTodasLasRelaciones()
            resultRelaciones.onSuccess { relaciones ->
                val estudiantesIds = relaciones
                    .filter { it.getAsistenciaId() == asistencia.getId() }
                    .map { it.getEstudianteId() }

                if (estudiantesIds.isEmpty()) {
                    estudiantesSeleccionados.clear()
                    actualizarTextoEstudiantesSeleccionados()
                    return@onSuccess
                }
                // Obtener detalles
                val resultEstudiantes = estudianteService.listarEstudiantesActivos()
                resultEstudiantes.onSuccess { todosEstudiantes ->
                    estudiantesSeleccionados.clear()
                    estudiantesSeleccionados.addAll(
                        todosEstudiantes.filter { estudiantesIds.contains(it.getNumeroDocumento()) }
                    )
                    actualizarTextoEstudiantesSeleccionados()
                }.onFailure { error ->
                    showError("Error al cargar estudiantes: ${error.message}")
                }
            }.onFailure { error ->
                showError("Error al cargar relaciones: ${error.message}")
            }
        }
    }

    private fun onDeleteClick(asistencia: Asistencia) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar esta asistencia?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    // Eliminar relaciones con estudiantes
                    val resultRelaciones = asistenciaEstudianteService.obtenerTodasLasRelaciones()
                    resultRelaciones.onSuccess { relaciones ->
                        relaciones.filter { it.getAsistenciaId() == asistencia.getId() }.forEach { relacion ->
                            asistenciaEstudianteService.eliminarAsistenciaEstudiante(
                                relacion.getAsistenciaId(),
                                relacion.getEstudianteId()
                            )
                        }

                        // eliminar
                        val result = asistenciaService.desactivarAsistencia(asistencia.getId())
                        result.onSuccess {
                            showSuccess("Asistencia eliminada")
                            cargarAsistencias()
                        }.onFailure { error ->
                            showError(error.message ?: "Error al eliminar")
                        }
                    }.onFailure { error ->
                        showError("Error al eliminar relaciones: ${error.message}")
                    }
                }
            }
            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    private fun onInfoClick(asistencia: Asistencia) {
        lifecycleScope.launch {
            try {
                // Obtener todas las relaciones
                val resultRelaciones = asistenciaEstudianteService.obtenerTodasLasRelaciones()

                resultRelaciones.onSuccess { todasRelaciones ->
                    // Filtrar relaciones
                    val relaciones = todasRelaciones.filter {
                        it.getAsistenciaId() == asistencia.getId()
                    }

                    if (relaciones.isEmpty()) {
                        runOnUiThread {
                            mostrarDialogoEstudiantes(emptyArray())
                        }
                        return@onSuccess
                    }

                    // Obtener estudiantes
                    val resultEstudiantes = estudianteService.listarEstudiantesActivos()

                    resultEstudiantes.onSuccess { todosEstudiantes ->
                        // Filtrar estudiantes que están en las relaciones
                        val estudiantesAsistentes = todosEstudiantes.filter { estudiante ->
                            relaciones.any { rel -> rel.getEstudianteId() == estudiante.getNumeroDocumento() }
                        }.map { estudiante ->
                            "• Num: ${estudiante.getNumeroDocumento()} - ${estudiante.getNombre()} ${estudiante.getApellido()}"
                        }.toTypedArray()

                        runOnUiThread {
                            mostrarDialogoEstudiantes(estudiantesAsistentes)
                        }
                    }.onFailure { error ->
                        runOnUiThread {
                            showError("Error al cargar estudiantes: ${error.message}")
                        }
                    }
                }.onFailure { error ->
                    runOnUiThread {
                        showError("Error al cargar relaciones: ${error.message}")
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
            "No hay estudiantes asistentes."
        }

        estudiantesTextView.text = textoFormateado

        cerrarBtn.setOnClickListener { dialog.dismiss() }

        dialog.show()
    }



    private fun resetEditingState() {
        isEditing = false
        currentAsistenciaId = null
        estudiantesSeleccionados.clear()
        actualizarTextoEstudiantesSeleccionados()
        tituloEditText.text.clear()
        fechaEditText.text.clear()
        usuarioIdEditText.text.clear()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}

