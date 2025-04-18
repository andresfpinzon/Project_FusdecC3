package com.example.fusdeckotlin.ui.adapters.administrativo.unidad

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad

class UnidadAdapter(
    private var unidades: List<Unidad>,
    private val onUpdateClick: (Unidad) -> Unit,
    private val onDeleteClick: (Unidad) -> Unit,
    private val onInfoClick: (Unidad) -> Unit
) : RecyclerView.Adapter<UnidadAdapter.UnidadViewHolder>(), Filterable {

    private var unidadesFiltradas: List<Unidad> = unidades

    class UnidadViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.nombreUnidad)
        val brigadaTextView: TextView = itemView.findViewById(R.id.brigadaId)
        val usuarioTextView: TextView = itemView.findViewById(R.id.usuarioId)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UnidadViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_unidad, parent, false)
        return UnidadViewHolder(view)
    }

    override fun onBindViewHolder(holder: UnidadViewHolder, position: Int) {
        val unidad = unidadesFiltradas[position]

        holder.nombreTextView.text = unidad.getNombreUnidad()

        // Mostrar nombre de brigada si está disponible, sino mostrar ID
        holder.brigadaTextView.text = when {
            unidad.getBrigada().getNombreBrigada().isNotEmpty() -> unidad.getBrigada().getNombreBrigada()
            else -> unidad.getBrigadaId()
        }

        // Mostrar nombre de usuario si está disponible, sino mostrar ID
        holder.usuarioTextView.text = when {
            unidad.getUser().getNombreUsuario().isNotEmpty() ->
                "${unidad.getUser().getNombreUsuario()} ${unidad.getUser().getApellidoUsuario()}"
            else -> unidad.getUsuarioId()
        }

        holder.updateButton.setOnClickListener { onUpdateClick(unidad) }
        holder.deleteButton.setOnClickListener { onDeleteClick(unidad) }
        holder.infoButton.setOnClickListener { onInfoClick(unidad) }
    }

    override fun getItemCount(): Int = unidadesFiltradas.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Unidad>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(unidades)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    unidades.forEach { unidad ->
                        if (unidad.getNombreUnidad().lowercase().contains(filterPattern) ||
                            unidad.getBrigadaId().lowercase().contains(filterPattern) ||
                            unidad.getUsuarioId().lowercase().contains(filterPattern) ||
                            (unidad.getBrigada().getNombreBrigada().isNotEmpty() &&
                                    unidad.getBrigada().getNombreBrigada().lowercase().contains(filterPattern)) ||
                            (unidad.getUser().getNombreUsuario().isNotEmpty() &&
                                    "${unidad.getUser().getNombreUsuario()} ${unidad.getUser().getApellidoUsuario()}".lowercase().contains(filterPattern))
                        ) {
                            filteredList.add(unidad)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                unidadesFiltradas = results?.values as List<Unidad>
                notifyDataSetChanged()
            }
        }
    }

    fun actualizarLista(nuevasUnidades: List<Unidad>) {
        unidades = nuevasUnidades
        unidadesFiltradas = nuevasUnidades
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        unidadesFiltradas = unidades
        notifyDataSetChanged()
    }
}