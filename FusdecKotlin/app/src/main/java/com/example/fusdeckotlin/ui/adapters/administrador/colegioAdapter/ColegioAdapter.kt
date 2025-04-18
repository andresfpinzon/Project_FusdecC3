package com.example.fusdeckotlin.ui.adapters.administrador.colegioAdapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.colegio.Colegio
import java.util.Locale

class ColegioAdapter(
    private var colegios: List<Colegio>,
    private val onUpdateClick: (Colegio) -> Unit,
    private val onDeleteClick: (Colegio) -> Unit,
    private val onInfoClick: (Colegio) -> Unit
) : RecyclerView.Adapter<ColegioAdapter.ColegioViewHolder>(), Filterable {

    private var colegiosFiltrados: List<Colegio> = colegios

    class ColegioViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.nombreTextView)
        val emailTextView: TextView = itemView.findViewById(R.id.emailTextView)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ColegioViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_colegio, parent, false)
        return ColegioViewHolder(view)
    }

    override fun onBindViewHolder(holder: ColegioViewHolder, position: Int) {
        val colegio = colegiosFiltrados[position]

        // Configurar datos principales
        holder.nombreTextView.text = colegio.getNombreColegio()
        holder.emailTextView.text = colegio.getEmailColegio()

        // Configurar listeners de botones
        holder.updateButton.setOnClickListener { onUpdateClick(colegio) }
        holder.deleteButton.setOnClickListener { onDeleteClick(colegio) }
        holder.infoButton.setOnClickListener { onInfoClick(colegio) }
    }

    override fun getItemCount(): Int = colegiosFiltrados.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Colegio>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(colegios)
                } else {
                    val filterPattern = constraint.toString().lowercase(Locale.getDefault()).trim()
                    colegios.forEach { colegio ->
                        if (colegio.getNombreColegio().lowercase(Locale.getDefault()).contains(filterPattern)) {
                            filteredList.add(colegio)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                colegiosFiltrados = results?.values as List<Colegio>
                notifyDataSetChanged()
            }
        }
    }

    fun actualizarLista(nuevosColegios: List<Colegio>) {
        colegios = nuevosColegios
        colegiosFiltrados = nuevosColegios
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        colegiosFiltrados = colegios
        notifyDataSetChanged()
    }
}