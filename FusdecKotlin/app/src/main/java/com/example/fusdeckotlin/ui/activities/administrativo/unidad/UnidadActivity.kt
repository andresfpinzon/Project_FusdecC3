package com.example.fusdeckotlin.ui.activities.administrativo.unidad

import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.administrador.unidadAdapter.UnidadAdapter
import com.example.fusdeckotlin.services.administrativoService.unidad.UnidadServices
import Unidad
import java.util.UUID

class UnidadActivity : AppCompatActivity() {

    private lateinit var nombreUnidadEditText: EditText
    private lateinit var brigadaUnidadEditText: EditText
    private lateinit var estudiantesMultiAutoCompleteTextView: MultiAutoCompleteTextView
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var unidadesRecyclerView: RecyclerView
    private lateinit var searchViewUnidad: SearchView

    private val unidades = mutableListOf(
        Unidad.unidad1,
        Unidad.unidad2
    )
    private lateinit var adapter: UnidadAdapter

    private var isEditing: Boolean = false
    private var currentUnidadId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_unidad)

        nombreUnidadEditText = findViewById(R.id.nombreUnidadEditText)
        brigadaUnidadEditText = findViewById(R.id.brigadaUnidadEditText)
        estudiantesMultiAutoCompleteTextView = findViewById(R.id.estudiantesMultiAutoCompleteTextView)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        unidadesRecyclerView = findViewById(R.id.unidadesRecyclerView)
        searchViewUnidad = findViewById(R.id.searchViewUnidad)

        // Configurar RecyclerView
        adapter = UnidadAdapter(unidades,
            ::onUpdateClick,
            ::onDeleteClick
        )
        unidadesRecyclerView.layoutManager = LinearLayoutManager(this)
        unidadesRecyclerView.adapter = adapter

        // Botón confirmar
        confirmarButton.setOnClickListener {
            guardarUnidad()
        }

        // Botón cancelar
        cancelarButton.setOnClickListener {
            finish()
        }

        // Configurar SearchView
        searchViewUnidad.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter.filter(newText)
                return false
            }
        })
    }

    private fun generarIdUnidadUnico(): String = "ASIS${unidades.size + 1}"

    private fun guardarUnidad() {
        val nombreUnidad = nombreUnidadEditText.text.toString().trim()
        val brigadaUnidad = brigadaUnidadEditText.text.toString().trim()
        val estudiantes = estudiantesMultiAutoCompleteTextView.text.toString().trim().split(",").map { it.trim() }

        if (nombreUnidad.isEmpty() || brigadaUnidad.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                UnidadServices.actualizarUnidad(
                    unidades,
                    currentUnidadId!!,
                    nombreUnidad = nombreUnidad,
                    brigadaId = brigadaUnidad,
                    usuarioId = "usuarioId",
                    comandos = listOf()
                )
                Toast.makeText(this, "Unidad actualizada correctamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentUnidadId = null
            } else {
                val nuevaUnidad = UnidadServices.crearUnidad(
                    unidades,
                    UUID.randomUUID().toString(),
                    nombreUnidad,
                    true,
                    brigadaUnidad,
                    "usuarioId",
                    listOf(),
                    estudiantes
                )
                unidades.add(nuevaUnidad)
                adapter.notifyItemInserted(unidades.size - 1)
                Toast.makeText(this, "Unidad creada correctamente", Toast.LENGTH_SHORT).show()
            }

            limpiarFormulario()
        } catch (e: IllegalArgumentException) {
            Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        nombreUnidadEditText.text.clear()
        brigadaUnidadEditText.text.clear()
        estudiantesMultiAutoCompleteTextView.text.clear()
    }

    private fun onUpdateClick(unidad: Unidad) {
        isEditing = true
        currentUnidadId = unidad.getId()
        nombreUnidadEditText.setText(unidad.getNombreUnidad())
        brigadaUnidadEditText.setText(unidad.getBrigadaId())
        estudiantesMultiAutoCompleteTextView.setText(unidad.estudiantes.joinToString(", "))
    }

    private fun onDeleteClick(unidad: Unidad) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Eliminar unidad")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta unidad?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                UnidadServices.desactivarUnidad(unidades, unidad.getId())
                val position = unidades.indexOf(unidad)
                unidades.remove(unidad)
                adapter.notifyItemRemoved(position)
                Toast.makeText(this, "Unidad eliminada correctamente", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ ->
            dialog.dismiss()
        }

        val dialog = builder.create()
        dialog.show()
    }
}