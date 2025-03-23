package com.example.fusdeckotlin.ui.adapters.administrador.certificateAdapter

import CertificadoModel
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R

class CertificateAdapter(
    private val certificates: MutableList<CertificadoModel>,
    private val onUpdateClick: (CertificadoModel) -> Unit,
    private val onDeleteClick: (CertificadoModel) -> Unit
) : RecyclerView.Adapter<CertificateAdapter.CertificateViewHolder>() {

    inner class CertificateViewHolder(item: View) : RecyclerView.ViewHolder(item){
        private val textViewCertificateId : TextView = item.findViewById(R.id.textViewCertificateIdC)
        private val textViewFecha : TextView = item.findViewById(R.id.textViewFechaC)
        private val textViewUsuario : TextView = item.findViewById(R.id.textViewUsuarioC)
        private val textViewCurso : TextView = item.findViewById(R.id.textViewCursoC)
        private val textViewEstudiante : TextView = item.findViewById(R.id.textViewEstudianteC)
        private val textViewEmisor : TextView = item.findViewById(R.id.textViewNombreEmisorC)
        private val textViewCodeVerify : TextView = item.findViewById(R.id.textViewCodeVerifyC)
        private val textViewState : TextView = item.findViewById(R.id.textViewEstadoC)

        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButtonC)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButtonC)


        fun bind(certificate : CertificadoModel){
            textViewCertificateId.text = "ID: ${certificate.getIdCertificado()}"
            textViewFecha.text = "Fecha-Emision: ${certificate.getFechaEmisio()}"
            textViewUsuario.text = "Usuario: ${certificate.getUsuarioId()}"
            textViewCurso.text = "Curso: ${certificate.getCursoId()}"
            textViewEstudiante.text = "Estudiante: ${certificate.getEstudianteId()}"
            textViewEmisor.text = "Emisor: ${certificate.getNombreEmisor()}"
            textViewCodeVerify.text = "Código de verficación: ${certificate.getCodigoVerificacion()}"
            textViewState.text = "Estado: ${certificate.getEstadoCertificado()}"

            updateButton.setOnClickListener{
                onUpdateClick(certificate)
            }

            deleteButton.setOnClickListener {
                onDeleteClick(certificate)
            }

        }

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CertificateViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_certificate, parent, false)
        return CertificateViewHolder(view)
    }

    override fun onBindViewHolder(holder: CertificateViewHolder, position: Int) {
        holder.bind(certificates[position])
    }

    override fun getItemCount(): Int = certificates.size

}