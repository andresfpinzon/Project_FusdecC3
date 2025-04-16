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
    private var comandos: List<Comando>,
    private val onUpdateClick: (Comando) -> Unit,
    private val onDeleteClick: (Comando) -> Unit
) : RecyclerView.Adapter<ComandoAdapter.ComandoViewHolder>() {

    private var originalComandos : List<Comando> = comandos

    class ComandoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textIdComando: TextView = itemView.findViewById(R.id.textIdComando)
        val textNombre: TextView = itemView.findViewById(R.id.textNombre)
        val textUbicacion: TextView = itemView.findViewById(R.id.textUbicacion)
        val textEstado: TextView = itemView.findViewById(R.id.textEstado)
        val textFundacionId: TextView = itemView.findViewById(R.id.textFundacionId)
        val textBrigadas: TextView = itemView.findViewById(R.id.textBrigadas)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ComandoViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_comando, parent, false)
        return ComandoViewHolder(view)
    }

    override fun onBindViewHolder(holder: ComandoViewHolder, position: Int) {
        val comando = comandos[position]
        holder.textIdComando.text = comando.getId()
        holder.textNombre.text = comando.getNombreComando()
        holder.textUbicacion.text = comando.getUbicacionComando()
        holder.textEstado.text = if (comando.getEstadoComando()) "Activo" else "Inactivo"
        holder.textFundacionId.text = comando.getFundacionId()
        holder.textBrigadas.text = when {
            comando.getBrigadas().isNotEmpty() &&
                    comando.getBrigadas().first().getNombreBrigada().isNotEmpty() -> {
                        "Brigadas: " + comando.getBrigadas()
                            .take(3)
                            .joinToString(", ") {it.getNombreBrigada()} +
                                if(comando.getBrigadas().size > 3) "..." else ""
                    }

            else -> "Brigadas:  ${comando.getBrigadasIds().size}"
        }


        holder.updateButton.setOnClickListener { onUpdateClick(comando) }
        holder.deleteButton.setOnClickListener { onDeleteClick(comando) }
    }

    fun filter(query: String?) {
        comandos = if (query.isNullOrEmpty()) {
            originalComandos
        } else {
            originalComandos.filter {
                it.getNombreComando().contains(query, ignoreCase = true) }
        }
        notifyDataSetChanged()
    }

    override fun getItemCount(): Int = comandos.size

    fun actualizarLista(nuevosComandos: List<Comando>) {
        comandos = nuevosComandos
        originalComandos = nuevosComandos
        notifyDataSetChanged()
    }
}