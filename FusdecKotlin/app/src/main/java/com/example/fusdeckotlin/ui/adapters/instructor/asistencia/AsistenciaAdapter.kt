package com.example.fusdeckotlin.ui.adapters.instructor.asistencia

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import java.time.format.DateTimeFormatter

class AsistenciaAdapter(
    private var asistencias: List<Asistencia>,
    private val onUpdateClick: (Asistencia) -> Unit,
    private val onDeleteClick: (Asistencia) -> Unit,
    private val onInfoClick: (Asistencia) -> Unit
) : RecyclerView.Adapter<AsistenciaAdapter.AsistenciaViewHolder>(), Filterable {

    private var asistenciasFiltradas: List<Asistencia> = asistencias

    class AsistenciaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tituloTextView: TextView = itemView.findViewById(R.id.tituloTextView)
        val fechaTextView: TextView = itemView.findViewById(R.id.fechaTextView)
        val usuarioIdTextView: TextView = itemView.findViewById(R.id.usuarioIdTextView)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AsistenciaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_asistencia, parent, false)
        return AsistenciaViewHolder(view)
    }

    override fun onBindViewHolder(holder: AsistenciaViewHolder, position: Int) {
        val asistencia = asistenciasFiltradas[position]

        holder.tituloTextView.text = asistencia.getTitulo()
        holder.fechaTextView.text = asistencia.getFecha()
            .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
        holder.usuarioIdTextView.text = asistencia.getUsuarioId()

        holder.updateButton.setOnClickListener { onUpdateClick(asistencia) }
        holder.deleteButton.setOnClickListener { onDeleteClick(asistencia) }
        holder.infoButton.setOnClickListener { onInfoClick(asistencia) }
    }

    override fun getItemCount(): Int = asistenciasFiltradas.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Asistencia>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(asistencias)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    asistencias.forEach { asistencia ->
                        if (asistencia.getTitulo().lowercase().contains(filterPattern) ||
                            asistencia.getUsuarioId().lowercase().contains(filterPattern) ||
                            asistencia.getFecha().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                                .lowercase().contains(filterPattern)
                        ) {
                            filteredList.add(asistencia)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                asistenciasFiltradas = results?.values as List<Asistencia>
                notifyDataSetChanged()
            }
        }
    }

    fun actualizarLista(nuevasAsistencias: List<Asistencia>) {
        asistencias = nuevasAsistencias
        asistenciasFiltradas = nuevasAsistencias
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        asistenciasFiltradas = asistencias
        notifyDataSetChanged()
    }
}

