package com.example.fusdeckotlin.ui.adapters.secretario.estudiante

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.administrativo.colegio.ColegioServices
import com.example.fusdeckotlin.services.administrativo.unidad.UnidadServices
import com.example.fusdeckotlin.services.secretario.edicion.EdicionServices
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class EstudianteAdapter(
    private var estudiantes: List<Estudiante>,
    private val onUpdateClick: (Estudiante) -> Unit,
    private val onDeleteClick: (Estudiante) -> Unit,
    private val onInfoClick: (Estudiante) -> Unit,
    private val unidadServices: UnidadServices,
    private val colegioServices: ColegioServices,
    private val edicionServices: EdicionServices
) : RecyclerView.Adapter<EstudianteAdapter.EstudianteViewHolder>(), Filterable {

    private var estudiantesFiltrados: List<Estudiante> = estudiantes
    private var context: Context? = null

    private val coroutineScope = CoroutineScope(Dispatchers.IO)


    class EstudianteViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.nombreTextView)
        val numeroDocumentoTextView: TextView = itemView.findViewById(R.id.numeroDocumentoTextView)
        val generoTextView: TextView = itemView.findViewById(R.id.generoTextView)
        val unidadValueTextView: TextView = itemView.findViewById(R.id.unidadValueTextView)
        val colegioValueTextView: TextView = itemView.findViewById(R.id.colegioValueTextView)
        val edicionValueTextView: TextView = itemView.findViewById(R.id.edicionValueTextView)
        val gradoValueTextView: TextView = itemView.findViewById(R.id.gradoValueTextView)
        val estadoTextView: TextView = itemView.findViewById(R.id.estadoTextView)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EstudianteViewHolder {
        context = parent.context
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_estudiante, parent, false)
        return EstudianteViewHolder(view)
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: EstudianteViewHolder, position: Int) {
        val estudiante = estudiantesFiltrados[position]

        // Configurar datos del estudiante
        holder.nombreTextView.text = "${estudiante.getNombre()} ${estudiante.getApellido()}"
        holder.numeroDocumentoTextView.text = estudiante.getNumeroDocumento()
        holder.generoTextView.text = estudiante.getGenero()

        cargarUnidadNombre(estudiante.getUnidad().toInt(), holder.unidadValueTextView)
        cargarColegioNombre(estudiante.getColegio(), holder.colegioValueTextView)
        cargarEdicionNombre(estudiante.getEdicion(), holder.edicionValueTextView)

        holder.gradoValueTextView.text = estudiante.getGrado()

        // Configurar estado visual
        if (estudiante.getEstado()) {
            holder.estadoTextView.text = context?.getString(R.string.estado_activo)
            holder.estadoTextView.background = ContextCompat.getDrawable(
                holder.itemView.context,
                R.drawable.bg_estado_activo
            )
        } else {
            holder.estadoTextView.text = context?.getString(R.string.estado_inactivo)
            holder.estadoTextView.background = ContextCompat.getDrawable(
                holder.itemView.context,
                R.drawable.bg_estado_inactivo
            )
        }

        // Configurar botones
        holder.updateButton.setOnClickListener { onUpdateClick(estudiante) }
        holder.deleteButton.setOnClickListener { onDeleteClick(estudiante) }
        holder.infoButton.setOnClickListener { onInfoClick(estudiante) }

        // Efecto de elevación al hacer clic
        holder.itemView.setOnClickListener {
            it.animate().scaleX(0.95f).scaleY(0.95f).setDuration(100).withEndAction {
                it.animate().scaleX(1f).scaleY(1f).duration = 100
            }
        }
    }

    private fun cargarUnidadNombre(unidadId: Int, textView: TextView) {
        coroutineScope.launch {
            try {
                val unidad = unidadServices.obtenerUnidadPorId(unidadId.toString())
                unidad.onSuccess { u ->
                    withContext(Dispatchers.Main) {
                        textView.text = u.getNombreUnidad()
                    }
                }.onFailure {
                    withContext(Dispatchers.Main) {
                        textView.text = "ID: $unidadId (No encontrada)"
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    textView.text = "ID: $unidadId (Error)"
                }
            }
        }
    }
    private fun cargarColegioNombre(colegioId: Int, textView: TextView) {
        coroutineScope.launch {
            try {
                val colegio = colegioServices.obtenerColegioPorId(colegioId.toString())
                colegio.onSuccess { c ->
                    withContext(Dispatchers.Main) {
                        textView.text = c.getNombreColegio()
                    }
                }.onFailure {
                    withContext(Dispatchers.Main) {
                        textView.text = "ID: $colegioId (No encontrado)"
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    textView.text = "ID: $colegioId (Error)"
                }
            }
        }
    }
    private fun cargarEdicionNombre(edicionId: Int, textView: TextView) {
        coroutineScope.launch {
            try {
                val edicion = edicionServices.obtenerEdicionPorId(edicionId.toString())
                edicion.onSuccess { e ->
                    withContext(Dispatchers.Main) {
                        textView.text = e.getNombreEdicion()
                    }
                }.onFailure {
                    withContext(Dispatchers.Main) {
                        textView.text = "ID: $edicionId (No encontrada)"
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    textView.text = "ID: $edicionId (Error)"
                }
            }
        }
    }

    override fun getItemCount(): Int = estudiantesFiltrados.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Estudiante>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(estudiantes)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    estudiantes.forEach { estudiante ->
                        if (estudiante.getNombre().lowercase().contains(filterPattern) ||
                            estudiante.getApellido().lowercase().contains(filterPattern) ||
                            estudiante.getNumeroDocumento().lowercase().contains(filterPattern) ||
                            estudiante.getTipoDocumento().lowercase().contains(filterPattern) ||
                            estudiante.getGenero().lowercase().contains(filterPattern) ||
                            estudiante.getUnidad().toString().contains(filterPattern) ||
                            estudiante.getColegio().toString().contains(filterPattern) ||
                            estudiante.getEdicion().toString().contains(filterPattern) ||
                            estudiante.getGrado().lowercase().contains(filterPattern)) {
                            filteredList.add(estudiante)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                estudiantesFiltrados = results?.values as List<Estudiante>
                notifyDataSetChanged()
            }
        }
    }

    fun actualizarLista(nuevosEstudiantes: List<Estudiante>) {
        estudiantes = nuevosEstudiantes
        estudiantesFiltrados = nuevosEstudiantes
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        estudiantesFiltrados = estudiantes
        notifyDataSetChanged()
    }
}