package com.example.fusdeckotlin.ui.adapters.secretario.edicion

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import java.time.format.DateTimeFormatter

class EdicionAdapter(
    private var ediciones: List<Edicion>,
    private val onUpdateClick: (Edicion) -> Unit,
    private val onDeleteClick: (Edicion) -> Unit,
    private val onInfoClick: (Edicion) -> Unit
) : RecyclerView.Adapter<EdicionAdapter.EdicionViewHolder>(), Filterable {

    private var edicionesFiltradas: List<Edicion> = ediciones

    class EdicionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.tituloEdicion)
        val fechaInicioTextView: TextView = itemView.findViewById(R.id.fechaInicioEdicion)
        val fechaFinTextView: TextView = itemView.findViewById(R.id.fechaFinEdicion)
        val cursoTextView: TextView = itemView.findViewById(R.id.cursoId)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EdicionViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_edicion, parent, false)
        return EdicionViewHolder(view)
    }

    override fun onBindViewHolder(holder: EdicionViewHolder, position: Int) {
        val edicion = edicionesFiltradas[position]
        val dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy")

        holder.nombreTextView.text = edicion.getNombreEdicion()
        holder.fechaInicioTextView.text = edicion.getFechaInicio().format(dateFormatter)
        holder.fechaFinTextView.text = edicion.getFechaFin().format(dateFormatter)
        holder.cursoTextView.text = when {
            edicion.getCurso().getNombreCurso().isNotEmpty() -> edicion.getCurso().getNombreCurso()
            else -> edicion.getCursoId()
        }

        holder.updateButton.setOnClickListener { onUpdateClick(edicion) }
        holder.deleteButton.setOnClickListener { onDeleteClick(edicion) }
        holder.infoButton.setOnClickListener { onInfoClick(edicion) }
    }

    override fun getItemCount(): Int = edicionesFiltradas.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Edicion>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(ediciones)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    ediciones.forEach { edicion ->
                        if (edicion.getNombreEdicion().lowercase().contains(filterPattern) ||
                            edicion.getCursoId().lowercase().contains(filterPattern) ||
                            edicion.getFechaInicio().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                                .lowercase().contains(filterPattern) ||
                            edicion.getFechaFin().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                                .lowercase().contains(filterPattern) ||
                            (edicion.getCurso().getNombreCurso().isNotEmpty() &&
                                    edicion.getCurso().getNombreCurso().lowercase().contains(filterPattern))
                        ) {
                            filteredList.add(edicion)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                edicionesFiltradas = results?.values as List<Edicion>
                notifyDataSetChanged()
            }
        }
    }

    fun actualizarLista(nuevasEdiciones: List<Edicion>) {
        ediciones = nuevasEdiciones
        edicionesFiltradas = nuevasEdiciones
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        edicionesFiltradas = ediciones
        notifyDataSetChanged()
    }
}