package com.example.fusdeckotlin.ui.adapters.administrativo.unidad

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad

class UnidadAdapter(
    private var unidades: List<Unidad>,
    private val onUpdateClick: (Unidad) -> Unit,
    private val onDeleteClick: (Unidad) -> Unit
) : RecyclerView.Adapter<UnidadAdapter.UnidadViewHolder>() {

    private var originalUnidades: List<Unidad> = unidades

    class UnidadViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textIdUnidad: TextView = itemView.findViewById(R.id.textViewUnidadId)
        val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        val textBrigada: TextView = itemView.findViewById(R.id.textViewBrigada)
        val txtUser: TextView = itemView.findViewById(R.id.textViewUserId)
        val txtComando: TextView = itemView.findViewById(R.id.textViewComandosUnidad)
        val textEstudiantes: TextView = itemView.findViewById(R.id.textViewEstudiantes)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UnidadViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_unidad, parent, false)
        return UnidadViewHolder(view)
    }

    override fun onBindViewHolder(holder: UnidadViewHolder, position: Int) {
        val unidad = unidades[position]
        holder.textIdUnidad.text = unidad.getId()
        holder.textNombre.text = unidad.getNombreUnidad()
        // Safe brigade handling
        holder.textBrigada.text = when {
            unidad.getBrigadaObject()?.getNombreBrigada().isNullOrEmpty().not() ->
                unidad.getBrigadaObject()?.getNombreBrigada()
            else -> "Brigada: ${unidad.getBrigadaId()}"
        }.orEmpty()

        // Safe user handling
        holder.txtUser.text = when {
            unidad.getUserObject()?.getNombreUsuario().isNullOrEmpty().not() ->
                unidad.getUserObject()?.getNombreUsuario()
            else -> "Usuario ID: ${unidad.getUsuarioId()}"
        }.orEmpty()

        // Safe comando handling
        holder.txtComando.text = buildString {
            append("Comandos: ")
            val comandos = unidad.getComandos()
            when {
                comandos.isEmpty() -> append("Ninguno")
                else -> {
                    append(comandos.take(3).joinToString(", ") { it.getNombreComando() })
                        if (comandos.size > 3) append("...")
                }
            }
        }


        holder.updateButton.setOnClickListener { onUpdateClick(unidad) }
        holder.deleteButton.setOnClickListener { onDeleteClick(unidad) }
    }

    fun filter(query: String?) {
        unidades = if (query.isNullOrEmpty()) {
            originalUnidades
        } else {
            originalUnidades.filter { it.getNombreUnidad().contains(query, ignoreCase = true) }
        }
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = unidades.size

    fun actualizarLista(nuevasUnidades: List<Unidad>) {
        unidades = nuevasUnidades
        originalUnidades = nuevasUnidades
        notifyDataSetChanged()
    }
}