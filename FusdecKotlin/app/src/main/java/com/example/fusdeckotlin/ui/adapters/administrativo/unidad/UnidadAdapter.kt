package com.example.fusdeckotlin.ui.adapters.administrativo.unidad

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import com.example.fusdeckotlin.services.administrativo.brigada.BrigadaServices
import com.example.fusdeckotlin.services.administrativo.unidad.UnidadServices
import com.example.fusdeckotlin.services.administrativo.usuario.UsuarioServices
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class UnidadAdapter(
    private var unidades: List<Unidad>,
    private val onUpdateClick: (Unidad) -> Unit,
    private val onDeleteClick: (Unidad) -> Unit,
    private val onInfoClick: (Unidad) -> Unit,
    private val brigadaServices: BrigadaServices,
    private val usuarioServices: UsuarioServices
) : RecyclerView.Adapter<UnidadAdapter.UnidadViewHolder>(), Filterable {

    private var unidadesFiltradas: List<Unidad> = unidades

    private val coroutineScope = CoroutineScope(Dispatchers.IO)


    class UnidadViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.nombreUnidad)
        val brigadaTextView: TextView = itemView.findViewById(R.id.brigadaId)
        val usuarioTextView: TextView = itemView.findViewById(R.id.usuarioId)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UnidadViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_unidad, parent, false)
        return UnidadViewHolder(view)
    }

    override fun onBindViewHolder(holder: UnidadViewHolder, position: Int) {
        val unidad = unidadesFiltradas[position]

        holder.nombreTextView.text = unidad.getNombreUnidad()

        // Mostrar nombre de brigada si está disponible, sino mostrar ID
        cargarNombreBrigada(unidad.getBrigadaId(), holder.brigadaTextView)

        // Mostrar nombre de usuario si está disponible, sino mostrar ID
        cargarNombreUsuario(unidad.getUsuarioId(), holder.usuarioTextView)


        holder.updateButton.setOnClickListener { onUpdateClick(unidad) }
        holder.deleteButton.setOnClickListener { onDeleteClick(unidad) }
        holder.infoButton.setOnClickListener { onInfoClick(unidad) }
    }

    private fun cargarNombreBrigada(brigadaId: Int, textView: TextView) {
       coroutineScope.launch {
            try {
                val brigada = brigadaServices.obtenerBrigadaPorId(brigadaId.toString())
               brigada.onSuccess {
                   b ->
                    withContext(Dispatchers.Main) {
                        if (b != null) {
                            textView.text = b.getNombreBrigada()
                        } else {
                            textView.text = "Brigada no encontrada"
                        }
                    }
               }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    textView.text = "Error al cargar brigada"
                }
            }
       }
    }

    private fun cargarNombreUsuario(usuarioId: String, textView: TextView) {
        coroutineScope.launch {
            try {
                val user = usuarioServices.getUserByDocument(usuarioId)
                user.onSuccess { u ->
                    withContext(Dispatchers.Main) {
                        if (u != null) {
                            textView.text = "${u.getNombreUsuario()} ${u.getApellidoUsuario()}"
                        } else {
                            textView.text = "Usuario no encontrado"
                        }
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    textView.text = "Error al cargar usuario"
                }
            }
        }
    }

    override fun getItemCount(): Int = unidadesFiltradas.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Unidad>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(unidades)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    unidades.forEach { unidad ->
                        if (unidad.getNombreUnidad().lowercase().contains(filterPattern) ||
                            unidad.getBrigadaId().toString().contains(filterPattern) ||
                            unidad.getUsuarioId().lowercase().contains(filterPattern)
                        ) {
                            filteredList.add(unidad)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                unidadesFiltradas = results?.values as List<Unidad>
                notifyDataSetChanged()
            }
        }
    }

    fun actualizarLista(nuevasUnidades: List<Unidad>) {
        unidades = nuevasUnidades
        unidadesFiltradas = nuevasUnidades
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        unidadesFiltradas = unidades
        notifyDataSetChanged()
    }
}