package com.example.fusdeckotlin.ui.adapters.administrador.auditoriaAdapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import models.administrativo.auditoria.model.AuditoriaModel
import java.time.format.DateTimeFormatter

class AuditoriaAdapter(
    private val auditorias: List<AuditoriaModel> // Cambiado a List inmutable
) : RecyclerView.Adapter<AuditoriaAdapter.AuditoriaViewHolder>() {

    // ViewHolder sin los botones de acción
    class AuditoriaViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textIdAuditoria: TextView = itemView.findViewById(R.id.textViewAuditoriaId)
        private val textFechaAuditoria: TextView = itemView.findViewById(R.id.textViewFechaAuditoriaAuditoria)
        private val textCertificadoAuditoria: TextView = itemView.findViewById(R.id.textViewCertficadoAuditoria)
        private val textEstadoAuditoria: TextView = itemView.findViewById(R.id.textViewEstadoAuditoria)

        fun bind(auditoria: AuditoriaModel) {
            textIdAuditoria.text = "ID: ${auditoria.getIdAuditoria()}"
            textFechaAuditoria.text = "Fecha: ${formatFecha(auditoria.getFechaAuditoria())}"
            textCertificadoAuditoria.text = "Certificado: ${auditoria.getCertificadoAuditoria()}"
            textEstadoAuditoria.text = "Estado: ${if(auditoria.getEstadoAuditoria()) "Activo" else "Inactivo"}"
        }

        private fun formatFecha(fecha: String): String {
            return try {
                val formatoOriginal = DateTimeFormatter.ofPattern("yyyy-MM-dd")
                val formatoNuevo = DateTimeFormatter.ofPattern("dd/MM/yyyy")
                java.time.LocalDate.parse(fecha, formatoOriginal).format(formatoNuevo)
            } catch (e: Exception) {
                fecha // Si hay error, devolver la fecha original
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AuditoriaViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_auditoria, parent, false)
        return AuditoriaViewHolder(view)
    }

    override fun onBindViewHolder(holder: AuditoriaViewHolder, position: Int) {
        holder.bind(auditorias[position])
    }

    override fun getItemCount(): Int = auditorias.size

    fun actualizarLista(nuevasAuditorias: List<AuditoriaModel>) {
        (auditorias as? MutableList)?.apply {
            clear()
            addAll(nuevasAuditorias)
        }
        notifyDataSetChanged()
    }
}