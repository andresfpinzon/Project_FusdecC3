package com.example.fusdeckotlin.ui.activities.administrativo.comando

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.adapters.administrador.comandoAdapter.ComandoAdapter
import com.example.fusdeckotlin.services.administrativoService.comando.ComandoServices
import com.example.fusdeckotlin.models.administrativo.comando.Comando

class ComandoActivity : AppCompatActivity() {

    private lateinit var nombreComandoEditText: EditText
    private lateinit var ubicacionComandoEditText: EditText
    private lateinit var brigadaSpinner: Spinner
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var comandosRecyclerView: RecyclerView
    private lateinit var searchViewComando: SearchView

    private val comandos = mutableListOf(Comando.comando1, Comando.comando2)
    private val brigadas = listOf("Brigada 1", "Brigada 2", "Brigada 3")
    private lateinit var comandoAdapter: ComandoAdapter

    private var isEditing: Boolean = false
    private var currentComandoId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comando)

        try {
            // Initialize views
            nombreComandoEditText = findViewById(R.id.nombreComandoEditText)
            ubicacionComandoEditText = findViewById(R.id.ubicacionComandoEditText)
            brigadaSpinner = findViewById(R.id.brigadaSpinner)
            estadoSwitch = findViewById(R.id.estadoSwitch)
            confirmarButton = findViewById(R.id.confirmarButton)
            cancelarButton = findViewById(R.id.cancelarButton)
            comandosRecyclerView = findViewById(R.id.comandosRecyclerView)
            searchViewComando = findViewById(R.id.searchViewComando)

            // Configure Spinner for brigades
            val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, brigadas)
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            brigadaSpinner.adapter = adapter

            // Configure RecyclerView for commands
            comandoAdapter = ComandoAdapter(
                ComandoServices.listarComandosActivos(comandos) as MutableList<Comando>,
                ::onUpdateClick,
                ::onDeleteClick)
            comandosRecyclerView.layoutManager = LinearLayoutManager(this)
            comandosRecyclerView.adapter = comandoAdapter

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
            Toast.makeText(this, "Error initializing activity: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun generarIdUnico(): String = "com-${System.currentTimeMillis()}"

    private fun guardarComando() {
        val nombreComando = nombreComandoEditText.text.toString().trim()
        val ubicacionComando = ubicacionComandoEditText.text.toString().trim()
        val brigadaSeleccionada = brigadaSpinner.selectedItem.toString()
        val estadoComando = estadoSwitch.isChecked

        if (nombreComando.isEmpty() || ubicacionComando.isEmpty() || brigadaSeleccionada.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                ComandoServices.actualizarComando(
                    comandos,
                    currentComandoId!!,
                    nombreComando,
                    estadoComando,
                    ubicacionComando,
                    brigadas = listOf(brigadaSeleccionada)
                )
                Toast.makeText(this, "Comando actualizado correctamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentComandoId = null
            } else {
                val id = generarIdUnico()
                ComandoServices.crearComando(
                    comandos,
                    id,
                    nombreComando,
                    estadoComando,
                    ubicacionComando,
                    fundacionId = "FUND01", // Assuming a default value for fundacionId
                    brigadas = listOf(brigadaSeleccionada)
                )
                Toast.makeText(this, "Comando creado correctamente", Toast.LENGTH_SHORT).show()
            }
            actualizarLista()
            limpiarFormulario()
            comandoAdapter.notifyDataSetChanged()
        } catch (e: IllegalArgumentException) {
            Log.e("ComandoActivity", "Error saving command", e)
            Toast.makeText(this, "Error saving command: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        nombreComandoEditText.text.clear()
        ubicacionComandoEditText.text.clear()
        brigadaSpinner.setSelection(0)
        estadoSwitch.isChecked = false
        isEditing = false
        currentComandoId = null
    }

    private fun onUpdateClick(comando: Comando) {
        isEditing = true
        currentComandoId = comando.getId()
        nombreComandoEditText.setText(comando.getNombreComando())
        ubicacionComandoEditText.setText(comando.getUbicacionComando())
        val brigadaIndex = brigadas.indexOf(comando.getBrigadas().firstOrNull())
        brigadaSpinner.setSelection(if (brigadaIndex >= 0) brigadaIndex else 0)
        estadoSwitch.isChecked = comando.getEstadoComando()
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

    private fun actualizarLista() {
        comandoAdapter.actualizarLista(ComandoServices.listarComandosActivos(comandos))
    }
}