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
    private val brigadas: MutableList<Brigada>,
    private val onUpdateClick: (Brigada) -> Unit,
    private val onDeleteClick: (Brigada) -> Unit
) : RecyclerView.Adapter<BrigadaAdapter.BrigadaViewHolder>() {

    private val originalBrigadas = brigadas.toMutableList()

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
        val brigada = brigadas[position]
        holder.textIdBrigada.text = brigada.getId()
        holder.textNombre.text = brigada.getNombreBrigada()
        holder.textUbicacion.text = brigada.getUbicacionBrigada()
        holder.textComandoId.text = brigada.getComandoId()
        holder.textUnidades.text = brigada.getUnidades().joinToString(", ")

        holder.updateButton.setOnClickListener { onUpdateClick(brigada) }
        holder.deleteButton.setOnClickListener { onDeleteClick(brigada) }
    }

    fun filter(query: String?) {
        brigadas.clear()
        if (query.isNullOrEmpty()) {
            brigadas.addAll(originalBrigadas)
        } else {
            brigadas.addAll(originalBrigadas.filter { it.getNombreBrigada().contains(query, ignoreCase = true) })
        }
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = brigadas.size

    fun actualizarLista(nuevasBrigadas: List<Brigada>) {
        brigadas.clear()
        brigadas.addAll(nuevasBrigadas)
        notifyDataSetChanged()
    }
}