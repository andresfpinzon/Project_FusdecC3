package com.example.fusdeckotlin.ui.adapters.secretario.edicion

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import java.time.format.DateTimeFormatter

class EdicionAdapter(
    private var ediciones: List<Edicion>,
    private val onUpdateClick: (Edicion) -> Unit,
    private val onDeleteClick: (Edicion) -> Unit
) : RecyclerView.Adapter<EdicionAdapter.EdicionViewHolder>() {

    class EdicionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.tituloEdicion)
        val fechaInicioTextView: TextView = itemView.findViewById(R.id.fechaInicioEdicion)
        val fechaFinTextView: TextView = itemView.findViewById(R.id.fechaFinEdicion)
        val cursoTextView: TextView = itemView.findViewById(R.id.cursoId)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EdicionViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_edicion, parent, false)
        return EdicionViewHolder(view)
    }

    override fun onBindViewHolder(holder: EdicionViewHolder, position: Int) {
        val edicion = ediciones[position]
        val dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")

        holder.nombreTextView.text = edicion.getNombreEdicion()
        holder.fechaInicioTextView.text = edicion.getFechaInicio().format(dateFormatter)
        holder.fechaFinTextView.text = edicion.getFechaFin().format(dateFormatter)
        holder.cursoTextView.text = when {
            // Si tenemos el objeto Curso completo con nombre
            edicion.getCurso().getNombreCurso().isNotEmpty() ->
                edicion.getCurso().getNombreCurso()
            // Si solo tenemos el ID
            else -> edicion.getCursoId()
        }

        holder.updateButton.setOnClickListener { onUpdateClick(edicion) }
        holder.deleteButton.setOnClickListener { onDeleteClick(edicion) }
    }

    override fun getItemCount(): Int = ediciones.size

    fun actualizarLista(nuevasEdiciones: List<Edicion>) {
        ediciones = nuevasEdiciones
        notifyDataSetChanged()
    }
}