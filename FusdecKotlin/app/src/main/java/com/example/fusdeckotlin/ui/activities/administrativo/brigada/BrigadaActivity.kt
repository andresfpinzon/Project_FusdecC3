package com.example.fusdeckotlin.ui.activities.administrativo.brigada

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import android.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.administrador.brigadaAdapter.BrigadaAdapter
import com.example.fusdeckotlin.services.administrativoService.brigada.BrigadaServices
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import java.util.UUID

class BrigadaActivity : AppCompatActivity() {

    private lateinit var nombreBrigadaEditText: EditText
    private lateinit var ubicacionBrigadaEditText: EditText
    private lateinit var comandoIdEditText: EditText
    private lateinit var unidadesEditText: EditText
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var brigadasRecyclerView: RecyclerView
    private lateinit var searchView: SearchView

    private val brigadas = mutableListOf(
        Brigada.brigada1,
        Brigada.brigada2
    )
    private lateinit var adapter: BrigadaAdapter

    private var isEditing: Boolean = false
    private var currentBrigadaId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_brigada)

        try {
            // Initialize views
            nombreBrigadaEditText = findViewById(R.id.nombreBrigadaEditText)
            ubicacionBrigadaEditText = findViewById(R.id.ubicacionBrigadaEditText)
            comandoIdEditText = findViewById(R.id.comandoIdEditText)
            unidadesEditText = findViewById(R.id.unidadesEditText)
            estadoSwitch = findViewById(R.id.estadoSwitch)
            confirmarButton = findViewById(R.id.confirmarButton)
            cancelarButton = findViewById(R.id.cancelarButton)
            brigadasRecyclerView = findViewById(R.id.brigadasRecyclerView)
            searchView = findViewById(R.id.searchView)

            // Configure RecyclerView for brigadas
            adapter = BrigadaAdapter(brigadas, ::onUpdateClick, ::onDeleteClick)
            brigadasRecyclerView.layoutManager = LinearLayoutManager(this)
            brigadasRecyclerView.adapter = adapter

            // Confirm button
            confirmarButton.setOnClickListener {
                guardarBrigada()
            }

            // Cancel button
            cancelarButton.setOnClickListener {
                finish()
            }

            // Configure SearchView
            searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
                override fun onQueryTextSubmit(query: String?): Boolean {
                    return false
                }

                override fun onQueryTextChange(newText: String?): Boolean {
                    adapter.filter(newText)
                    return false
                }
            })
        } catch (e: Exception) {
            Log.e("BrigadaActivity", "Error initializing activity", e)
            Toast.makeText(this, "Error initializing activity: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun guardarBrigada() {
        val nombreBrigada = nombreBrigadaEditText.text.toString().trim()
        val ubicacionBrigada = ubicacionBrigadaEditText.text.toString().trim()
        val comandoId = comandoIdEditText.text.toString().trim()
        val unidades = unidadesEditText.text.toString().trim().split(",").map { it.trim() }
        val estadoBrigada = estadoSwitch.isChecked

        if (nombreBrigada.isEmpty() || ubicacionBrigada.isEmpty() || comandoId.isEmpty() || unidades.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                BrigadaServices.actualizarBrigada(
                    brigadas,
                    currentBrigadaId!!,
                    nombreBrigada = nombreBrigada,
                    ubicacionBrigada = ubicacionBrigada,
                    comandoId = comandoId,
                    unidades = unidades,
                    estadoBrigada = estadoBrigada

                )
                Toast.makeText(this, "Brigada actualizada correctamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentBrigadaId = null
            } else {
                val nuevaBrigada = BrigadaServices.crearBrigada(
                    brigadas,
                    UUID.randomUUID().toString(),
                    nombreBrigada,
                    ubicacionBrigada,
                    comandoId,
                    unidades,
                    estadoBrigada
                )
                brigadas.add(nuevaBrigada)
                Toast.makeText(this, "Brigada creada correctamente", Toast.LENGTH_SHORT).show()
            }

            adapter.notifyDataSetChanged()
            limpiarFormulario()
        } catch (e: IllegalArgumentException) {
            Log.e("BrigadaActivity", "Error saving brigada", e)
            Toast.makeText(this, "Error saving brigada: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        nombreBrigadaEditText.text.clear()
        ubicacionBrigadaEditText.text.clear()
        comandoIdEditText.text.clear()
        unidadesEditText.text.clear()
        estadoSwitch.isChecked = false
        isEditing = false
        currentBrigadaId = null
    }

    private fun onUpdateClick(brigada: Brigada) {
        isEditing = true
        currentBrigadaId = brigada.getId()
        nombreBrigadaEditText.setText(brigada.getNombreBrigada())
        ubicacionBrigadaEditText.setText(brigada.getUbicacionBrigada())
        comandoIdEditText.setText(brigada.getComandoId())
        unidadesEditText.setText(brigada.getUnidades().joinToString(", "))
        estadoSwitch.isChecked = brigada.getEstadoBrigada()
    }

    private fun onDeleteClick(brigada: Brigada) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Eliminar brigada")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta brigada?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                BrigadaServices.desactivarBrigada(brigadas, brigada.getId())
                brigadas.remove(brigada)
                adapter.notifyDataSetChanged()
                Toast.makeText(this, "Brigada eliminada correctamente", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Log.e("BrigadaActivity", "Error deleting brigada", e)
                Toast.makeText(this, "Error deleting brigada: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ ->
            dialog.dismiss()
        }

        val dialog = builder.create()
        dialog.show()
    }
}