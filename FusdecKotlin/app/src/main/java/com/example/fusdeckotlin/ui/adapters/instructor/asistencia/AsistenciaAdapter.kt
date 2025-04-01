package com.example.fusdeckotlin.ui.adapters.instructor.asistencia

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia

class AsistenciaAdapter(
    private var asistencias: List<Asistencia>,
    private val onUpdateClick: (Asistencia) -> Unit,
    private val onDeleteClick: (Asistencia) -> Unit
) : RecyclerView.Adapter<AsistenciaAdapter.AsistenciaViewHolder>() {

    class AsistenciaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tituloTextView: TextView = itemView.findViewById(R.id.tituloTextView)
        val fechaTextView: TextView = itemView.findViewById(R.id.fechaTextView)
        val usuarioIdTextView: TextView = itemView.findViewById(R.id.usuarioIdTextView)
        val estudiantesTextView: TextView = itemView.findViewById(R.id.estudiantesTextView)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AsistenciaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_asistencia, parent, false)
        return AsistenciaViewHolder(view)
    }

    override fun onBindViewHolder(holder: AsistenciaViewHolder, position: Int) {
        val asistencia = asistencias[position]
        holder.tituloTextView.text = asistencia.tituloAsistencia
        holder.fechaTextView.text = asistencia.fechaAsistencia.toString()
        holder.usuarioIdTextView.text = asistencia.usuarioId
        holder.estudiantesTextView.text = asistencia.estudiantes.joinToString(", ") {
            "${it.nombreEstudiante} ${it.apellidoEstudiante}"
        }

        holder.updateButton.setOnClickListener { onUpdateClick(asistencia) }
        holder.deleteButton.setOnClickListener { onDeleteClick(asistencia) }
    }

    override fun getItemCount(): Int = asistencias.size

    fun actualizarLista(nuevasAsistencias: List<Asistencia>) {
        asistencias = nuevasAsistencias
        notifyDataSetChanged()
    }
}

