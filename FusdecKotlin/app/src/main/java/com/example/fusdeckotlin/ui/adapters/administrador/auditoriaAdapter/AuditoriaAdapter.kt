package com.example.fusdeckotlin.ui.adapters.administrador.auditoriaAdapter

import android.view.LayoutInflater
import androidx.recyclerview.widget.RecyclerView
import models.administrativo.auditoria.model.AuditoriaModel
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import com.example.fusdeckotlin.R

class AuditoriaAdapter(
    private val auditorias: MutableList<AuditoriaModel>,
    private val onUpdateClick: (AuditoriaModel) -> Unit,
    private val onDeleteClick: (AuditoriaModel) -> Unit
) : RecyclerView.Adapter<AuditoriaAdapter.AuditoriaViewHolder>(){

    inner class AuditoriaViewHolder(item: View) : RecyclerView.ViewHolder(item){
        private val  textIdAuditoria : TextView = item.findViewById(R.id.textViewAuditoriaId)
        private val textFechaAuditoria : TextView = item.findViewById(R.id.textViewFechaAuditoriaAuditoria)
        private val textCertificadoAuditoria : TextView = item.findViewById(R.id.textViewCertficadoAuditoria)
        private val textEstadoAuditoria : TextView = item.findViewById(R.id.textViewEstadoAuditoria)
        private val updateButton : ImageButton = item.findViewById(R.id.updateButtonAuditoria)
        private val deleteButton : ImageButton = item.findViewById(R.id.deleteButtonAuditoria)


        fun bind(auditoria: AuditoriaModel){
            // Viculacion de los datos a los textViews
            textIdAuditoria.text = "Id: ${auditoria.getIdAuditoria()}"
            textFechaAuditoria.text = "Fecha: ${auditoria.getFechaAuditoria()}"
            textCertificadoAuditoria.text = "Certificado: ${auditoria.getCertificadoAuditoria()}"
            textEstadoAuditoria.text = "Estado: ${auditoria.getEstadoAuditoria()}"

            updateButton.setOnClickListener { onUpdateClick(auditoria) }

            deleteButton.setOnClickListener { onDeleteClick(auditoria) }
        }


    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AuditoriaViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_auditoria, parent, false)
        return AuditoriaViewHolder(view)
    }

    override fun onBindViewHolder(holder: AuditoriaViewHolder, position: Int) {
        holder.bind(auditorias[position])
    }

    override fun getItemCount(): Int = auditorias.size
}