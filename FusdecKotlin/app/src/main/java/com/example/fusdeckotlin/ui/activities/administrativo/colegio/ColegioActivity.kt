package com.example.fusdeckotlin.ui.activities.administrativo.colegio

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.colegio.Colegio
import com.example.fusdeckotlin.services.administrativo.colegio.ColegioServices
import com.example.fusdeckotlin.ui.adapters.administrador.colegioAdapter.ColegioAdapter
import kotlinx.coroutines.launch

class ColegioActivity : AppCompatActivity() {

    private lateinit var nombreEditText: EditText
    private lateinit var emailEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var colegiosRecyclerView: RecyclerView

    private val colegioServicio = ColegioServices()
    private lateinit var adapter: ColegioAdapter

    private var isEditing: Boolean = false
    private var currentColegioId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_colegio)

        // Inicializar vistas
        nombreEditText = findViewById(R.id.nombreColegioEditText)
        emailEditText = findViewById(R.id.emailColegioEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        colegiosRecyclerView = findViewById(R.id.colegiosRecyclerView)

        // Configurar RecyclerView
        adapter = ColegioAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        colegiosRecyclerView.layoutManager = LinearLayoutManager(this)
        colegiosRecyclerView.adapter = adapter

        // Cargar colegios al iniciar
        cargarColegios()

        // Botón confirmar
        confirmarButton.setOnClickListener { guardarColegio() }

        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarColegios() {
        lifecycleScope.launch {
            val result = colegioServicio.listarColegiosActivos()
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
        val estudiantes = estudiantesEditText.text.toString().trim()

        if (nombre.isEmpty() || email.isEmpty() || estudiantes.isEmpty()) {
            showError("Por favor, complete todos los campos")
            return
        }

        lifecycleScope.launch {
            try {
                val estudiantesList = estudiantes.split(",").map { it.trim() }

                if (isEditing && currentColegioId != null) {
                    colegioServicio.actualizarColegio(
                        currentColegioId!!,
                        nombre,
                        email,
                        true,
                        estudiantesList
                    ).onSuccess {
                        showSuccess("Colegio actualizado")
                        resetEditingState()
                        cargarColegios()
                    }.onFailure { error ->
                        showError("Error al actualizar: ${error.message}")
                    }
                } else {
                    colegioServicio.crearColegio(
                        nombre,
                        email,
                        estudiantesList
                    ).onSuccess {
                        showSuccess("Colegio creado")
                        resetEditingState()
                        cargarColegios()
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
        currentColegioId = null
        limpiarFormulario()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun limpiarFormulario() {
        nombreEditText.text.clear()
        emailEditText.text.clear()
        estudiantesEditText.text.clear()
    }

    private fun onUpdateClick(colegio: Colegio) {
        isEditing = true
        currentColegioId = colegio.getId()
        nombreEditText.setText(colegio.getNombreColegio())
        emailEditText.setText(colegio.getEmailColegio())
        estudiantesEditText.setText(colegio.getEstudiantesDocumentos().joinToString(", "))
    }

    private fun onDeleteClick(colegio: Colegio) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar este colegio?")

        builder.setPositiveButton("Sí") { _, _ ->
            lifecycleScope.launch {
                val result = colegioServicio.desactivarColegio(colegio.getId())
                result.onSuccess {
                    showSuccess("Colegio eliminado")
                    cargarColegios()
                }.onFailure { error ->
                    showError(error.message ?: "Error al eliminar")
                }
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }
}