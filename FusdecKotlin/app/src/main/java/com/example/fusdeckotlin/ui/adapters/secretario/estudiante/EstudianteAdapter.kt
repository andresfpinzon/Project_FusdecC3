//package com.example.fusdeckotlin.ui.adapters.secretario.estudiante
//
//import android.view.LayoutInflater
//import android.view.View
//import android.view.ViewGroup
//import android.widget.ImageButton
//import android.widget.TextView
//import androidx.recyclerview.widget.RecyclerView
//import com.example.fusdeckotlin.R
//import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
//
//
//class EstudianteAdapter(
//    private var estudiantes: List<Estudiante>,
//    private val onUpdateClick: (Estudiante) -> Unit,
//    private val onDeleteClick: (Estudiante) -> Unit
//) : RecyclerView.Adapter<EstudianteAdapter.EstudianteViewHolder>() {
//
//    class EstudianteViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
//        val nombreTextView: TextView = itemView.findViewById(R.id.nombreTextView)
//        val apellidoTextView: TextView = itemView.findViewById(R.id.apellidoTextView)
//        val correoTextView: TextView = itemView.findViewById(R.id.correoTextView)
//        val tipoDocumentoTextView: TextView = itemView.findViewById(R.id.tipoDocumentoTextView)
//        val numeroDocumentoTextView: TextView = itemView.findViewById(R.id.numeroDocumentoTextView)
//        val fechaNacimientoTextView: TextView = itemView.findViewById(R.id.fechaNacimientoTextView)
//        val generoTextView: TextView = itemView.findViewById(R.id.generoTextView)
//        val unidadIdTextView: TextView = itemView.findViewById(R.id.unidadIdTextView)
//        val colegioIdTextView: TextView = itemView.findViewById(R.id.colegioIdTextView)
//        val estadoTextView: TextView = itemView.findViewById(R.id.estadoTextView)
//        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
//        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
//    }
//
//    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EstudianteViewHolder {
//        val view = LayoutInflater.from(parent.context)
//            .inflate(R.layout.item_estudiante, parent, false)
//        return EstudianteViewHolder(view)
//    }
//
//    override fun onBindViewHolder(holder: EstudianteViewHolder, position: Int) {
//        val estudiante = estudiantes[position]
//        holder.nombreTextView.text = estudiante.getNombreEstudiante()
//        holder.apellidoTextView.text = estudiante.getApellidoEstudiante()
//        holder.correoTextView.text = estudiante.getCorreoEstudiante()
//        holder.tipoDocumentoTextView.text = estudiante.getTipoDocumento()
//        holder.numeroDocumentoTextView.text = estudiante.getNumeroDocumento()
//        holder.fechaNacimientoTextView.text = estudiante.getFechaNacimiento().toString()
//        holder.generoTextView.text = estudiante.getGeneroEstudiante()
//        holder.unidadIdTextView.text = estudiante.getUnidadId()
//        holder.colegioIdTextView.text = estudiante.getColegioId()
//        holder.estadoTextView.text = if (estudiante.getEstadoEstudiante()) "Activo" else "Inactivo"
//
//        holder.updateButton.setOnClickListener { onUpdateClick(estudiante) }
//        holder.deleteButton.setOnClickListener { onDeleteClick(estudiante) }
//    }
//
//    override fun getItemCount(): Int = estudiantes.size
//
//    fun actualizarLista(nuevosEstudiantes: List<Estudiante>) {
//        estudiantes = nuevosEstudiantes
//        notifyDataSetChanged()
//    }
//}