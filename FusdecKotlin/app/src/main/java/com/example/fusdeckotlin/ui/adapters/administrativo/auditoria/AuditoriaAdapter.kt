package com.example.fusdeckotlin.ui.adapters.administrativo.auditoria

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.auditoria.Auditoria

class AuditoriaAdapter(private val auditorias: List<Auditoria>) :
    RecyclerView.Adapter<AuditoriaAdapter.AuditoriaViewHolder>() {

    class AuditoriaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val fecha: TextView = itemView.findViewById(R.id.txtFecha)
        val emisor: TextView = itemView.findViewById(R.id.txtNombreEmisor)
        val certificado: TextView = itemView.findViewById(R.id.txtCertificadoId)
        val estado: TextView = itemView.findViewById(R.id.txtEstado)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AuditoriaViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_auditoria, parent, false)
        return AuditoriaViewHolder(view)
    }

    override fun onBindViewHolder(holder: AuditoriaViewHolder, position: Int) {
        val auditoria = auditorias[position]
        holder.fecha.text = "Fecha: ${auditoria.getFechaAuditoria()}"
        holder.emisor.text = "Emisor: ${auditoria.getNombreEmisor()}"
        holder.certificado.text = "Certificado: ${auditoria.getCertificadoId()}"
        holder.estado.text = "Estado: ${(auditoria.getEstado())}"

    }

    override fun getItemCount() = auditorias.size
}

