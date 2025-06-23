package com.example.fusdeckotlin.ui.adapters.administrativo.comando

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.services.root.fundacion.FundacionService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.withContext
import kotlinx.coroutines.launch

class ComandoAdapter(
    private var comandos: List<Comando>,
    private val onUpdateClick: (Comando) -> Unit,
    private val onDeleteClick: (Comando) -> Unit,
    private val onInfoClick: (Comando) -> Unit,
    private val fundacionService: FundacionService
) : RecyclerView.Adapter<ComandoAdapter.ComandoViewHolder>(), Filterable {

    private var comandosFiltradas: List<Comando> = comandos
    private val coroutineScope = CoroutineScope(Dispatchers.IO)

    class ComandoViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nombreTextView: TextView = itemView.findViewById(R.id.nombreComando)
        val ubicacionTextView: TextView = itemView.findViewById(R.id.ubicacionComando)
        val fundacionTextView: TextView = itemView.findViewById(R.id.fundacionIdComando)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ComandoViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_comando, parent, false)
        return ComandoViewHolder(view)
    }

    override fun onBindViewHolder(holder: ComandoViewHolder, position: Int) {
        val comando = comandosFiltradas[position]

        holder.nombreTextView.text = comando.getNombreComando()
        holder.ubicacionTextView.text = comando.getUbicacionComando()
        cargarFundacionNombre(comando.getFundacionId(), holder.fundacionTextView)

        holder.updateButton.setOnClickListener { onUpdateClick(comando) }
        holder.deleteButton.setOnClickListener { onDeleteClick(comando) }
        holder.infoButton.setOnClickListener { onInfoClick(comando) }
    }

    override fun getItemCount(): Int = comandosFiltradas.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Comando>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(comandos)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    comandos.forEach { comando ->
                        if (comando.getNombreComando().lowercase().contains(filterPattern) ||
                            comando.getUbicacionComando().lowercase().contains(filterPattern) ||
                            comando.getFundacionId().toString().contains(filterPattern))
                        {
                            filteredList.add(comando)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                comandosFiltradas = results?.values as List<Comando>
                notifyDataSetChanged()
            }
        }
    }

    private fun cargarFundacionNombre(fundacionId: Int, textView: TextView){
        coroutineScope.launch {
            try {
                val fundacion = fundacionService.obtenerFundacionPorId(fundacionId)
                fundacion.onSuccess { f ->
                    withContext(Dispatchers.Main){
                        textView.text = f.getNombreFundacion()
                    }
                }.onFailure {
                    withContext(Dispatchers.Main) {
                        textView.text = "ID: $fundacionId"
                    }
                }
            }catch (e: Exception){
                withContext(Dispatchers.Main){
                    textView.text = "ID: $fundacionId"
                }
            }
        }
    }

    fun actualizarLista(nuevosComandos: List<Comando>) {
        comandos = nuevosComandos
        comandosFiltradas = nuevosComandos
        notifyDataSetChanged()
    }

    fun limpiarFiltro() {
        comandosFiltradas = comandos
        notifyDataSetChanged()
    }
}