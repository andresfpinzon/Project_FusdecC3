package com.example.fusdeckotlin.ui.activities.instructor.calificacion

import android.app.AlertDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.instructor.calificacion.Calificacion
import com.example.fusdeckotlin.services.instructor.calificacion.CalificacionServicio
import com.example.fusdeckotlin.ui.adapters.instructor.calificacion.CalificacionAdapter
import java.util.*

class CalificacionActivity : AppCompatActivity() {

    private lateinit var tituloEditText: EditText
    private lateinit var aprobadoSwitch: Switch
    private lateinit var usuarioIdEditText: EditText
    private lateinit var estudiantesEditText: EditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var calificacionesRecyclerView: RecyclerView

    private val calificaciones = mutableListOf(Calificacion.calificacion1, Calificacion.calificacion2)
    private lateinit var adapter: CalificacionAdapter

    private var isEditing: Boolean = false
    private var currentCalificacionId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_calificacion)

        // Inicializar vistas
        tituloEditText = findViewById(R.id.tituloEditText)
        aprobadoSwitch = findViewById(R.id.aprobadoSwitch)
        usuarioIdEditText = findViewById(R.id.usuarioIdEditText)
        estudiantesEditText = findViewById(R.id.estudiantesEditText)
        confirmarButton = findViewById(R.id.confirmarButton)
        cancelarButton = findViewById(R.id.cancelarButton)
        calificacionesRecyclerView = findViewById(R.id.calificacionesRecyclerView)

        // Configurar RecyclerView con asistencias activas
        adapter = CalificacionAdapter(
            CalificacionServicio.listarCalificacionesActivas(calificaciones),
            ::onUpdateClick,
            ::onDeleteClick
        )
        calificacionesRecyclerView.layoutManager = LinearLayoutManager(this)
        calificacionesRecyclerView.adapter = adapter

        // Configurar un listener para manejar los cambios en el estado del Switch
        aprobadoSwitch.setOnCheckedChangeListener { _, isChecked ->
            aprobadoSwitch.text = if (isChecked) "Aprobado" else "Reprobado"
        }


        // Botón confirmar
        confirmarButton.setOnClickListener { guardarCalificacion() }

        // Botón cancelar
        cancelarButton.setOnClickListener { finish() }

    }

    private fun generarIdUnico(): String = "CAL${calificaciones.size + 1}"

    private fun guardarCalificacion(){
        val titulo = tituloEditText.text.toString().trim()
        val aprobado = aprobadoSwitch.isChecked
        val usuarioId = usuarioIdEditText.text.toString().trim()
        val estudiantes = estudiantesEditText.text.toString().trim()

        if (titulo.isEmpty() || usuarioId.isEmpty() || estudiantes.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing){

                // Actualizar la calificacion existente
                CalificacionServicio.actualizarCalificacion(
                    calificaciones,
                    currentCalificacionId!!,
                    titulo,
                    aprobado,
                    usuarioId,
                    true,
                    estudiantes.split(",")
                )
                Toast.makeText(this, "Calificacion actualizada exitosamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentCalificacionId = null

            }else {
                // Crear nueva calificacion

                val  id = generarIdUnico()

                CalificacionServicio.crearCalificacion(
                    calificaciones,
                    id,
                    titulo,
                    aprobado,
                    usuarioId,
                    true,
                    estudiantes.split(",")
                )
                Toast.makeText(this, "Calificacion guardada exitosamente", Toast.LENGTH_SHORT).show()
            }
            actualizarLista()
            limpiarFormulario()
        } catch (e: IllegalArgumentException) {
            Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        tituloEditText.text.clear()
        usuarioIdEditText.text.clear()
        estudiantesEditText.text.clear()
    }

    private fun onUpdateClick(calificacion: Calificacion) {
        isEditing = true
        currentCalificacionId = calificacion.getId()
        tituloEditText.setText(calificacion.getTituloCalificacion())
        aprobadoSwitch.isChecked = calificacion.getAprobado()
        usuarioIdEditText.setText(calificacion.getUsuarioId())
        estudiantesEditText.setText(calificacion.getEstudiantes().joinToString(", "))
    }

    private fun onDeleteClick(calificacion: Calificacion){
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar esta asistencia?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                CalificacionServicio.desactivarCalificacion(calificaciones, calificacion.getId())
                actualizarLista()
                Toast.makeText(this, "Calificacion eliminada", Toast.LENGTH_SHORT).show()
            } catch (e: NoSuchElementException) {
                Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
            }
        }
        builder.setNegativeButton("No") { dialog, _ -> dialog.dismiss() }
        builder.create().show()
    }
    private fun actualizarLista() {
        adapter.actualizarLista(CalificacionServicio.listarCalificacionesActivas(calificaciones))
    }

}