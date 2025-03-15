package com.example.fusdeckotlin.ui.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia

class AsistenciaAdapter(
    private val asistencias: MutableList<Asistencia>,
    private val onUpdateClick: (Asistencia) -> Unit,
    private val onDeleteClick: (Asistencia) -> Unit
) : RecyclerView.Adapter<AsistenciaAdapter.AsistenciaViewHolder>() {

    inner class AsistenciaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tituloTextView: TextView = itemView.findViewById(R.id.tituloTextView)
        private val fechaTextView: TextView = itemView.findViewById(R.id.fechaTextView)
        private val usuarioIdTextView: TextView = itemView.findViewById(R.id.usuarioIdTextView)
        private val estudiantesTextView: TextView = itemView.findViewById(R.id.estudiantesTextView)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(asistencia: Asistencia) {
            tituloTextView.text = asistencia.getTituloAsistencia()
            fechaTextView.text = asistencia.getFechaAsistencia().toString()
            usuarioIdTextView.text = asistencia.getUsuarioId()
            estudiantesTextView.text = asistencia.getEstudiantes().joinToString(", ")

            updateButton.setOnClickListener {
                onUpdateClick(asistencia)
            }

            deleteButton.setOnClickListener {
                onDeleteClick(asistencia)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AsistenciaViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_asistencia, parent, false)
        return AsistenciaViewHolder(view)
    }

    override fun onBindViewHolder(holder: AsistenciaViewHolder, position: Int) {
        holder.bind(asistencias[position])
    }

    override fun getItemCount(): Int = asistencias.size
}