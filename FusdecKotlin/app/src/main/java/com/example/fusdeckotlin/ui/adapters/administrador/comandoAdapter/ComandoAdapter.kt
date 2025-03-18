package com.example.fusdeckotlin.ui.adapters.administrador.comandoAdapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.comando.Comando

class ComandoAdapter(
    private val comandos: MutableList<Comando>,
    private val onUpdateClick: (Comando) -> Unit,
    private val onDeleteClick: (Comando) -> Unit
) : RecyclerView.Adapter<ComandoAdapter.ComandoViewHolder>() {

    private val originalComandos = comandos.toMutableList()

    inner class ComandoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textIdComando: TextView = itemView.findViewById(R.id.textViewComandoId)
        private val textNombre: TextView = itemView.findViewById(R.id.textViewNombre)
        private val textUbicacion: TextView = itemView.findViewById(R.id.textViewUbicacion)
        private val textEstado: TextView = itemView.findViewById(R.id.textViewEstado)
        private val textFundacionId: TextView = itemView.findViewById(R.id.textViewFundacionId)
        private val textBrigadas: TextView = itemView.findViewById(R.id.textViewBrigadas)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(comando: Comando) {
            textIdComando.text = "ID: ${comando.getId()}"
            textNombre.text = "Nombre: ${comando.getNombreComando()}"
            textUbicacion.text = "Ubicación: ${comando.getUbicacionComando()}"
            textEstado.text = "Estado: ${if (comando.getEstadoComando()) "Activo" else "Inactivo"}"
            textFundacionId.text = "Fundación ID: ${comando.getFundacionId()}"
            textBrigadas.text = "Brigadas: ${comando.getBrigadas().joinToString(", ")}"

            updateButton.setOnClickListener {
                onUpdateClick(comando)
            }

            deleteButton.setOnClickListener {
                onDeleteClick(comando)
            }
        }
    }

    fun filter(query: String?) {
        comandos.clear()
        if (query.isNullOrEmpty()) {
            comandos.addAll(originalComandos)
        } else {
            comandos.addAll(originalComandos.filter { it.getNombreComando().contains(query, ignoreCase = true) })
        }
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ComandoViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_comando, parent, false)
        return ComandoViewHolder(view)
    }

    override fun onBindViewHolder(holder: ComandoViewHolder, position: Int) {
        holder.bind(comandos[position])
    }

    override fun getItemCount(): Int = comandos.size
}