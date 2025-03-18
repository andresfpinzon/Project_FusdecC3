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
    private val colegios: MutableList<Colegio>,
    private val onUpdateClick: (Colegio) -> Unit,
    private val onDeleteClick: (Colegio) -> Unit
) : RecyclerView.Adapter<ColegioAdapter.ColegioViewHolder>(), Filterable {

    private var colegiosFiltered: MutableList<Colegio> = colegios

    inner class ColegioViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textIdColegio: TextView = itemView.findViewById(R.id.textViewColegioId)
        private val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        private val textEmail: TextView = itemView.findViewById(R.id.textViewEmail)
        private val textEstudiantes: TextView = itemView.findViewById(R.id.textViewEstudiantes)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(colegio: Colegio) {
            textIdColegio.text = "ID: ${colegio.getId()}"
            textNombre.text = "Nombre: ${colegio.getNombreColegio()}"
            textEmail.text = "Email: ${colegio.getEmailColegio()}"
            textEstudiantes.text = "Estudiantes: ${colegio.getEstudiantes().joinToString(", ")}"


            updateButton.setOnClickListener {
                onUpdateClick(colegio)
            }

            deleteButton.setOnClickListener {
                onDeleteClick(colegio)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ColegioViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_colegio, parent, false)
        return ColegioViewHolder(view)
    }

    override fun onBindViewHolder(holder: ColegioViewHolder, position: Int) {
        holder.bind(colegiosFiltered[position])
    }

    override fun getItemCount(): Int = colegiosFiltered.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val charString = constraint?.toString() ?: ""
                colegiosFiltered = if (charString.isEmpty()) {
                    colegios
                } else {
                    val filteredList = colegios.filter {
                        it.getNombreColegio().toLowerCase(Locale.ROOT).contains(charString.toLowerCase(Locale.ROOT)) ||
                                it.getEmailColegio().toLowerCase(Locale.ROOT).contains(charString.toLowerCase(Locale.ROOT))
                    }.toMutableList()
                    filteredList
                }
                val filterResults = FilterResults()
                filterResults.values = colegiosFiltered
                return filterResults
            }

            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                colegiosFiltered = results?.values as MutableList<Colegio>
                notifyDataSetChanged()
            }
        }
    }
}