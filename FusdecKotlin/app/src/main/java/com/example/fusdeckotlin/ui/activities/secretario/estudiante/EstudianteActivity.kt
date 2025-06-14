package com.example.fusdeckotlin.ui.activities.secretario.estudiante

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
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.administrativo.colegio.ColegioServices
import com.example.fusdeckotlin.services.administrativo.unidad.UnidadServices
import com.example.fusdeckotlin.services.instructor.asistencia.AsistenciaServices
import com.example.fusdeckotlin.services.instructor.asistenciaestudiante.AsistenciaEstudianteService
import com.example.fusdeckotlin.services.secretario.edicion.EdicionServices
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServices
import com.example.fusdeckotlin.ui.adapters.secretario.estudiante.EstudianteAdapter
import kotlinx.coroutines.launch

class EstudianteActivity : AppCompatActivity() {

    private lateinit var nombreEditText: EditText
    private lateinit var apellidoEditText: EditText
    private lateinit var tipoDocumentoEditText: EditText
    private lateinit var numeroDocumentoEditText: EditText
    private lateinit var generoEditText: EditText
    private lateinit var unidadEditText: EditText
    private lateinit var colegioEditText: EditText
    private lateinit var edicionEditText: EditText
    private lateinit var gradoEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var searchEditText: EditText
    private lateinit var estudiantesRecyclerView: RecyclerView

    private val unidadServices = UnidadServices()
    private val colegioServices = ColegioServices()

    private val estudianteServicio = EstudianteServices()
    private val asistenciaService = AsistenciaServices()
    private val asistenciaEstudianteService = AsistenciaEstudianteService()
    private val edicionService = EdicionServices()
    private lateinit var adapter: EstudianteAdapter

    private var isEditing: Boolean = false
    private var currentEstudianteDocumento: String? = null

    // Opciones para los select
    private val tiposDocumento = arrayOf("T.I", "C.C")
    private val generos = arrayOf("Masculino", "Femenino")
    private val grados = arrayOf("Noveno", "Décimo", "Once")
    private val unidades = mutableListOf<String>()
    private val colegios = mutableListOf<String>()
    private val ediciones = mutableListOf<String>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_estudiante)

        initViews()
        setupRecyclerView()
        cargarDatosParaSelects()
        setupListeners()
        cargarEstudiantes()
        configurarBusqueda()
    }

    private fun initViews() {
        nombreEditText = findViewById(R.id.nombreEditText)
        apellidoEditText = findViewById(R.id.apellidoEditText)
        tipoDocumentoEditText = findViewById(R.id.tipoDocumentoEditText)
        numeroDocumentoEditText = findViewById(R.id.numeroDocumentoEditText)
        generoEditText = findViewById(R.id.generoEditText)
        unidadEditText = findViewById(R.id.unidadEditText)
        colegioEditText = findViewById(R.id.colegioEditText)
        edicionEditText = findViewById(R.id.edicionEditText)
        gradoEditText = findViewById(R.id.gradoEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        searchEditText = findViewById(R.id.searchEditText)
        estudiantesRecyclerView = findViewById(R.id.estudiantesRecyclerView)

        // Configurar campos como no editables (se seleccionan desde diálogos)
        tipoDocumentoEditText.isFocusable = false
        generoEditText.isFocusable = false
        unidadEditText.isFocusable = false
        colegioEditText.isFocusable = false
        edicionEditText.isFocusable = false
        gradoEditText.isFocusable = false
    }

    private fun setupRecyclerView() {
        adapter = EstudianteAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick,
            ::onInfoClick,
            unidadServices,
            colegioServices,
            edicionService
        )
        estudiantesRecyclerView.layoutManager = LinearLayoutManager(this)
        estudiantesRecyclerView.adapter = adapter
    }

    private fun cargarDatosParaSelects() {
        lifecycleScope.launch {
            // Cargar ediciones disponibles
            edicionService.listarEdicionesActivas().onSuccess { listaEdiciones ->
                ediciones.clear()
                ediciones.addAll(listaEdiciones.map { it.getNombreEdicion() })
            }

            // Cargar unidades y colegios de estudiantes existentes
            estudianteServicio.listarEstudiantesActivos().onSuccess { estudiantes ->
                unidades.clear()
                colegios.clear()

                estudiantes.forEach {
                    if (!unidades.contains(it.getUnidad().toString())) {
                        unidades.add(it.getUnidad().toString())
                    }
                    if (!colegios.contains(it.getColegio().toString())) {
                        colegios.add(it.getColegio().toString())
                    }
                }
            }
        }
    }

    private fun setupListeners() {
        // Listeners para abrir diálogos de selección
        tipoDocumentoEditText.setOnClickListener { mostrarDialogoSeleccion("Tipo de Documento", tiposDocumento, tipoDocumentoEditText) }
        generoEditText.setOnClickListener { mostrarDialogoSeleccion("Género", generos, generoEditText) }
        gradoEditText.setOnClickListener { mostrarDialogoSeleccion("Grado", grados, gradoEditText) }
        unidadEditText.setOnClickListener { mostrarDialogoSeleccion("Unidad", unidades.toTypedArray(), unidadEditText) }
        colegioEditText.setOnClickListener { mostrarDialogoSeleccion("Colegio", colegios.toTypedArray(), colegioEditText) }
        edicionEditText.setOnClickListener { mostrarDialogoSeleccion("Edición", ediciones.toTypedArray(), edicionEditText) }

        confirmarButton.setOnClickListener { guardarEstudiante() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun mostrarDialogoSeleccion(titulo: String, opciones: Array<String>, campoDestino: EditText) {
        AlertDialog.Builder(this)
            .setTitle("Seleccionar $titulo")
            .setItems(opciones) { _, which ->
                campoDestino.setText(opciones[which])
            }
            .setNegativeButton("Cancelar") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
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

    private fun cargarEstudiantes() {
        lifecycleScope.launch {
            val result = estudianteServicio.listarEstudiantesActivos()
            result.onSuccess { estudiantes ->
                adapter.actualizarLista(estudiantes)
            }.onFailure { error ->
                showError("Error al cargar estudiantes: ${error.message}")
            }
        }
    }

    private fun guardarEstudiante() {
        val nombre = nombreEditText.text.toString().trim()
        val apellido = apellidoEditText.text.toString().trim()
        val tipoDocumento = tipoDocumentoEditText.text.toString().trim()
        val numeroDocumento = numeroDocumentoEditText.text.toString().trim()
        val genero = generoEditText.text.toString().trim()
        val unidad = unidadEditText.text.toString().trim()
        val colegio = colegioEditText.text.toString().trim()
        val edicion = edicionEditText.text.toString().trim()
        val grado = gradoEditText.text.toString().trim()

        if (nombre.isEmpty() || apellido.isEmpty() || tipoDocumento.isEmpty() ||
            numeroDocumento.isEmpty() || genero.isEmpty() || unidad.isEmpty() ||
            colegio.isEmpty() || grado.isEmpty()) {
            showError("Por favor, complete todos los campos")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentEstudianteDocumento != null) {
                    estudianteServicio.actualizarEstudiante(
                        currentEstudianteDocumento!!,
                        nombre,
                        apellido,
                        tipoDocumento,
                        genero,
                        unidad,
                        colegio,
                        edicion,
                        grado,
                        true
                    ).onSuccess {
                        showSuccess("Estudiante actualizado")
                        resetEditingState()
                        cargarEstudiantes()
                    }.onFailure { error ->
                        showError("Error al actualizar: ${error.message}")
                    }
                } else {
                    estudianteServicio.crearEstudiante(
                        nombre,
                        apellido,
                        tipoDocumento,
                        numeroDocumento,
                        genero,
                        unidad,
                        colegio,
                        edicion,
                        grado
                    ).onSuccess {
                        showSuccess("Estudiante creado")
                        resetEditingState()
                        cargarEstudiantes()
                        // Actualizar listas de unidades y colegios
                        cargarDatosParaSelects()
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
        currentEstudianteDocumento = null
        limpiarFormulario()
        numeroDocumentoEditText.isEnabled = true
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun limpiarFormulario() {
        nombreEditText.text.clear()
        apellidoEditText.text.clear()
        tipoDocumentoEditText.text.clear()
        numeroDocumentoEditText.text.clear()
        generoEditText.text.clear()
        unidadEditText.text.clear()
        colegioEditText.text.clear()
        edicionEditText.text.clear()
        gradoEditText.text.clear()
    }

    private fun onUpdateClick(estudiante: Estudiante) {
        isEditing = true
        currentEstudianteDocumento = estudiante.getNumeroDocumento()
        nombreEditText.setText(estudiante.getNombre())
        apellidoEditText.setText(estudiante.getApellido())
        tipoDocumentoEditText.setText(estudiante.getTipoDocumento())
        numeroDocumentoEditText.setText(estudiante.getNumeroDocumento())
        generoEditText.setText(estudiante.getGenero())
        unidadEditText.setText(estudiante.getUnidad().toInt())
        colegioEditText.setText(estudiante.getColegio())
        edicionEditText.setText(estudiante.getEdicion())
        gradoEditText.setText(estudiante.getGrado())
        numeroDocumentoEditText.isEnabled = false
    }

    private fun onDeleteClick(estudiante: Estudiante) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar este estudiante?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    estudianteServicio.desactivarEstudiante(estudiante.getNumeroDocumento())
                        .onSuccess {
                            showSuccess("Estudiante eliminado")
                            cargarEstudiantes()
                            // Actualizar listas de unidades y colegios
                            cargarDatosParaSelects()
                        }.onFailure { error ->
                            showError(error.message ?: "Error al eliminar")
                        }
                }
            }
            .setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }

    private fun onInfoClick(estudiante: Estudiante) {
        lifecycleScope.launch {
            try {
                val resultRelaciones = asistenciaEstudianteService.obtenerTodasLasRelaciones()

                resultRelaciones.onSuccess { todasRelaciones ->
                    val relacionesDelEstudiante = todasRelaciones.filter {
                        it.getEstudianteId() == estudiante.getNumeroDocumento()
                    }

                    if (relacionesDelEstudiante.isEmpty()) {
                        runOnUiThread {
                            mostrarDialogoAsistencias(emptyArray())
                        }
                        return@onSuccess
                    }

                    val resultAsistencias = asistenciaService.listarAsistenciasActivas()

                    resultAsistencias.onSuccess { todasAsistencias ->
                        val asistenciasDelEstudiante = todasAsistencias.filter { asistencia ->
                            relacionesDelEstudiante.any { rel -> rel.getAsistenciaId() == asistencia.getId() }
                        }.map { asistencia ->
                            "• ${asistencia.getTitulo()}"
                        }.toTypedArray()

                        runOnUiThread {
                            mostrarDialogoAsistencias(asistenciasDelEstudiante)
                        }
                    }.onFailure { error ->
                        runOnUiThread {
                            showError("Error al cargar asistencias: ${error.message}")
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

    private fun mostrarDialogoAsistencias(asistencias: Array<String>) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_asistencias_estudiante, null)
        val dialog = AlertDialog.Builder(this)
            .setView(dialogView)
            .create()

        val asistenciasTextView = dialogView.findViewById<TextView>(R.id.asistenciasTextView)
        val cerrarBtn = dialogView.findViewById<TextView>(R.id.btnCerrar)

        val textoFormateado = if (asistencias.isNotEmpty()) {
            asistencias.joinToString("\n")
        } else {
            "No hay asistencias registradas para este estudiante."
        }

        asistenciasTextView.text = textoFormateado

        cerrarBtn.setOnClickListener { dialog.dismiss() }

        dialog.show()
    }
}