package com.example.fusdeckotlin.ui.adapters.administrador.unidadAdapter

import Unidad
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import android.widget.Filter
import android.widget.Filterable

class UnidadAdapter(
    private val unidades: MutableList<Unidad>,
    private val onUpdateClick: (Unidad) -> Unit,
    private val onDeleteClick: (Unidad) -> Unit
) : RecyclerView.Adapter<UnidadAdapter.UnidadViewHolder>(), Filterable {

    private var unidadesFiltradas: MutableList<Unidad> = unidades.toMutableList()

    inner class UnidadViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textIdUnidad: TextView = itemView.findViewById(R.id.textViewUnidadId)
        private val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        private val textBrigada: TextView = itemView.findViewById(R.id.textViewBrigada)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(unidad: Unidad) {
            textIdUnidad.text = "ID: ${unidad.getId()}"
            textNombre.text = "Nombre: ${unidad.getNombreUnidad()}"
            textBrigada.text = "Brigada: ${unidad.getBrigadaId()}"

            updateButton.setOnClickListener {
                onUpdateClick(unidad)
            }

            deleteButton.setOnClickListener {
                onDeleteClick(unidad)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UnidadViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_unidad, parent, false)
        return UnidadViewHolder(view)
    }

    override fun onBindViewHolder(holder: UnidadViewHolder, position: Int) {
        holder.bind(unidadesFiltradas[position])
    }

    override fun getItemCount(): Int = unidadesFiltradas.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val query = constraint?.toString()?.lowercase() ?: ""
                val filteredList = if (query.isEmpty()) {
                    unidades
                } else {
                    unidades.filter {
                        it.getNombreUnidad().lowercase().contains(query) ||
                                it.getBrigadaId().lowercase().contains(query)
                    }.toMutableList()
                }
                return FilterResults().apply { values = filteredList }
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                unidadesFiltradas = results?.values as MutableList<Unidad>
                notifyDataSetChanged()
            }
        }
    }
}