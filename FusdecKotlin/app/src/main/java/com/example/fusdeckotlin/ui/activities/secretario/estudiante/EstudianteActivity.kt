package com.example.fusdeckotlin.ui.activities.secretario.estudiante

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
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServices
import com.example.fusdeckotlin.ui.adapters.secretario.estudiante.EstudianteAdapter
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.*

class EstudianteActivity : AppCompatActivity() {

    private lateinit var nombreEditText: EditText
    private lateinit var apellidoEditText: EditText
    private lateinit var correoEditText: EditText
    private lateinit var tipoDocumentoEditText: EditText
    private lateinit var numeroDocumentoEditText: EditText
    private lateinit var fechaNacimientoEditText: EditText
    private lateinit var generoEditText: EditText
    private lateinit var unidadIdEditText: EditText
    private lateinit var colegioIdEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var estudiantesRecyclerView: RecyclerView

    private val estudianteServicio = EstudianteServices()
    private lateinit var adapter: EstudianteAdapter

    private var isEditing: Boolean = false
    private var currentEstudianteId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_estudiante)

        // Inicializar vistas
        nombreEditText = findViewById(R.id.nombreEditText)
        apellidoEditText = findViewById(R.id.apellidoEditText)
        correoEditText = findViewById(R.id.correoEditText)
        tipoDocumentoEditText = findViewById(R.id.tipoDocumentoEditText)
        numeroDocumentoEditText = findViewById(R.id.numeroDocumentoEditText)
        fechaNacimientoEditText = findViewById(R.id.fechaNacimientoEditText)
        generoEditText = findViewById(R.id.generoEditText)
        unidadIdEditText = findViewById(R.id.unidadIdEditText)
        colegioIdEditText = findViewById(R.id.colegioIdEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        estudiantesRecyclerView = findViewById(R.id.estudiantesRecyclerView)

        // Configurar RecyclerView
        adapter = EstudianteAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        estudiantesRecyclerView.layoutManager = LinearLayoutManager(this)
        estudiantesRecyclerView.adapter = adapter

        // Cargar estudiantes al iniciar
        cargarEstudiantes()

        // Configurar DatePicker
        fechaNacimientoEditText.setOnClickListener { mostrarDatePicker() }

        // Botón confirmar
        confirmarButton.setOnClickListener { guardarEstudiante() }

        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarEstudiantes() {
        lifecycleScope.launch {
            val result = estudianteServicio.listarEstudiantesActivos()
            result.onSuccess { estudiantes ->
                adapter.actualizarLista(estudiantes)
            }.onFailure { error ->
                Toast.makeText(
                    this@EstudianteActivity,
                    "Error al cargar estudiantes: ${error.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun mostrarDatePicker() {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val selectedDate = LocalDate.of(year, month + 1, dayOfMonth)
                fechaNacimientoEditText.setText(selectedDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")))
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        )
        datePicker.show()
    }

    private fun guardarEstudiante() {
        val nombre = nombreEditText.text.toString().trim()
        val apellido = apellidoEditText.text.toString().trim()
        val correo = correoEditText.text.toString().trim()
        val tipoDocumento = tipoDocumentoEditText.text.toString().trim()
        val numeroDocumento = numeroDocumentoEditText.text.toString().trim()
        val fechaNacimientoStr = fechaNacimientoEditText.text.toString().trim()
        val genero = generoEditText.text.toString().trim()
        val unidadId = unidadIdEditText.text.toString().trim()
        val colegioId = colegioIdEditText.text.toString().trim()

        if (nombre.isEmpty() || apellido.isEmpty() || correo.isEmpty() || tipoDocumento.isEmpty() ||
            numeroDocumento.isEmpty() || fechaNacimientoStr.isEmpty() || genero.isEmpty() ||
            unidadId.isEmpty() || colegioId.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val fechaNacimiento = LocalDate.parse(fechaNacimientoStr, DateTimeFormatter.ofPattern("yyyy/MM/dd"))

                if (isEditing && currentEstudianteId != null) {
                    estudianteServicio.actualizarEstudiante(
                        currentEstudianteId!!,
                        nombre,
                        apellido,
                        tipoDocumento,
                        fechaNacimiento,
                        genero,
                        unidadId,
                        colegioId,
                        true
                    ).onSuccess {
                        Toast.makeText(this@EstudianteActivity, "Estudiante actualizado", Toast.LENGTH_SHORT).show()
                        resetEditingState()
                        cargarEstudiantes()
                    }.onFailure { error ->
                        showError("Error al actualizar: ${error.message}")
                    }
                } else {
                    estudianteServicio.crearEstudiante(
                        nombre,
                        apellido,
                        correo,
                        tipoDocumento,
                        numeroDocumento,
                        fechaNacimiento,
                        genero,
                        unidadId,
                        colegioId
                    ).onSuccess {
                        Toast.makeText(this@EstudianteActivity, "Estudiante creado", Toast.LENGTH_SHORT).show()
                        resetEditingState()
                        cargarEstudiantes()
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
        currentEstudianteId = null
        limpiarFormulario()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun limpiarFormulario() {
        nombreEditText.text.clear()
        apellidoEditText.text.clear()
        correoEditText.text.clear()
        tipoDocumentoEditText.text.clear()
        numeroDocumentoEditText.text.clear()
        fechaNacimientoEditText.text.clear()
        generoEditText.text.clear()
        unidadIdEditText.text.clear()
        colegioIdEditText.text.clear()
    }

    private fun onUpdateClick(estudiante: Estudiante) {
        isEditing = true
        currentEstudianteId = estudiante.getId()
        nombreEditText.setText(estudiante.getNombreEstudiante())
        apellidoEditText.setText(estudiante.getApellidoEstudiante())
        correoEditText.setText(estudiante.getCorreoEstudiante())
        tipoDocumentoEditText.setText(estudiante.getTipoDocumento())
        numeroDocumentoEditText.setText(estudiante.getNumeroDocumento())
        fechaNacimientoEditText.setText(
            estudiante.getFechaNacimiento().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"))
        )
        generoEditText.setText(estudiante.getGeneroEstudiante())
        unidadIdEditText.setText(estudiante.getUnidadId())
        colegioIdEditText.setText(estudiante.getColegioId())
    }

    private fun onDeleteClick(estudiante: Estudiante) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar este estudiante?")

        builder.setPositiveButton("Sí") { _, _ ->
            lifecycleScope.launch {
                val result = estudianteServicio.desactivarEstudiante(estudiante.getId())
                result.onSuccess {
                    Toast.makeText(
                        this@EstudianteActivity,
                        "Estudiante eliminado",
                        Toast.LENGTH_SHORT
                    ).show()
                    cargarEstudiantes()
                }.onFailure { error ->
                    Toast.makeText(
                        this@EstudianteActivity,
                        error.message ?: "Error al eliminar",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }
}