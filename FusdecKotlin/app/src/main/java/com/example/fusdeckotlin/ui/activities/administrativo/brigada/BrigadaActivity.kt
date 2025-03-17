package com.example.fusdeckotlin.ui.activities.administrativo.brigada

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
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
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var brigadasRecyclerView: RecyclerView
    private lateinit var searchView: SearchView

    private val brigadas = mutableListOf<Brigada>()
    private lateinit var adapter: BrigadaAdapter

    private var isEditing: Boolean = false
    private var currentBrigadaId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_brigada)

        nombreBrigadaEditText = findViewById(R.id.nombreBrigadaEditText)
        ubicacionBrigadaEditText = findViewById(R.id.ubicacionBrigadaEditText)
        comandoIdEditText = findViewById(R.id.comandoIdEditText)
        unidadesEditText = findViewById(R.id.unidadesEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        brigadasRecyclerView = findViewById(R.id.brigadasRecyclerView)
        searchView = findViewById(R.id.searchView)

        // Configurar RecyclerView
        adapter = BrigadaAdapter(brigadas, ::onUpdateClick, ::onDeleteClick)
        brigadasRecyclerView.layoutManager = LinearLayoutManager(this)
        brigadasRecyclerView.adapter = adapter

        // Botón confirmar
        confirmarButton.setOnClickListener {
            guardarBrigada()
        }

        // Botón cancelar
        cancelarButton.setOnClickListener {
            finish()
        }

        // Configurar SearchView
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter.filter(newText)
                return false
            }
        })
    }

    private fun guardarBrigada() {
        val nombreBrigada = nombreBrigadaEditText.text.toString().trim()
        val ubicacionBrigada = ubicacionBrigadaEditText.text.toString().trim()
        val comandoId = comandoIdEditText.text.toString().trim()
        val unidades = unidadesEditText.text.toString().trim()

        if (nombreBrigada.isEmpty() || ubicacionBrigada.isEmpty() || comandoId.isEmpty() || unidades.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                BrigadaServices.actualizarBrigada(
                    brigadas,
                    currentBrigadaId!!,
                    nombreBrigada,
                    ubicacionBrigada,
                    comandoId = comandoId,
                    unidades = unidades.split(",")
                )
                Toast.makeText(this, "Brigada actualizada correctamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentBrigadaId = null
            } else {
                BrigadaServices.crearBrigada(
                    brigadas,
                    UUID.randomUUID().toString(),
                    nombreBrigada,
                    ubicacionBrigada,
                    comandoId = comandoId,
                    unidades = unidades.split(",")
                )
                Toast.makeText(this, "Brigada creada correctamente", Toast.LENGTH_SHORT).show()
            }

            adapter.notifyDataSetChanged()
            limpiarFormulario()
        } catch (e: IllegalArgumentException) {
            Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        nombreBrigadaEditText.text.clear()
        ubicacionBrigadaEditText.text.clear()
        comandoIdEditText.text.clear()
        unidadesEditText.text.clear()
    }

    private fun onUpdateClick(brigada: Brigada) {
        isEditing = true
        currentBrigadaId = brigada.getId()
        nombreBrigadaEditText.setText(brigada.getNombreBrigada())
        ubicacionBrigadaEditText.setText(brigada.getUbicacionBrigada())
        comandoIdEditText.setText(brigada.getComandoId())
        unidadesEditText.setText(brigada.getUnidades().joinToString(", "))
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