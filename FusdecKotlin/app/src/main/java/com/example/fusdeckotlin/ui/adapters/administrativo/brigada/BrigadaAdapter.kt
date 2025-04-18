package com.example.fusdeckotlin.ui.adapters.administrativo.brigada

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada

class BrigadaAdapter(
    private var brigadas: List<Brigada>,
    private val onUpdateClick: (Brigada) -> Unit,
    private val onDeleteClick: (Brigada) -> Unit,
    private val onInfoClick: (Brigada) -> Unit
) : RecyclerView.Adapter<BrigadaAdapter.BrigadaViewHolder>(), Filterable {

    private var brigadasFiltradas: List<Brigada> = brigadas

    class BrigadaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.nombreBrigada)
        val ubicacionTextView: TextView = itemView.findViewById(R.id.ubicacionBrigada)
        val comandoTextView: TextView = itemView.findViewById(R.id.comandoIdBrigada)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BrigadaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_brigada, parent, false)
        return BrigadaViewHolder(view)
    }

    override fun onBindViewHolder(holder: BrigadaViewHolder, position: Int) {
        val brigada = brigadasFiltradas[position]

        holder.nombreTextView.text = brigada.getNombreBrigada()
        holder.ubicacionTextView.text = brigada.getUbicacionBrigada()
        holder.comandoTextView.text = when {
            brigada.getComando().getNombreComando().isNotEmpty() -> brigada.getComando().getNombreComando()
            else -> brigada.getComandoId()
        }

        holder.updateButton.setOnClickListener { onUpdateClick(brigada) }
        holder.deleteButton.setOnClickListener { onDeleteClick(brigada) }
        holder.infoButton.setOnClickListener { onInfoClick(brigada) }
    }

    override fun getItemCount(): Int = brigadasFiltradas.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Brigada>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(brigadas)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    brigadas.forEach { brigada ->
                        if (brigada.getNombreBrigada().lowercase().contains(filterPattern) ||
                            brigada.getUbicacionBrigada().lowercase().contains(filterPattern) ||
                            (brigada.getComando().getNombreComando().isNotEmpty() &&
                                    brigada.getComando().getNombreComando().lowercase().contains(filterPattern))
                        ) {
                            filteredList.add(brigada)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                brigadasFiltradas = results?.values as List<Brigada>
                notifyDataSetChanged()
            }
        }
    }

    fun actualizarLista(nuevasBrigadas: List<Brigada>) {
        brigadas = nuevasBrigadas
        brigadasFiltradas = nuevasBrigadas
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        brigadasFiltradas = brigadas
        notifyDataSetChanged()
    }
}