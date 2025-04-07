package com.example.fusdeckotlin.ui.adapters.secretario.curso

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.secretario.curso.Curso

class CursoAdapter(
    private var cursos: List<Curso>,
    private val onUpdateClick: (Curso) -> Unit,
    private val onDeleteClick: (Curso) -> Unit
) : RecyclerView.Adapter<CursoAdapter.CursoViewHolder>() {

    class CursoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.tituloCurso)
        val descripcionTextView: TextView = itemView.findViewById(R.id.descripcionCurso)
        val intensidadHorariaTextView: TextView = itemView.findViewById(R.id.intensidadHorariaCurso)
        val fundacionTextView: TextView = itemView.findViewById(R.id.fundacionId)
        val edicionesTextView: TextView = itemView.findViewById(R.id.edicionesCurso)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CursoViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_curso, parent, false)
        return CursoViewHolder(view)
    }

    override fun onBindViewHolder(holder: CursoViewHolder, position: Int) {
        val curso = cursos[position]

        holder.nombreTextView.text = curso.getNombreCurso()
        holder.descripcionTextView.text = curso.getDescripcionCurso()
        holder.intensidadHorariaTextView.text = curso.getIntensidadHorariaCurso()
        holder.fundacionTextView.text = curso.getFundacionId()

        // Mostrar información de ediciones
        holder.edicionesTextView.text = curso.getEdiciones().joinToString(", ")

        holder.updateButton.setOnClickListener { onUpdateClick(curso) }
        holder.deleteButton.setOnClickListener { onDeleteClick(curso) }
    }

    override fun getItemCount(): Int = cursos.size

    fun actualizarLista(nuevosCursos: List<Curso>) {
        cursos = nuevosCursos
        notifyDataSetChanged()
    }
}