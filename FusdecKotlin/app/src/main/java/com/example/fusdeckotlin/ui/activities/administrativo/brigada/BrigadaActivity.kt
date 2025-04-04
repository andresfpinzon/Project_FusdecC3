package com.example.fusdeckotlin.ui.activities.administrativo.brigada

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import android.widget.SearchView
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.administrador.brigadaAdapter.BrigadaAdapter
import com.example.fusdeckotlin.services.administrativo.brigada.BrigadaServices
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import kotlinx.coroutines.launch

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

    private val brigadaServices = BrigadaServices()
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
        estadoSwitch = findViewById(R.id.estadoSwitch)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        brigadasRecyclerView = findViewById(R.id.brigadasRecyclerView)
        searchView = findViewById(R.id.searchView)

        adapter = BrigadaAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        brigadasRecyclerView.layoutManager = LinearLayoutManager(this)
        brigadasRecyclerView.adapter = adapter

        cargarBrigadas()

        confirmarButton.setOnClickListener { guardarBrigada() }

        cancelarButton.setOnClickListener { finish() }

        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter(newText)
                return false
            }
        })
    }

    private fun cargarBrigadas() {
        lifecycleScope.launch {
            val result = brigadaServices.listarBrigadasActivas()
            result.onSuccess { brigadas ->
                adapter.actualizarLista(brigadas)
            }.onFailure { error ->
                Toast.makeText(
                    this@BrigadaActivity,
                    "Error al cargar brigadas: ${error.message}",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    private fun guardarBrigada() {
        val nombreBrigada = nombreBrigadaEditText.text.toString().trim()
        val ubicacionBrigada = ubicacionBrigadaEditText.text.toString().trim()
        val estadoBrigada = estadoSwitch.isChecked
        val comandoId = comandoIdEditText.text.toString().trim()
        val unidades = unidadesEditText.text.toString().trim().split(",").map { it.trim() }

        if (nombreBrigada.isEmpty() || ubicacionBrigada.isEmpty() || comandoId.isEmpty() || unidades.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentBrigadaId != null) {
                    brigadaServices.actualizarBrigada(
                        id = currentBrigadaId!!,
                        nombreBrigada = nombreBrigada,
                        ubicacionBrigada = ubicacionBrigada,
                        estadoBrigada = estadoBrigada,
                        comandoId = comandoId,
                        unidades = unidades
                    )
                } else {
                    brigadaServices.crearBrigada(
                        nombreBrigada = nombreBrigada,
                        ubicacionBrigada = ubicacionBrigada,
                        estadoBrigada = estadoBrigada,
                        comandoId = comandoId,
                        unidades = unidades
                    )
                }
                Toast.makeText(this@BrigadaActivity, "Operación exitosa", Toast.LENGTH_SHORT).show()
                limpiarFormulario()
                cargarBrigadas()
            } catch (e: Exception) {
                Log.e("Error", "Error al guardar brigada: ${e.message}")
                Toast.makeText(this@BrigadaActivity, "Error al guardar brigada: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun resetEditingState() {
        isEditing = false
        currentBrigadaId = null
        limpiarFormulario()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
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
            lifecycleScope.launch {
                try {
                    brigadaServices.desactivarBrigada(brigada.getId())
                    Toast.makeText(this@BrigadaActivity, "Brigada eliminada", Toast.LENGTH_SHORT).show()
                    cargarBrigadas()
                } catch (e: Exception) {
                    showError("Error al eliminar brigada: ${e.message}")
                }
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }
}