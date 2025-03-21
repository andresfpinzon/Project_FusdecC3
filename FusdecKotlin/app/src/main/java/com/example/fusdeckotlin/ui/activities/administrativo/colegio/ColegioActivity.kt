package com.example.fusdeckotlin.ui.activities.administrativo.colegio

import android.os.Bundle
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
import com.example.fusdeckotlin.ui.adapters.administrador.colegioAdapter.ColegioAdapter
import com.example.fusdeckotlin.services.administrativoService.colegio.ColegioServices
import com.example.fusdeckotlin.models.administrativo.colegio.Colegio

class ColegioActivity : AppCompatActivity() {

    private lateinit var nombreColegioEditText: EditText
    private lateinit var emailColegioEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var direccionColegioEditText: EditText
    private lateinit var estadoColegioswitch: Switch
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var colegiosRecyclerView: RecyclerView
    private lateinit var searchView: SearchView

    private val colegios = mutableListOf(Colegio.colegio1, Colegio.colegio2)
    private lateinit var adapter: ColegioAdapter

    private var isEditing: Boolean = false
    private var currentColegioId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_colegio)

        nombreColegioEditText = findViewById(R.id.nombreColegioEditText)
        emailColegioEditText = findViewById(R.id.emailColegioEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        direccionColegioEditText = findViewById(R.id.direccionColegioEditText)
        estadoColegioswitch = findViewById(R.id.estadoColegioSwitch)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        colegiosRecyclerView = findViewById(R.id.colegiosRecyclerView)
        searchView = findViewById(R.id.searchViewColegio)


        // Configurar RecyclerView
        adapter = ColegioAdapter(
            colegios,
            ::onUpdateClick,
            ::onDeleteClick
        )
        colegiosRecyclerView.layoutManager = LinearLayoutManager(this)
        colegiosRecyclerView.adapter = adapter

        // Botón confirmar
        confirmarButton.setOnClickListener {
            guardarColegio()
        }

        // Botón cancelar
        cancelarButton.setOnClickListener {
            finish()
        }

        // Configurar SearchView
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                adapter.filter(query)
                return true
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                adapter.filter(newText)
                return true
            }
        })
    }

    private fun generarIdUnico(): String = "col-${colegios.size + 1}"

    private fun guardarColegio() {
        val nombreColegio = nombreColegioEditText.text.toString().trim()
        val emailColegio = emailColegioEditText.text.toString().trim()
        val estudiantes = estudiantesEditText.text.toString().trim()
        val direccionColegio = direccionColegioEditText.text.toString().trim()
        val estadoColegio = estadoColegioswitch.isChecked

        if (nombreColegio.isEmpty() || emailColegio.isEmpty() || estudiantes.isEmpty() || direccionColegio.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                ColegioServices.actualizarColegio(
                    colegios,
                    currentColegioId!!,
                    nombreColegio,
                    emailColegio,
                    estadoColegio,
                    estudiantes.split(","),
                    direccionColegio
                )
                Toast.makeText(this, "Colegio actualizado correctamente", Toast.LENGTH_SHORT).show()
                isEditing = false
            } else {
                val id = generarIdUnico()
                ColegioServices.crearColegio(
                    colegios,
                    id,
                    nombreColegio,
                    emailColegio,
                    estadoColegio,
                    estudiantes.split(","),
                    direccionColegio
                )
                Toast.makeText(this, "Colegio creado correctamente", Toast.LENGTH_SHORT).show()
            }
            actualizarLista()
            limpiarFormulario()
        } catch (e: IllegalArgumentException) {
            Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        nombreColegioEditText.text.clear()
        emailColegioEditText.text.clear()
        estudiantesEditText.text.clear()
        direccionColegioEditText.text.clear()
        estadoColegioswitch.isChecked = false

        isEditing = false
        currentColegioId = null
    }

    private fun onUpdateClick(colegio: Colegio) {
        isEditing = true
        currentColegioId = colegio.getId()
        nombreColegioEditText.setText(colegio.getNombreColegio())
        emailColegioEditText.setText(colegio.getEmailColegio())
        estudiantesEditText.setText(colegio.getEstudiantes().joinToString(", "))
        direccionColegioEditText.setText(colegio.getDireccionColegio())
        estadoColegioswitch.isChecked = colegio.getEstadoColegio()
    }

    private fun onDeleteClick(colegio: Colegio) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Eliminar colegio")
        builder.setMessage("¿Estás seguro de que deseas eliminar este colegio?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                ColegioServices.desactivarColegio(colegios, colegio.getId())
                actualizarLista()
                adapter.notifyDataSetChanged()
                Toast.makeText(this, "Colegio eliminado correctamente", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }

        val dialog = builder.create()
        dialog.show()
    }

    private fun actualizarLista() {
        adapter.actualizarLista(ColegioServices.listarColegiosActivos(colegios))
        adapter.notifyDataSetChanged()
    }
}