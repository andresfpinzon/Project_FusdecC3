package com.example.fusdeckotlin.ui.adapters.administrativo.auditoria

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.auditoria.Auditoria

class AuditoriaAdapter(private var auditorias: List<Auditoria>) : RecyclerView.Adapter<AuditoriaAdapter.ViewHolder>() {

    // Clase ViewHolder con los TextViews correspondientes
    class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val txtIdAuditoria: TextView = itemView.findViewById(R.id.txtIdAuditoria)
        val txtFecha: TextView = itemView.findViewById(R.id.txtFecha)
        val txtNombreEmisor: TextView = itemView.findViewById(R.id.txtNombreEmisor)
        val txtCertificadoId: TextView = itemView.findViewById(R.id.txtCertificadoId)
    }

    // Crea la vista para cada ítem
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_auditoria, parent, false)
        return ViewHolder(view)
    }

    // Asocia los datos con las vistas correspondientes
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val auditoria = auditorias[position]
        holder.txtIdAuditoria.text = "ID: ${auditoria.getIdAuditoria()}"
        holder.txtFecha.text = "Fecha: ${auditoria.getFechaAuditoria()}"
        holder.txtNombreEmisor.text = "Emisor: ${auditoria.getNombreEmisor()}"
        holder.txtCertificadoId.text = "Certificado: ${auditoria.getCertificadoId()}"
    }

    override fun getItemCount(): Int = auditorias.size

    // 👉 MÉTODO PARA ACTUALIZAR LA LISTA
    fun actualizarLista(nuevaLista: List<Auditoria>) {
        auditorias = nuevaLista
        notifyDataSetChanged()
    }
}
