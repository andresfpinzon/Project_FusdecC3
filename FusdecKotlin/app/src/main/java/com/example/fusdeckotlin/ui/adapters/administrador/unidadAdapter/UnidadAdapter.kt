package com.example.fusdeckotlin.ui.adapters.administrador.unidadAdapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad

class UnidadAdapter(
    private val unidades: MutableList<Unidad>,
    private val onUpdateClick: (Unidad) -> Unit,
    private val onDeleteClick: (Unidad) -> Unit
) : RecyclerView.Adapter<UnidadAdapter.UnidadViewHolder>() {

    private val originalUnidades = unidades.toMutableList()

    class UnidadViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textIdUnidad: TextView = itemView.findViewById(R.id.textViewUnidadId)
        val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        val textBrigada: TextView = itemView.findViewById(R.id.textViewBrigada)
        val textEstudiantes: TextView = itemView.findViewById(R.id.textViewEstudiantes)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UnidadViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_unidad, parent, false)
        return UnidadViewHolder(view)
    }

    override fun onBindViewHolder(holder: UnidadViewHolder, position: Int) {
        val unidad = unidades[position]
        holder.textIdUnidad.text = unidad.getId()
        holder.textNombre.text = unidad.getNombreUnidad()
        holder.textBrigada.text = unidad.getBrigadaId()
        holder.textEstudiantes.text = unidad.getEstudiantes().joinToString(", ")

        holder.updateButton.setOnClickListener { onUpdateClick(unidad) }
        holder.deleteButton.setOnClickListener { onDeleteClick(unidad) }
    }

    fun filter(query: String?) {
        unidades.clear()
        if (query.isNullOrEmpty()) {
            unidades.addAll(originalUnidades)
        } else {
            unidades.addAll(originalUnidades.filter { it.getNombreUnidad().contains(query, ignoreCase = true) })
        }
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = unidades.size

    fun actualizarLista(nuevasUnidades: List<Unidad>) {
        unidades.clear()
        unidades.addAll(nuevasUnidades)
        originalUnidades.clear()
        originalUnidades.addAll(nuevasUnidades)
        notifyDataSetChanged()
    }
}