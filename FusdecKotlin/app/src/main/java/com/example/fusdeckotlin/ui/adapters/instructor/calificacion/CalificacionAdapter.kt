package com.example.fusdeckotlin.ui.adapters.instructor.calificacion

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.instructor.calificacion.Calificacion

class CalificacionAdapter(
    private var calificaciones: List<Calificacion>,
    private val onUpdateClick: (Calificacion) -> Unit,
    private val onDeleteClick: (Calificacion) -> Unit
) : RecyclerView.Adapter<CalificacionAdapter.CalificacionViewHolder>() {

    class CalificacionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tituloTextView: TextView = itemView.findViewById(R.id.tituloTextView)
        val aprobadoTextView: TextView = itemView.findViewById(R.id.aprobadoTextView)
        val usuarioIdTextView: TextView = itemView.findViewById(R.id.usuarioIdTextView)
        val estudiantesTextView: TextView = itemView.findViewById(R.id.estudiantesTextView)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CalificacionViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_calificacion, parent, false)
        return CalificacionViewHolder(view)
    }

    override fun onBindViewHolder(holder: CalificacionViewHolder, position: Int) {
        val calificacion = calificaciones[position]
        holder.tituloTextView.text = calificacion.getTituloCalificacion()
        holder.aprobadoTextView.text = if (calificacion.getAprobado()) "Aprobado" else "Reprobado"
        holder.usuarioIdTextView.text = calificacion.getUsuarioId()

        // Mostrar información de estudiantes según lo disponible
        holder.estudiantesTextView.text = when {
            // Si tenemos objetos completos de estudiantes, mostrar nombres
            calificacion.getEstudiantes().isNotEmpty() &&
                    calificacion.getEstudiantes().first().getNombreEstudiante().isNotEmpty() -> {
                calificacion.getEstudiantes()
                    .joinToString(", ") { "${it.getNombreEstudiante()} ${it.getApellidoEstudiante()}" }
            }
            // Si solo tenemos ID, mostrarlos directamente
            else -> {
                calificacion.getEstudiantesIds().joinToString(", ")
            }
        }

        holder.updateButton.setOnClickListener { onUpdateClick(calificacion) }
        holder.deleteButton.setOnClickListener { onDeleteClick(calificacion) }
    }

    override fun getItemCount(): Int = calificaciones.size

    fun actualizarLista(nuevasCalificaciones: List<Calificacion>) {
        calificaciones = nuevasCalificaciones
        notifyDataSetChanged()
    }
}