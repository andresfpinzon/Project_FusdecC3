package com.example.fusdeckotlin.ui.adapters.administrador.certificateAdapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.certificado.CertificadoModel

class CertificateAdapter(
    private var certificates: List<CertificadoModel>,
    private val onUpdateClick: (CertificadoModel) -> Unit,
    private val onDeleteClick: (CertificadoModel) -> Unit
) : RecyclerView.Adapter<CertificateAdapter.CertificateViewHolder>() {

     class CertificateViewHolder(item: View) : RecyclerView.ViewHolder(item){
         val textViewCertificateId : TextView = item.findViewById(R.id.textViewCertificateIdC)
         val textViewFecha : TextView = item.findViewById(R.id.textViewFechaC)
         val textViewUsuario : TextView = item.findViewById(R.id.textViewUsuarioC)
         val textViewCurso : TextView = item.findViewById(R.id.textViewCursoC)
         val textViewEstudiante : TextView = item.findViewById(R.id.textViewEstudianteC)
         val textViewEmisor : TextView = item.findViewById(R.id.textViewNombreEmisorC)
         val textViewCodeVerify : TextView = item.findViewById(R.id.textViewCodeVerifyC)
         val textViewState : TextView = item.findViewById(R.id.textViewEstadoC)

         val updateButton: ImageButton = itemView.findViewById(R.id.updateButtonC)
         val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButtonC)


    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CertificateViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_certificate, parent, false)
        return CertificateViewHolder(view)
    }

    override fun onBindViewHolder(holder: CertificateViewHolder, position: Int) {
        val certificate = certificates[position]

        holder.textViewCertificateId.text = "ID: ${certificate.getIdCertificado()}"
        holder.textViewFecha.text = "Fecha-Emision: ${certificate.getFechaEmisio()}"
        holder.textViewUsuario.text = when {
            // Si tenemos el objeto Fundacion completo con nombre
            certificate.getUserObject().getNombreUsuario().isNotEmpty() ->
                certificate.getUserObject().getNombreUsuario()
            // Si solo tenemos el ID
            else -> "Estudiante ID: ${certificate.getUsuarioId()}"
        }
        holder.textViewCurso.text = when {
            // Si tenemos el objeto Fundacion completo con nombre
            certificate.getCursoObject().getNombreCurso().isNotEmpty() ->
                certificate.getCursoObject().getNombreCurso()
            // Si solo tenemos el ID
            else -> "Curso ID: ${certificate.getCursoId()}"
        }
        holder.textViewEstudiante.text = when {
            // Si tenemos el objeto Fundacion completo con nombre
            certificate.getEstudentObject().getNombreEstudiante().isNotEmpty() ->
                certificate.getEstudentObject().getNombreEstudiante()
            // Si solo tenemos el ID
            else -> "Estudiante ID: ${certificate.getEstudianteId()}"
        }
        holder.textViewEmisor.text = "Emisor: ${certificate.getNombreEmisor()}"
        holder.textViewCodeVerify.text = "Código de verficación: ${certificate.getCodigoVerificacion()}"
        holder.textViewState.text = "Estado: ${certificate.getEstadoCertificado()}"

        holder.updateButton.setOnClickListener{
            onUpdateClick(certificate)
        }

        holder.deleteButton.setOnClickListener {
            onDeleteClick(certificate)
        }
    }


    override fun getItemCount(): Int = certificates.size

    fun updateList(newList: List<CertificadoModel>) {
        certificates = newList
        notifyDataSetChanged()
    }

}