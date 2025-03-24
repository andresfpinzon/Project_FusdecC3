package com.example.fusdeckotlin.ui.adapters.secretario.curso

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import models.secretario.curso.Curso

class CursoAdapter(
    private val cursos: MutableList<Curso>,
    private val onUpdateClick: (Curso) -> Unit,
    private val onDeleteClick: (Curso) -> Unit
) : RecyclerView.Adapter<CursoAdapter.CursoViewHolder>() {

    inner class CursoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val nombreCurso: TextView = itemView.findViewById(R.id.tituloCurso)
        private val descripcionCurso: TextView = itemView.findViewById(R.id.descripcionCurso)
        private val intensidadHorariaCurso: TextView = itemView.findViewById(R.id.intensidadHorariaCurso)
        private val fundacionId: TextView = itemView.findViewById(R.id.fundacionId)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(curso: Curso) {
            nombreCurso.text = curso.getNombreCurso()
            descripcionCurso.text = curso.getDescripcionCurso()
            intensidadHorariaCurso.text = curso.getIntensidadHorariaCurso()
            fundacionId.text = curso.getFundacionId()

            updateButton.setOnClickListener { onUpdateClick(curso) }
            deleteButton.setOnClickListener { onDeleteClick(curso) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CursoViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_curso, parent, false)
        return CursoViewHolder(view)
    }

    override fun onBindViewHolder(holder: CursoViewHolder, position: Int) {
        holder.bind(cursos[position])
    }

    override fun getItemCount(): Int = cursos.size
}
