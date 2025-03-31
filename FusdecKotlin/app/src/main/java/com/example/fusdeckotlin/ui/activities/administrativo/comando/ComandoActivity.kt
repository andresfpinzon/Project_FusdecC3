package com.example.fusdeckotlin.ui.activities.administrativo.comando

import android.os.Bundle
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.services.administrativoService.comando.ComandoServices
import com.example.fusdeckotlin.ui.adapters.administrador.comandoAdapter.ComandoAdapter

class ComandoActivity : AppCompatActivity() {

    private lateinit var nombreComandoEditText: EditText
    private lateinit var ubicacionComandoEditText: EditText
    private lateinit var usuarioIdEditText: EditText
    private lateinit var comandosEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var estadoSwitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var comandosRecyclerView: RecyclerView
    private lateinit var searchViewComando: SearchView
    private lateinit var brigadaSpinner: Spinner

    private val comandos = mutableListOf<Comando>()
    private lateinit var adapter: ComandoAdapter

    private var isEditing: Boolean = false
    private var currentComandoId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_comando)

        nombreComandoEditText = findViewById(R.id.nombreComandoEditText)
        ubicacionComandoEditText = findViewById(R.id.ubicacionComandoEditText)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        comandosEditText = findViewById(R.id.comandosEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        estadoSwitch = findViewById(R.id.estadoComandoSwitch)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        comandosRecyclerView = findViewById(R.id.comandosRecyclerView)
        searchViewComando = findViewById(R.id.searchViewComando)
        brigadaSpinner = findViewById(R.id.brigadaSpinner)

        adapter = ComandoAdapter(
            comandos,
            ::onUpdateClick,
            ::onDeleteClick
        )
        comandosRecyclerView.layoutManager = LinearLayoutManager(this)
        comandosRecyclerView.adapter = adapter

        confirmarButton.setOnClickListener {
            guardarComando()
        }

        cancelarButton.setOnClickListener {
            finish()
        }

        searchViewComando.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter(newText)
                return false
            }
        })

        // Configurar el Spinner con datos de brigadas
        val brigadas = listOf("BRIG01", "BRIG02", "BRIG03", "BRIG04")
        val spinnerAdapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, brigadas)
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        brigadaSpinner.adapter = spinnerAdapter
    }

    private fun generarIdComandoUnico(): String = "COMANDO-${System.currentTimeMillis()}"

    private fun guardarComando() {
        val nombreComando = nombreComandoEditText.text.toString()
        val ubicacionComando = ubicacionComandoEditText.text.toString()
        val usuarioId = usuarioIdEditText.text.toString()
        val comandos = comandosEditText.text.toString()
        val estudiantes = estudiantesEditText.text.toString()
        val estadoComando = estadoSwitch.isChecked
        val brigadaSeleccionada = brigadaSpinner.selectedItem.toString()

        if (nombreComando.isEmpty() || ubicacionComando.isEmpty() || usuarioId.isEmpty() || comandos.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                ComandoServices.actualizarComando(
                    this.comandos,
                    currentComandoId!!,
                    nombreComando,
                    estadoComando,
                    ubicacionComando,
                    usuarioId,
                    listOf(brigadaSeleccionada)
                )
                Toast.makeText(this, "Comando actualizado correctamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentComandoId = null
            } else {
                val id = generarIdComandoUnico()
                ComandoServices.crearComando(
                    this.comandos,
                    id,
                    nombreComando,
                    estadoComando,
                    ubicacionComando,
                    usuarioId,
                    listOf(brigadaSeleccionada)
                )
                Toast.makeText(this, "Comando creado correctamente", Toast.LENGTH_SHORT).show()
            }
            actualizarListaComandos()
            limpiarFormulario()
        } catch (e: Exception) {
            Log.e("ComandoActivity", "Error al guardar el comando", e)
            Toast.makeText(this, "Error al guardar el comando: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        nombreComandoEditText.text.clear()
        ubicacionComandoEditText.text.clear()
        usuarioIdEditText.text.clear()
        comandosEditText.text.clear()
        estudiantesEditText.text.clear()
        estadoSwitch.isChecked = false
        brigadaSpinner.setSelection(0)
    }

    private fun onUpdateClick(comando: Comando) {
        isEditing = true
        currentComandoId = comando.getId()
        nombreComandoEditText.setText(comando.getNombreComando())
        ubicacionComandoEditText.setText(comando.getUbicacionComando())
        usuarioIdEditText.setText(comando.getFundacionId())
        comandosEditText.setText(comando.getBrigadas().joinToString(", "))
        estadoSwitch.isChecked = comando.getEstadoComando()
        val brigadaIndex = (brigadaSpinner.adapter as ArrayAdapter<String>).getPosition(comando.getBrigadas().firstOrNull())
        brigadaSpinner.setSelection(brigadaIndex)
    }

    private fun onDeleteClick(comando: Comando) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Eliminar comando")
        builder.setMessage("¿Estás seguro de que deseas eliminar el comando?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                ComandoServices.desactivarComando(this.comandos, comando.getId())
                actualizarListaComandos()
                Toast.makeText(this, "Comando eliminado correctamente", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, "Error al eliminar el comando: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }

        val dialog = builder.create()
        dialog.show()
    }

    private fun actualizarListaComandos() {
        adapter.actualizarLista(ComandoServices.listarComandosActivos(comandos))
    }
}