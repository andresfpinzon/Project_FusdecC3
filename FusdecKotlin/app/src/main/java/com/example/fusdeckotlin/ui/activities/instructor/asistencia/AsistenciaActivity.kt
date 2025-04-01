package com.example.fusdeckotlin.ui.activities.instructor.asistencia

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.instructor.asistencia.AsistenciaServicio
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServicio
import com.example.fusdeckotlin.ui.adapters.instructor.asistencia.AsistenciaAdapter
import kotlinx.coroutines.launch
import retrofit2.Response
import java.util.*

class AsistenciaActivity : AppCompatActivity() {

    private lateinit var tituloEditText: EditText
    private lateinit var fechaEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var estudiantesButton: Button
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var asistenciasRecyclerView: RecyclerView

    private lateinit var adapter: AsistenciaAdapter
    private val asistenciaServicio = AsistenciaServicio(RetrofitClient.asistenciaApi)
    private val estudianteServicio = EstudianteServicio(RetrofitClient.estudianteApi)

    private var estudiantesSeleccionadosIds = mutableListOf<String>()
    private var todosEstudiantes = listOf<Estudiante>()

    private var isEditing: Boolean = false
    private var currentAsistenciaId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_asistencia)

        initViews()
        setupRecyclerView()
        loadData()
        setupListeners()
    }

    private fun initViews() {
        tituloEditText = findViewById(R.id.tituloEditText)
        fechaEditText = findViewById(R.id.fechaEditText)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        estudiantesButton = findViewById(R.id.estudiantesButton)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        asistenciasRecyclerView = findViewById(R.id.asistenciasRecyclerView)
    }

    private fun setupRecyclerView() {
        adapter = AsistenciaAdapter(emptyList(), ::onUpdateClick, ::onDeleteClick)
        asistenciasRecyclerView.layoutManager = LinearLayoutManager(this)
        asistenciasRecyclerView.adapter = adapter
    }

    private fun loadData() {
        cargarAsistencias()
        cargarEstudiantes()
    }

    private fun setupListeners() {
        fechaEditText.setOnClickListener { mostrarDatePicker() }
        estudiantesButton.setOnClickListener { mostrarDialogoSeleccionEstudiantes() }
        confirmarButton.setOnClickListener { guardarAsistencia() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarEstudiantes() {
        lifecycleScope.launch {
            try {
                val response = estudianteServicio.listarEstudiantes()
                if (response.isSuccessful) {
                    todosEstudiantes = response.body() ?: emptyList()
                } else {
                    showError("Error al cargar estudiantes: ${response.code()}")
                }
            } catch (e: Exception) {
                showError("Excepción al cargar estudiantes: ${e.message}")
            }
        }
    }

    private fun cargarAsistencias() {
        lifecycleScope.launch {
            try {
                val response = asistenciaServicio.listarAsistencias()
                if (response.isSuccessful) {
                    val asistencias = response.body() ?: emptyList()
                    if (asistencias.isEmpty()) {
                        showMessage("No hay asistencias registradas")
                    }
                    adapter.actualizarLista(asistencias)
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Error desconocido"
                    showError("Error al cargar asistencias: ${response.code()} - $errorBody")
                }
            } catch (e: Exception) {
                showError("Excepción al cargar asistencias: ${e.message}")
                e.printStackTrace()
            }
        }
    }

    private fun mostrarDialogoSeleccionEstudiantes() {
        if (todosEstudiantes.isEmpty()) {
            showMessage("Cargando estudiantes...")
            cargarEstudiantes()
            return
        }

        val estudiantesArray = todosEstudiantes.map {
            "${it.nombreEstudiante} ${it.apellidoEstudiante} (${it.numeroDocumento})"
        }.toTypedArray()

        val checkedItems = BooleanArray(todosEstudiantes.size) { false }

        // Marcar los ya seleccionados
        estudiantesSeleccionadosIds.forEach { seleccionadoId ->
            val index = todosEstudiantes.indexOfFirst { it.id == seleccionadoId }
            if (index != -1) {
                checkedItems[index] = true
            }
        }

        AlertDialog.Builder(this)
            .setTitle("Seleccionar estudiantes")
            .setMultiChoiceItems(estudiantesArray, checkedItems) { _, which, isChecked ->
                checkedItems[which] = isChecked
            }
            .setPositiveButton("Aceptar") { _, _ ->
                estudiantesSeleccionadosIds.clear()
                checkedItems.forEachIndexed { index, isChecked ->
                    if (isChecked) {
                        todosEstudiantes[index].id?.let { id ->
                            estudiantesSeleccionadosIds.add(id)
                        }
                    }
                }
                actualizarBotonEstudiantes()
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun actualizarBotonEstudiantes() {
        estudiantesButton.text = if (estudiantesSeleccionadosIds.isEmpty()) {
            "Seleccionar estudiantes"
        } else {
            "${estudiantesSeleccionadosIds.size} estudiantes seleccionados"
        }
    }

    private fun mostrarDatePicker() {
        val calendar = Calendar.getInstance()
        DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                fechaEditText.setText(String.format("%04d-%02d-%02d", year, month + 1, dayOfMonth))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        ).show()
    }

    private fun guardarAsistencia() {
        val titulo = tituloEditText.text.toString().trim()
        val fecha = fechaEditText.text.toString().trim()
        val usuarioId = usuarioIdEditText.text.toString().trim()

        if (titulo.isEmpty() || fecha.isEmpty() || usuarioId.isEmpty() || estudiantesSeleccionadosIds.isEmpty()) {
            showMessage("Complete todos los campos")
            return
        }

        lifecycleScope.launch {
            try {
                val response = if (isEditing) {
                    asistenciaServicio.actualizarAsistencia(
                        id = currentAsistenciaId!!,
                        titulo = titulo,
                        fecha = fecha,
                        usuarioId = usuarioId,
                        estudiantesIds = estudiantesSeleccionadosIds
                    )
                } else {
                    asistenciaServicio.crearAsistencia(
                        titulo = titulo,
                        fecha = fecha,
                        usuarioId = usuarioId,
                        estudiantesIds = estudiantesSeleccionadosIds
                    )
                }

                if (response.isSuccessful) {
                    showMessage(if (isEditing) "Asistencia actualizada" else "Asistencia creada")
                    resetForm()
                    cargarAsistencias()
                } else {
                    handleErrorResponse(response)
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }

    private fun onUpdateClick(asistencia: Asistencia) {
        isEditing = true
        currentAsistenciaId = asistencia.id
        tituloEditText.setText(asistencia.tituloAsistencia)
        fechaEditText.setText(asistencia.fechaAsistencia)
        usuarioIdEditText.setText(asistencia.usuarioId)

        // Convertir estudiantes poblados a IDs
        estudiantesSeleccionadosIds.clear()
        asistencia.estudiantes.forEach { estudiante ->
            estudiante.id?.let { estudiantesSeleccionadosIds.add(it) }
        }
        actualizarBotonEstudiantes()
    }

    private fun onDeleteClick(asistencia: Asistencia) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar esta asistencia?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    try {
                        val response = asistenciaServicio.desactivarAsistencia(asistencia.id!!)
                        if (response.isSuccessful) {
                            showMessage("Asistencia eliminada")
                            cargarAsistencias()
                        } else {
                            handleErrorResponse(response)
                        }
                    } catch (e: Exception) {
                        showError("Error al eliminar: ${e.message}")
                    }
                }
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun resetForm() {
        isEditing = false
        currentAsistenciaId = null
        tituloEditText.text.clear()
        fechaEditText.text.clear()
        usuarioIdEditText.text.clear()
        estudiantesSeleccionadosIds.clear()
        actualizarBotonEstudiantes()
    }

    private fun handleErrorResponse(response: Response<*>) {
        val errorMsg = response.errorBody()?.string() ?: "Error desconocido"
        showError("Error del servidor: $errorMsg")
    }

    private fun showMessage(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showError(error: String) {
        Toast.makeText(this, error, Toast.LENGTH_LONG).show()
    }
}

