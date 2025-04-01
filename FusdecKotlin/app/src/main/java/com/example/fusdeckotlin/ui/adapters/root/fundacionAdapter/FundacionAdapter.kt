package com.example.fusdeckotlin.ui.adapters.root.fundacion

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.root.fundacion.Fundacion

class FundacionAdapter(
    private var fundaciones: List<Fundacion>,
    private val onUpdateClick: (Fundacion) -> Unit,
    private val onDeleteClick: (Fundacion) -> Unit
) : RecyclerView.Adapter<FundacionAdapter.FundacionViewHolder>() {

    class FundacionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.tituloTextView)

        val estudiantesTextView: TextView = itemView.findViewById(R.id.comandosTextView)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FundacionViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_fundacion, parent, false)
        return FundacionViewHolder(view)
    }

    override fun onBindViewHolder(holder: FundacionViewHolder, position: Int) {
        val fundacion = fundaciones[position]
        holder.tituloTextView.text = fundacion.getNombreFundacion()
        holder.comandosTextView.text = fundacion.getComandos().joinToString(", ")

        holder.updateButton.setOnClickListener { onUpdateClick(fundacion) }
        holder.deleteButton.setOnClickListener { onDeleteClick(fundacion) }
    }

    override fun getItemCount(): Int = fundaciones.size

    fun actualizarLista(nuevasFundacjones: List<Fundacion>) {
        fundaciones = nuevasFundaciones
        notifyDataSetChanged()
    }
}

