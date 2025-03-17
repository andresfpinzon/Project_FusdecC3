package com.example.fusdeckotlin.ui.adapters.administrador.brigadaAdapter

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
import java.util.Locale

class BrigadaAdapter(
    private val brigadas: MutableList<Brigada>,
    private val onUpdateClick: (Brigada) -> Unit,
    private val onDeleteClick: (Brigada) -> Unit
) : RecyclerView.Adapter<BrigadaAdapter.BrigadaViewHolder>(), Filterable {

    private var brigadasFiltered: MutableList<Brigada> = brigadas

    inner class BrigadaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textIdBrigada: TextView = itemView.findViewById(R.id.textViewBrigadaId)
        private val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        private val textUbicacion: TextView = itemView.findViewById(R.id.textViewUbicacion)
        private val textComandoId: TextView = itemView.findViewById(R.id.textViewComandoId)
        private val textUnidades: TextView = itemView.findViewById(R.id.textViewUnidades)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(brigada: Brigada) {
            textIdBrigada.text = "ID: ${brigada.getId()}"
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

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BrigadaViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_brigada, parent, false)
        return BrigadaViewHolder(view)
    }

    override fun onBindViewHolder(holder: BrigadaViewHolder, position: Int) {
        holder.bind(brigadasFiltered[position])
    }

    override fun getItemCount(): Int = brigadasFiltered.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val charString = constraint?.toString() ?: ""
                brigadasFiltered = if (charString.isEmpty()) {
                    brigadas
                } else {
                    val filteredList = brigadas.filter {
                        it.getNombreBrigada().toLowerCase(Locale.ROOT).contains(charString.toLowerCase(Locale.ROOT)) ||
                                it.getUbicacionBrigada().toLowerCase(Locale.ROOT).contains(charString.toLowerCase(Locale.ROOT))
                    }.toMutableList()
                    filteredList
                }
                val filterResults = FilterResults()
                filterResults.values = brigadasFiltered
                return filterResults
            }

            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                brigadasFiltered = results?.values as MutableList<Brigada>
                notifyDataSetChanged()
            }
        }
    }
}