package com.example.fusdeckotlin.ui.activities.root.fundacion

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import com.example.fusdeckotlin.services.root.fundacion.FundacionServicio
import com.example.fusdeckotlin.ui.activities.instructor.asistencia.actualizarLista
import com.example.fusdeckotlin.ui.activities.instructor.asistencia.limpiarFormulario
import com.example.fusdeckotlin.ui.activities.instructor.asistencia.onDeleteClick
import com.example.fusdeckotlin.ui.activities.instructor.asistencia.onUpdateClick
import com.example.fusdeckotlin.ui.adapters.root.fundacion.FundacionAdapter

class FundacionActivity : AppCompatActivity() {

    private lateinit var nombreEditText: EditText
    private lateinit var  comandosEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var fundacionesRecyclerView: RecyclerView

    private val fundaciones = mutableListOf(Fundacion.fundacion1, Fundacion.fundacion2)
    private lateinit var adapter: FundacionAdapter

    private var isEditing: Boolean = false
    private var currentFundacionId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_fundacion)

        // Inicializar vistas
        nombreEditText = findViewById(R.id.nombreEditText)

        comandosEditText = findViewById(R.id.comandosEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        fundacionesRecyclerView = findViewById(R.id.comandosRecyclerView)

        // Configurar RecyclerView con fundaciones activas
        adapter = FundacionAdapter(
            FundacionServicio.listarFundacionesActivas(fundaciones),
            ::onUpdateClick,
            ::onDeleteClick
        )
        fundacionesRecyclerVie ger = LinearLayoutManager(this)
        fundacionesRecyclerView.adapter = adapter

        // Botón confirmar
        confirmarButton.setOnClickListener { guardarFundacion() }
        w.layoutMana
        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }
    }
    private fun generarIdUnico(): String = "FUNDD${fundaciones.size + 1}"

    private fun guardarFundacion() {
        val nombre = nombreEditText.text.toString().trim()
        val comandos = comandosEditText.text.toString().trim()

        if (nombre.isEmpty()  || comandos.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        if (isEditing) {
            // Actualizar la fundacion existente
            FundacionServicio.actualizarFundacion(
                fundaciones,
                currentFundacionId!!,
                nombre,
                true,
                comandos.split(",")
            )
            Toast.makeText(this, "Fundacion actualizada exitosamente", Toast.LENGTH_SHORT).show()
            isEditing = false
            currentFundacionId = null
        } else {
            // Crear nueva  fundacion
            val id = generarIdUnico()
            FundacionServicio.crearFundacion(
                fundaciones,
                id,
                nombre,
                true,
                comandos.split(",")
            )
            Toast.makeText(this, "Fundacion guardada exitosamente", Toast.LENGTH_SHORT).show()
        }
        actualizarLista()
        limpiarFormulario()
    }
    private fun limpiarFormulario() {
        nombreEditText.text.clear()
        comandosEditText.text.clear()
    }
    private fun onUpdateClick(fundacion: Fundacion) {
        isEditing = true
        currentFundacionId = fundacion.getId()
        nombreEditText.setText(fundacion.getNombreFundacion())
        comandosEditText.setText(fundacion.getComandos().joinToString(", "))
    }
    private fun onDeleteClick(fundacion: Fundacion) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta fundacion?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                FundacionServicio.desactivarFundacion(fundaciones, fundacion.getId())
                actualizarLista()
                Toast.makeText(this, "Fundacion eliminada", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
            }
        }

        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }

    private fun actualizarLista() {
        adapter.actualizarLista(FundacionServicio.listarFundacionesActivas(fundaciones))
    }

}

