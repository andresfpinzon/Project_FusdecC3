package com.example.fusdeckotlin.ui.activities.secretario.curso

import android.app.AlertDialog
import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.services.secretario.curso.CursoServices
import com.example.fusdeckotlin.ui.adapters.secretario.curso.CursoAdapter
import models.secretario.curso.Curso
import java.text.SimpleDateFormat
import java.util.*

class CursoActivity : AppCompatActivity() {

    private lateinit var tituloCurso: EditText
    private lateinit var descripcionCurso: EditText
    private lateinit var intensidadHorariaCurso: EditText
    private lateinit var fundacionId: EditText
    private lateinit var confirmarCursoButton: Button
    private lateinit var cancelarCursoButton: Button
    private lateinit var cursosRecyclerView: RecyclerView

    private val cursos = mutableListOf(Curso.curso1, Curso.curso2, Curso.curso3)
    private lateinit var adapter: CursoAdapter

    private var isEditing: Boolean = false
    private var currentCursoId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_curso)

        tituloCurso = findViewById(R.id.tituloCurso)
        descripcionCurso = findViewById(R.id.descripcionCurso)
        intensidadHorariaCurso = findViewById(R.id.intensidadHorariaCurso)
        fundacionId = findViewById(R.id.fundacionId)
        confirmarCursoButton = findViewById(R.id.confirmarCursoButton)
        cancelarCursoButton = findViewById(R.id.cancelarCursoButton)
        cursosRecyclerView = findViewById(R.id.cursosRecyclerView)

        adapter = CursoAdapter(cursos, ::onUpdateClick, ::onDeleteClick)
        cursosRecyclerView.layoutManager = LinearLayoutManager(this)
        cursosRecyclerView.adapter = adapter

        confirmarCursoButton.setOnClickListener {
            guardarCurso()
        }

        cancelarCursoButton.setOnClickListener {
            finish()
        }
    }

    private fun generarIdUnico(): String {
        return "CURSO${cursos.size + 1}"
    }

    private fun guardarCurso() {
        val titulo = tituloCurso.text.toString().trim()
        val descripcion = descripcionCurso.text.toString().trim()
        val intensidadHoraria = intensidadHorariaCurso.text.toString().trim()
        val fundacionId = fundacionId.text.toString().trim()

        if (titulo.isEmpty() || descripcion.isEmpty() || intensidadHoraria.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        try {
            if (isEditing) {
                val curso = cursos.find { it.getId() == currentCursoId }
                curso?.setNombreCurso(titulo)
                curso?.setDescripcionCurso(descripcion)
                curso?.setIntensidadHorariaCurso(intensidadHoraria)
                curso?.setFundacionId(fundacionId)
                Toast.makeText(this, "Curso actualizado exitosamente", Toast.LENGTH_SHORT).show()
                isEditing = false
                currentCursoId = null
            } else {
                val id = generarIdUnico()
                val nuevoCurso = Curso(
                    id = id,
                    nombreCurso = titulo,
                    descripcionCurso = descripcion,
                    intensidadHorariaCurso = intensidadHoraria,
                    estadoCurso = true,
                    fundacionId = fundacionId,
                    ediciones = emptyList()
                )
                cursos.add(nuevoCurso)
                Toast.makeText(this, "Curso guardado exitosamente", Toast.LENGTH_SHORT).show()
            }

            adapter.notifyDataSetChanged()
            limpiarFormulario()
        } catch (e: IllegalArgumentException) {
            Toast.makeText(this, e.message, Toast.LENGTH_SHORT).show()
        }
    }

    private fun limpiarFormulario() {
        tituloCurso.text.clear()
        descripcionCurso.text.clear()
        intensidadHorariaCurso.text.clear()
        fundacionId.text.clear()
    }

    private fun onUpdateClick(curso: Curso) {
        isEditing = true
        currentCursoId = curso.getId()
        tituloCurso.setText(curso.getNombreCurso())
        descripcionCurso.setText(curso.getDescripcionCurso())
        intensidadHorariaCurso.setText(curso.getIntensidadHorariaCurso())
        fundacionId.setText(curso.getFundacionId())
    }

    private fun onDeleteClick(curso: Curso) {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("Confirmar eliminación")
        builder.setMessage("¿Estás seguro de que deseas eliminar este curso?")

        builder.setPositiveButton("Sí") { _, _ ->
            try {
                cursos.removeIf { it.getId() == curso.getId() }
                adapter.notifyDataSetChanged()
                Toast.makeText(this, "Curso eliminado", Toast.LENGTH_SHORT).show()
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


