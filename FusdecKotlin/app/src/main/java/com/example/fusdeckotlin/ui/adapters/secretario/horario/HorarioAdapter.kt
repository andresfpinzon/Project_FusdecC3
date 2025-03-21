package com.example.fusdeckotlin.ui.adapters.secretario.horario

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import models.secretario.horario.Horario

class HorarioAdapter(
    private val horarios: MutableList<Horario>,
    private val onUpdateClick: (Horario) -> Unit,
    private val onDeleteClick: (Horario) -> Unit
) : RecyclerView.Adapter<HorarioAdapter.HorarioViewHolder>() {

    inner class HorarioViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tituloHorario: TextView = itemView.findViewById(R.id.tituloHorario)
        private val horaInicio: TextView = itemView.findViewById(R.id.horaInicio)
        private val horaFin: TextView = itemView.findViewById(R.id.horaFin)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(horario: Horario) {
            tituloHorario.text = horario.tituloHorario
            horaInicio.text = horario.horaInicio
            horaFin.text = horario.horaFin

            updateButton.setOnClickListener { onUpdateClick(horario) }
            deleteButton.setOnClickListener { onDeleteClick(horario) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HorarioViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_horario, parent, false)
        return HorarioViewHolder(view)
    }

    override fun onBindViewHolder(holder: HorarioViewHolder, position: Int) {
        holder.bind(horarios[position])
    }

    override fun getItemCount(): Int = horarios.size
}
