package com.example.fusdeckotlin.ui.adapters.secretario.curso

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
import com.example.fusdeckotlin.models.secretario.curso.Curso
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.root.fundacion.FundacionService
import com.example.fusdeckotlin.services.secretario.edicion.EdicionServices
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CursoAdapter(
    private var cursos: List<Curso>,
    private val onUpdateClick: (Curso) -> Unit,
    private val onDeleteClick: (Curso) -> Unit,
    private val onInfoClick: (Curso) -> Unit,
    private val fundacionService: FundacionService
) : RecyclerView.Adapter<CursoAdapter.CursoViewHolder>(), Filterable {

    private var cursosFiltrados: List<Curso> = cursos
    private val coroutineScope = CoroutineScope(Dispatchers.IO)
    private var context: Context? = null

    class CursoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.tituloCurso)
        val descripcionTextView: TextView = itemView.findViewById(R.id.descripcionCurso)
        val intensidadHorariaTextView: TextView = itemView.findViewById(R.id.intensidadHorariaCurso)
        val fundacionTextView: TextView = itemView.findViewById(R.id.fundacionId)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CursoViewHolder {
        context = parent.context
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_curso, parent, false)
        return CursoViewHolder(view)
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: CursoViewHolder, position: Int) {
        val curso = cursosFiltrados[position]

        holder.nombreTextView.text = curso.getNombreCurso()
        holder.descripcionTextView.text = curso.getDescripcionCurso()
        holder.intensidadHorariaTextView.text = curso.getIntensidadHorariaCurso()

        cargarNombreFundacion(curso.getFundacionId(), holder.fundacionTextView)

        holder.updateButton.setOnClickListener { onUpdateClick(curso) }
        holder.deleteButton.setOnClickListener { onDeleteClick(curso) }
        holder.infoButton.setOnClickListener { onInfoClick(curso) }

        // Efecto de elevación
        holder.itemView.setOnClickListener {
            it.animate().scaleX(0.95f).scaleY(0.95f).setDuration(100).withEndAction {
                it.animate().scaleX(1f).scaleY(1f).duration = 100
            }
        }
    }

    private fun cargarNombreFundacion(fundacionId: Int, textView: TextView) {
        coroutineScope.launch {
            try {
                val fundacion = fundacionService.obtenerFundacionPorId(fundacionId)
                fundacion.onSuccess { f ->
                    withContext(Dispatchers.Main) {
                    textView.text = f.getNombreFundacion()
                }
                }.onFailure {
                    withContext(Dispatchers.Main) {
                        textView.text = "ID: $fundacionId (No encontrada)"
                    }
                }
            }
            catch (e: Exception) {
                textView.text = "ID: $fundacionId (No encontrada)"
            }
        }
    }

    override fun getItemCount(): Int = cursosFiltrados.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Curso>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(cursos)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    cursos.forEach { curso ->
                        if (curso.getNombreCurso().lowercase().contains(filterPattern) ||
                            curso.getDescripcionCurso().lowercase().contains(filterPattern) ||
                            curso.getIntensidadHorariaCurso().lowercase().contains(filterPattern) ||
                            curso.getFundacionId().toString().contains(filterPattern)) {
                            filteredList.add(curso)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                cursosFiltrados = results?.values as List<Curso>
                notifyDataSetChanged()
            }
        }
    }

    fun actualizarLista(nuevosCursos: List<Curso>) {
        cursos = nuevosCursos
        cursosFiltrados = nuevosCursos
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        cursosFiltrados = cursos
        notifyDataSetChanged()
    }
}