package com.example.fusdeckotlin.ui.activities.administrativo.unidad

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.administrador.unidadAdapter.UnidadAdapter
import com.example.fusdeckotlin.services.administrativo.unidad.UnidadServices
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad

class UnidadActivity : AppCompatActivity() {

    private lateinit var nombreUnidadEditText: EditText
    private lateinit var brigadaUnidadEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var comandosEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var unidadesRecyclerView: RecyclerView
    private lateinit var searchViewUnidad: SearchView

    private val unidades = mutableListOf<Unidad>()
    private lateinit var adapter: UnidadAdapter

    private var isEditing: Boolean = false
    private var currentUnidadId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_unidad)

        nombreUnidadEditText = findViewById(R.id.nombreUnidadEditText)
        brigadaUnidadEditText = findViewById(R.id.brigadaUnidadEditText)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        comandosEditText = findViewById(R.id.comandosEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        estadoSwitch = findViewById(R.id.estadoUnidadSwitch)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        unidadesRecyclerView = findViewById(R.id.unidadesRecyclerView)
        searchViewUnidad = findViewById(R.id.searchViewUnidad)

        adapter = UnidadAdapter(
            unidades,
            ::onUpdateClick,
            ::onDeleteClick
        )
        unidadesRecyclerView.layoutManager = LinearLayoutManager(this)
        unidadesRecyclerView.adapter = adapter

        confirmarButton.setOnClickListener {
            guardarUnidad()
        }

        cancelarButton.setOnClickListener {
            finish()
        }

        searchViewUnidad.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter(newText)
                return false
            }
        })
    }

    private fun generarIdUnidadUnico(): String = "UNIDAD-${System.currentTimeMillis()}"

    private fun guardarUnidad() {
        val nombreUnidad = nombreUnidadEditText.text.toString().trim()
        val brigadaUnidad = brigadaUnidadEditText.text.toString().trim()
        val usuarioId = usuarioIdEditText.text.toString().trim()
        val comandos = comandosEditText.text.toString().trim().split(",").map { it.trim() }
        val estudiantes = estudiantesEditText.text.toString().trim().split(",").map { it.trim() }
        val estadoUnidad = estadoSwitch.isChecked

        if (nombreUnidad.isEmpty() || brigadaUnidad.isEmpty() || usuarioId.isEmpty() || comandos.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                UnidadServices.actualizarUnidad(
                    unidades,
                    currentUnidadId!!,
                    nombreUnidad,
                    brigadaUnidad,
                    estadoUnidad,
                    usuarioId,
                    comandos,
                    estudiantes
                )
                Toast.makeText(this, "Unidad actualizada correctamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentUnidadId = null
            } else {
                val id = generarIdUnidadUnico()
                UnidadServices.crearUnidad(
                    unidades,
                    id,
                    nombreUnidad,
                    brigadaUnidad,
                    estadoUnidad,
                    usuarioId,
                    comandos,
                    estudiantes
                )
                Toast.makeText(this, "Unidad creada correctamente", Toast.LENGTH_SHORT).show()
            }
            actualizarLista()
            limpiarFormulario()
        } catch (e: Exception) {
            Log.e("UnidadActivity", "Error al guardar unidad", e)
            Toast.makeText(this, "Error al guardar unidad: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        nombreUnidadEditText.text.clear()
        brigadaUnidadEditText.text.clear()
        usuarioIdEditText.text.clear()
        comandosEditText.text.clear()
        estudiantesEditText.text.clear()
        estadoSwitch.isChecked = false
        isEditing = false
        currentUnidadId = null
    }

    private fun onUpdateClick(unidad: Unidad) {
        isEditing = true
        currentUnidadId = unidad.getId()
        nombreUnidadEditText.setText(unidad.getNombreUnidad())
        brigadaUnidadEditText.setText(unidad.getBrigadaId())
        usuarioIdEditText.setText(unidad.getUsuarioId())
        comandosEditText.setText(unidad.getComandos().joinToString(", "))
        estudiantesEditText.setText(unidad.getEstudiantes().joinToString(", "))
        estadoSwitch.isChecked = unidad.getEstadoUnidad()
    }

    private fun onDeleteClick(unidad: Unidad) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Eliminar unidad")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta unidad?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                UnidadServices.desactivarUnidad(unidades, unidad.getId())
                actualizarLista()
                Toast.makeText(this, "Unidad eliminada correctamente", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, "Error deleting unidad: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }

        val dialog = builder.create()
        dialog.show()
    }

    private fun actualizarLista() {
        adapter.actualizarLista(UnidadServices.listarUnidadesActivas(unidades))
    }
}