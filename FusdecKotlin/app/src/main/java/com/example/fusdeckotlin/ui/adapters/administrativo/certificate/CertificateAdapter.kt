package com.example.fusdeckotlin.ui.adapters.administrativo.certificate

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.certificado.Certificado

class CertificateAdapter(
    private var certificates: List<Certificado>,
    private val onUpdateClick: (Certificado) -> Unit,
    private val onDeleteClick: (Certificado) -> Unit
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



        holder.updateButton.setOnClickListener{
            onUpdateClick(certificate)
        }

        holder.deleteButton.setOnClickListener {
            onDeleteClick(certificate)
        }
    }


    override fun getItemCount(): Int = certificates.size

    fun updateList(newList: List<Certificado>) {
        certificates = newList
        notifyDataSetChanged()
    }

}