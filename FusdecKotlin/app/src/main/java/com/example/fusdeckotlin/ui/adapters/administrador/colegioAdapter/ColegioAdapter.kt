package com.example.fusdeckotlin.ui.adapters.administrador.colegioAdapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.colegio.Colegio

class ColegioAdapter(
    private val colegios: MutableList<Colegio>,
    private val onUpdateClick: (Colegio) -> Unit,
    private val onDeleteClick: (Colegio) -> Unit
) : RecyclerView.Adapter<ColegioAdapter.ColegioViewHolder>() {

    private val originalColegios = colegios.toMutableList()

    inner class ColegioViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textIdColegio: TextView = itemView.findViewById(R.id.textViewColegioId)
        val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        val textEmail: TextView = itemView.findViewById(R.id.textViewEmail)
        val textEstudiantes: TextView = itemView.findViewById(R.id.textViewEstudiantes)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ColegioViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_colegio, parent, false)
        return ColegioViewHolder(view)
    }

    override fun onBindViewHolder(holder: ColegioViewHolder, position: Int) {
        val colegio = colegios[position]
        holder.textIdColegio.text = colegio.getId()
        holder.textNombre.text = colegio.getNombreColegio()
        holder.textEmail.text = colegio.getEmailColegio()
        holder.textEstudiantes.text = colegio.getEstudiantes().joinToString(", ")

        holder.updateButton.setOnClickListener { onUpdateClick(colegio) }
        holder.deleteButton.setOnClickListener { onDeleteClick(colegio) }
    }

    fun filter(query: String?) {
        colegios.clear()
        if (query.isNullOrEmpty()) {
            colegios.addAll(originalColegios)
        } else {
            colegios.addAll(originalColegios.filter { it.getNombreColegio().contains(query, ignoreCase = true) })
        }
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = colegios.size

    fun actualizarLista(nuevosColegios: List<Colegio>) {
        colegios.clear()
        colegios.addAll(nuevosColegios)
        notifyDataSetChanged()
    }
}