package com.example.fusdeckotlin.ui.activities.secretario.curso

import android.app.AlertDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.secretario.curso.Curso
import com.example.fusdeckotlin.services.secretario.curso.CursoServices
import com.example.fusdeckotlin.ui.adapters.secretario.curso.CursoAdapter
import kotlinx.coroutines.launch

class CursoActivity : AppCompatActivity() {

    private lateinit var tituloCurso: EditText
    private lateinit var descripcionCurso: EditText
    private lateinit var intensidadHorariaCurso: EditText
    private lateinit var fundacionId: EditText
    private lateinit var edicionesCurso: EditText
    private lateinit var confirmarCursoButton: Button
    private lateinit var cancelarCursoButton: Button
    private lateinit var cursosRecyclerView: RecyclerView

    private val cursoServicio = CursoServices()
    private lateinit var adapter: CursoAdapter

    private var isEditing: Boolean = false
    private var currentCursoId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_curso)

        // Inicializar vistas con tus nombres exactos
        tituloCurso = findViewById(R.id.tituloCurso)
        descripcionCurso = findViewById(R.id.descripcionCurso)
        intensidadHorariaCurso = findViewById(R.id.intensidadHorariaCurso)
        fundacionId = findViewById(R.id.fundacionId)
        edicionesCurso = findViewById(R.id.edicionesCurso)
        confirmarCursoButton = findViewById(R.id.confirmarCursoButton)
        cancelarCursoButton = findViewById(R.id.cancelarCursoButton)
        cursosRecyclerView = findViewById(R.id.cursosRecyclerView)

        // Configurar RecyclerView
        adapter = CursoAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        cursosRecyclerView.layoutManager = LinearLayoutManager(this)
        cursosRecyclerView.adapter = adapter

        // Cargar cursos al iniciar
        cargarCursos()

        // Configurar listeners de botones
        confirmarCursoButton.setOnClickListener { guardarCurso() }
        cancelarCursoButton.setOnClickListener { finish() }
    }

    private fun cargarCursos() {
        lifecycleScope.launch {
            val result = cursoServicio.listarCursosActivos()
            result.onSuccess { cursos ->
                adapter.actualizarLista(cursos)
            }.onFailure { error ->
                Toast.makeText(
                    this@CursoActivity,
                    "Error al cargar cursos: ${error.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun guardarCurso() {
        val nombre = tituloCurso.text.toString().trim()
        val descripcion = descripcionCurso.text.toString().trim()
        val intensidadHoraria = intensidadHorariaCurso.text.toString().trim()
        val fundacionIdStr = fundacionId.text.toString().trim()
        val edicionesStr = edicionesCurso.text.toString().trim()

        if (nombre.isEmpty() || descripcion.isEmpty() || intensidadHoraria.isEmpty() || fundacionIdStr.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        // Convertir string de ediciones a lista
        val edicionesList = if (edicionesStr.isNotEmpty()) {
            edicionesStr.split(",").map { it.trim() }.filter { it.isNotEmpty() }
        } else {
            emptyList()
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentCursoId != null) {
                    cursoServicio.actualizarCurso(
                        id = currentCursoId!!,
                        nombre = nombre,
                        descripcion = descripcion,
                        intensidadHoraria = intensidadHoraria,
                        fundacionId = fundacionIdStr,
                        estado = true,
                        ediciones = edicionesList
                    ).onSuccess {
                        Toast.makeText(this@CursoActivity, "Curso actualizado", Toast.LENGTH_SHORT).show()
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
                        fundacionId = fundacionIdStr,
                        ediciones = edicionesList
                    ).onSuccess {
                        Toast.makeText(this@CursoActivity, "Curso creado", Toast.LENGTH_SHORT).show()
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
        limpiarFormulario()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun limpiarFormulario() {
        tituloCurso.text.clear()
        descripcionCurso.text.clear()
        intensidadHorariaCurso.text.clear()
        fundacionId.text.clear()
        edicionesCurso.text.clear()
    }

    private fun onUpdateClick(curso: Curso) {
        isEditing = true
        currentCursoId = curso.getId()
        tituloCurso.setText(curso.getNombreCurso())
        descripcionCurso.setText(curso.getDescripcionCurso())
        intensidadHorariaCurso.setText(curso.getIntensidadHorariaCurso())
        fundacionId.setText(curso.getFundacionId())

        // Mostrar ediciones como lista separada por comas
        val edicionesIds = curso.getEdicionesIds()
        edicionesCurso.setText(edicionesIds.joinToString(", "))
    }

    private fun onDeleteClick(curso: Curso) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar este curso?")

        builder.setPositiveButton("Sí") { _, _ ->
            lifecycleScope.launch {
                val result = cursoServicio.desactivarCurso(curso.getId())
                result.onSuccess {
                    Toast.makeText(
                        this@CursoActivity,
                        "Curso eliminado",
                        Toast.LENGTH_SHORT
                    ).show()
                    cargarCursos()
                }.onFailure { error ->
                    Toast.makeText(
                        this@CursoActivity,
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


