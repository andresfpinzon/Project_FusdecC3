package com.example.fusdeckotlin.ui.activities.secretario.estudiante

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServicio
import com.example.fusdeckotlin.ui.adapters.secretario.estudiante.EstudianteAdapter
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
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var estudiantesRecyclerView: RecyclerView

    private val estudiantes = mutableListOf(Estudiante.estudiante1, Estudiante.estudiante2, Estudiante.estudiante3)
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
        estadoSwitch = findViewById(R.id.estadoSwitch)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        estudiantesRecyclerView = findViewById(R.id.estudiantesRecyclerView)

        // Configurar RecyclerView con estudiantes activos
        adapter = EstudianteAdapter(
            EstudianteServicio.listarEstudiantes(estudiantes),
            ::onUpdateClick,
            ::onDeleteClick
        )
        estudiantesRecyclerView.layoutManager = LinearLayoutManager(this)
        estudiantesRecyclerView.adapter = adapter

        // Configurar un listener para manejar los cambios en el estado del Switch
        estadoSwitch.setOnCheckedChangeListener { _, isChecked ->
            estadoSwitch.text = if (isChecked) "Activo" else "Inactivo"
        }

        // Botón confirmar
        confirmarButton.setOnClickListener { guardarEstudiante() }

        // Configurar DatePicker
        fechaNacimientoEditText.setOnClickListener { mostrarDatePicker() }

        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }
    }

    private fun generarIdUnico(): String = "EST${estudiantes.size + 1}"

    private fun mostrarDatePicker() {
        val calendar = Calendar.getInstance()
        val datePicker = DatePickerDialog(
            this,
            { _, year, month, dayOfMonth ->
                val selectedDate = LocalDate.of(year, month + 1, dayOfMonth)
                val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                fechaNacimientoEditText.setText(selectedDate.format(formatter))
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
        val estado = estadoSwitch.isChecked

        if (nombre.isEmpty() || apellido.isEmpty() || correo.isEmpty() || tipoDocumento.isEmpty() || numeroDocumento.isEmpty() || fechaNacimientoStr.isEmpty() || genero.isEmpty() || unidadId.isEmpty() || colegioId.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
            val fechaNacimiento = LocalDate.parse(fechaNacimientoStr, formatter)

            if (isEditing) {
                // Actualizar el estudiante existente
                EstudianteServicio.actualizarEstudiante(
                    estudiantes,
                    currentEstudianteId!!,
                    nombre,
                    apellido,
                    tipoDocumento,
                    fechaNacimiento,
                    genero,
                    unidadId,
                    colegioId,
                    estado
                )
                Toast.makeText(this, "Estudiante actualizado exitosamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentEstudianteId = null
            } else {
                // Crear nuevo estudiante
                val id = generarIdUnico()

                EstudianteServicio.crearEstudiante(
                    estudiantes,
                    id,
                    nombre,
                    apellido,
                    correo,
                    tipoDocumento,
                    numeroDocumento,
                    fechaNacimiento,
                    genero,
                    unidadId,
                    colegioId,
                    estado,
                    emptyList(),
                    emptyList(),
                    emptyList(),
                    emptyList()
                )
                Toast.makeText(this, "Estudiante guardado exitosamente", Toast.LENGTH_SHORT).show()
            }
            actualizarLista()
            limpiarFormulario()
        } catch (e: Exception) {
            Toast.makeText(this, "Error en el formato de la fecha", Toast.LENGTH_SHORT).show()
        }
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
        fechaNacimientoEditText.setText(estudiante.getFechaNacimiento().toString())
        generoEditText.setText(estudiante.getGeneroEstudiante())
        unidadIdEditText.setText(estudiante.getUnidadId())
        colegioIdEditText.setText(estudiante.getColegioId())
        estadoSwitch.isChecked = estudiante.getEstadoEstudiante()
    }

    private fun onDeleteClick(estudiante: Estudiante) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar este estudiante?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                EstudianteServicio.desactivarEstudiante(estudiantes, estudiante.getId())
                actualizarLista()
                Toast.makeText(this, "Estudiante eliminado", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
            }
        }
        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }

    private fun actualizarLista() {
        adapter.actualizarLista(EstudianteServicio.listarEstudiantes(estudiantes))
    }
}