package com.example.fusdeckotlin.ui.adapters.secretario

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import models.secretario.edicion.Edicion

class EdicionAdapter (
    private val ediciones: MutableList<Edicion>,
    private val onUpdateClick: (Edicion) -> Unit,
    private val onDeleteClick: (Edicion) -> Unit
) : RecyclerView.Adapter<EdicionAdapter.EdicionViewHolder>() {

    inner class EdicionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tituloEdicion: TextView = itemView.findViewById(R.id.tituloEdicion)
        private val fechaInicioEdicion: TextView = itemView.findViewById(R.id.fechaInicioEdicion)
        private val fechaFinEdicion: TextView = itemView.findViewById(R.id.fechaFinEdicion)
        private val cursoId: TextView = itemView.findViewById(R.id.cursoId)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

            fun bind(edicion: Edicion) {
                tituloEdicion.text = edicion.getTituloEdicion()
                fechaInicioEdicion.text = edicion.getFechaInicioEdicion().toString()
                fechaFinEdicion.text = edicion.getFechaFinEdicion().toString()
                cursoId.text = edicion.getCursoId()

                updateButton.setOnClickListener {
                    onUpdateClick(edicion)
                }

                deleteButton.setOnClickListener {
                    onDeleteClick(edicion)
                }
            }
        }

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EdicionViewHolder {
            val view = LayoutInflater.from(parent.context).inflate()
            return EdidionViewHolder(view)
        }

        override fun onBindViewHolder(holder: EdicionViewHolder, position: Int) {
            holder.bind(ediciones[position])
        }

        override fun getItemCount(): Int = ediciones.size
}
