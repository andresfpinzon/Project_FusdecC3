package com.example.fusdeckotlin.ui.adapters.administrador.brigadaAdapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada

class BrigadaAdapter(
    private var brigadas: List<Brigada>,
    private val onUpdateClick: (Brigada) -> Unit,
    private val onDeleteClick: (Brigada) -> Unit
) : RecyclerView.Adapter<BrigadaAdapter.BrigadaViewHolder>() {

    private var brigadasFiltradas: List<Brigada> = brigadas

    class BrigadaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textIdBrigada: TextView = itemView.findViewById(R.id.textViewBrigadaId)
        val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        val textUbicacion: TextView = itemView.findViewById(R.id.textViewUbicacion)
        val textComandoId: TextView = itemView.findViewById(R.id.textViewComandoId)
        val textUnidades: TextView = itemView.findViewById(R.id.textViewUnidades)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BrigadaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_brigada, parent, false)
        return BrigadaViewHolder(view)
    }

    override fun onBindViewHolder(holder: BrigadaViewHolder, position: Int) {
        val brigada = brigadasFiltradas[position]
        holder.textIdBrigada.text = brigada.getId()
        holder.textNombre.text = brigada.getNombreBrigada()
        holder.textUbicacion.text = brigada.getUbicacionBrigada()
        holder.textComandoId.text = brigada.getComandoId()
        holder.textUnidades.text = brigada.getUnidades().joinToString(", ")

        holder.updateButton.setOnClickListener { onUpdateClick(brigada) }
        holder.deleteButton.setOnClickListener { onDeleteClick(brigada) }
    }

    override fun getItemCount(): Int = brigadasFiltradas.size

    fun actualizarLista(nuevaBrigada: List<Brigada>) {
        brigadas = nuevaBrigada
        brigadasFiltradas = nuevaBrigada
        notifyDataSetChanged()
    }

    fun filter(query: String?) {
        brigadasFiltradas = if (query.isNullOrEmpty()) {
            brigadas
        } else {
            brigadas.filter {
                it.getNombreBrigada().contains(query, ignoreCase = true) ||
                        it.getUbicacionBrigada().contains(query, ignoreCase = true)
            }
        }
        notifyDataSetChanged()
    }
}