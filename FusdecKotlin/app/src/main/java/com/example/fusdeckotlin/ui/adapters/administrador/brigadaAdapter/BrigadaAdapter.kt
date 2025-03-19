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

    inner class BrigadaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        private val textUbicacion: TextView = itemView.findViewById(R.id.textViewUbicacion)
        private val textComandoId: TextView = itemView.findViewById(R.id.textViewComandoId)
        private val textUnidades: TextView = itemView.findViewById(R.id.textViewUnidades)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(brigada: Brigada) {
            textNombre.text = "Nombre: ${brigada.getNombreBrigada()}"
            textUbicacion.text = "Ubicación: ${brigada.getUbicacionBrigada()}"
            textComandoId.text = "Comando ID: ${brigada.getComandoId()}"
            textUnidades.text = "Unidades: ${brigada.getUnidades().joinToString(", ")}"

            updateButton.setOnClickListener {
                onUpdateClick(brigada)
            }

            deleteButton.setOnClickListener {
                onDeleteClick(brigada)
            }
        }
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

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BrigadaViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_brigada, parent, false)
        return BrigadaViewHolder(view)
    }

    override fun onBindViewHolder(holder: BrigadaViewHolder, position: Int) {
        holder.bind(brigadas[position])
    }

    override fun getItemCount(): Int = brigadas.size
}