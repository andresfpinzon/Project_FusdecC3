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
    private var colegios: List<Colegio>,
    private val onUpdateClick: (Colegio) -> Unit,
    private val onDeleteClick: (Colegio) -> Unit
) : RecyclerView.Adapter<ColegioAdapter.ColegioViewHolder>() {

    class ColegioViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val idTextView: TextView = itemView.findViewById(R.id.textViewColegioId)
        val nombreTextView: TextView = itemView.findViewById(R.id.textViewNombre)
        val emailTextView: TextView = itemView.findViewById(R.id.textViewEmail)
        val estudiantesTextView: TextView = itemView.findViewById(R.id.textViewEstudiantes)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ColegioViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_colegio, parent, false)
        return ColegioViewHolder(view)
    }

    override fun onBindViewHolder(holder: ColegioViewHolder, position: Int) {
        val colegio = colegios[position]
        holder.idTextView.text = colegio.getId()
        holder.nombreTextView.text = colegio.getNombreColegio()
        holder.emailTextView.text = colegio.getEmailColegio()
        holder.estudiantesTextView.text = colegio.getEstudiantes().joinToString(", ")

        holder.updateButton.setOnClickListener { onUpdateClick(colegio) }
        holder.deleteButton.setOnClickListener { onDeleteClick(colegio) }
    }

    override fun getItemCount(): Int = colegios.size

    fun actualizarLista(nuevosColegios: List<Colegio>) {
        colegios = nuevosColegios
        notifyDataSetChanged()
    }
}