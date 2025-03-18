package com.example.fusdeckotlin.ui.activities.administrativo.comando

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.administrador.comandoAdapter.ComandoAdapter
import com.example.fusdeckotlin.services.administrativoService.comando.ComandoServices
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.ui.adapters.administrador.brigadaAdapter.BrigadaAdapter
import java.util.UUID

class ComandoActivity : AppCompatActivity() {

    private lateinit var nombreComandoEditText: EditText
    private lateinit var ubicacionComandoEditText: EditText
    private lateinit var brigadaEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var addBrigadaButton: Button
    private lateinit var comandosRecyclerView: RecyclerView
    private lateinit var brigadasRecyclerView: RecyclerView
    private lateinit var searchViewComando: SearchView

    private val comandos = mutableListOf<Comando>()
    private val brigadas = mutableListOf<String>()
    private lateinit var comandoAdapter: ComandoAdapter
    private lateinit var brigadaAdapter: BrigadaAdapter

    private var isEditing: Boolean = false
    private var currentComandoId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comando)

        try {
            // Initialize views
            nombreComandoEditText = findViewById(R.id.nombreComandoEditText)
            ubicacionComandoEditText = findViewById(R.id.ubicacionComandoEditText)
            brigadaEditText = findViewById(R.id.brigadaEditText)
            confirmarButton = findViewById(R.id.confirmarButton)
            cancelarButton = findViewById(R.id.cancelarButton)
            addBrigadaButton = findViewById(R.id.addBrigadaButton)
            comandosRecyclerView = findViewById(R.id.comandosRecyclerView)
            brigadasRecyclerView = findViewById(R.id.brigadasRecyclerView)
            searchViewComando = findViewById(R.id.searchViewComando)

            // Configure RecyclerView for commands
            comandoAdapter = ComandoAdapter(comandos, ::onUpdateClick, ::onDeleteClick)
            comandosRecyclerView.layoutManager = LinearLayoutManager(this)
            comandosRecyclerView.adapter = comandoAdapter

            // Configure RecyclerView for brigades
            brigadaAdapter = BrigadaAdapter(
                brigadas, ::onDeleteBrigadaClick,
                onDeleteClick = { brigada -> brigadas.remove(brigada) }
            )
            brigadasRecyclerView.layoutManager = LinearLayoutManager(this)
            brigadasRecyclerView.adapter = brigadaAdapter

            // Add brigade button
            addBrigadaButton.setOnClickListener {
                val brigada = brigadaEditText.text.toString().trim()
                if (brigada.isNotEmpty()) {
                    brigadas.add(brigada)
                    brigadaAdapter.notifyDataSetChanged()
                    brigadaEditText.text.clear()
                } else {
                    Toast.makeText(this, "Por favor, ingrese el nombre de la brigada", Toast.LENGTH_SHORT).show()
                }
            }

            // Confirm button
            confirmarButton.setOnClickListener {
                guardarComando()
            }

            // Cancel button
            cancelarButton.setOnClickListener {
                finish()
            }

            // Configure SearchView
            searchViewComando.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
                override fun onQueryTextSubmit(query: String?): Boolean {
                    return false
                }

                override fun onQueryTextChange(newText: String?): Boolean {
                    comandoAdapter.filter(newText)
                    return false
                }
            })
        } catch (e: Exception) {
            Log.e("ComandoActivity", "Error initializing activity", e)
            Toast.makeText(this, "Error initializing activity: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun guardarComando() {
        val nombreComando = nombreComandoEditText.text.toString().trim()
        val ubicacionComando = ubicacionComandoEditText.text.toString().trim()

        if (nombreComando.isEmpty() || ubicacionComando.isEmpty() || brigadas.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                ComandoServices.actualizarComando(
                    comandos,
                    currentComandoId!!,
                    nombreComando = nombreComando,
                    ubicacionComando = ubicacionComando,
                    brigadas = brigadas
                )
                Toast.makeText(this, "Comando actualizado correctamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentComandoId = null
            } else {
                ComandoServices.crearComando(
                    comandos,
                    UUID.randomUUID().toString(),
                    nombreComando,
                    true,
                    ubicacionComando,
                    "fundacionId",
                    brigadas
                )
                Toast.makeText(this, "Comando creado correctamente", Toast.LENGTH_SHORT).show()
            }

            comandoAdapter.notifyDataSetChanged()
            limpiarFormulario()
        } catch (e: IllegalArgumentException) {
            Log.e("ComandoActivity", "Error saving command", e)
            Toast.makeText(this, "Error saving command: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        nombreComandoEditText.text.clear()
        ubicacionComandoEditText.text.clear()
        brigadaEditText.text.clear()
        brigadas.clear()
        brigadaAdapter.notifyDataSetChanged()
    }

    private fun onUpdateClick(comando: Comando) {
        isEditing = true
        currentComandoId = comando.getId()
        nombreComandoEditText.setText(comando.getNombreComando())
        ubicacionComandoEditText.setText(comando.getUbicacionComando())
        brigadas.clear()
        brigadas.addAll(comando.getBrigadas())
        brigadaAdapter.notifyDataSetChanged()
    }

    private fun onDeleteClick(comando: Comando) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Eliminar comando")
        builder.setMessage("¿Estás seguro de que deseas eliminar este comando?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                ComandoServices.desactivarComando(comandos, comando.getId())
                comandos.remove(comando)
                comandoAdapter.notifyDataSetChanged()
                Toast.makeText(this, "Comando eliminado correctamente", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Log.e("ComandoActivity", "Error deleting command", e)
                Toast.makeText(this, "Error deleting command: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ ->
            dialog.dismiss()
        }

        val dialog = builder.create()
        dialog.show()
    }

    private fun onDeleteBrigadaClick(brigada: String) {
        brigadas.remove(brigada)
        brigadaAdapter.notifyDataSetChanged()
    }
}

