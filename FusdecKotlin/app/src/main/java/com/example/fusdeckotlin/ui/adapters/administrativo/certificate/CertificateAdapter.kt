package com.example.fusdeckotlin.ui.adapters.administrativo.certificate

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Filter
import android.widget.Filterable
import android.widget.ImageButton
import android.widget.TextView
import androidx.fragment.app.FragmentManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.certificado.Certificado

class CertificateAdapter(
    private var certificates: List<Certificado>,
    private val fragmentManager: FragmentManager, // Se pasa el FragmentManager
    private val onDeleteClick: (Certificado) -> Unit,
    private val onInfoClick: (Certificado) -> Unit
) : RecyclerView.Adapter<CertificateAdapter.CertificateViewHolder>(), Filterable {

    private var certificatesFiltrados: List<Certificado> = certificates

    class CertificateViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textViewCertificateId: TextView = itemView.findViewById(R.id.textViewCertificateIdC)
        val textViewFecha: TextView = itemView.findViewById(R.id.textViewFechaC)
        val textViewUsuario: TextView = itemView.findViewById(R.id.textViewUsuarioC)
        val textViewEstudiante: TextView = itemView.findViewById(R.id.textViewEstudianteC)
        val textViewEmisor: TextView = itemView.findViewById(R.id.textViewNombreEmisorC)
        val textViewCodeVerify: TextView = itemView.findViewById(R.id.textViewCodeVerifyC)
        val textViewState: TextView = itemView.findViewById(R.id.textViewEstadoC)

        val updateButton: ImageButton = itemView.findViewById(R.id.updateButtonC)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButtonC)
        val infoButton: ImageButton = itemView.findViewById(R.id.infoButtonC)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CertificateViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_certificate, parent, false)
        return CertificateViewHolder(view)
    }

    override fun onBindViewHolder(holder: CertificateViewHolder, position: Int) {
        val certificate = certificatesFiltrados[position]

        // Configurar los textos de las vistas
        holder.textViewCertificateId.text = "Certificado #${certificate.getId()}"
        holder.textViewFecha.text = certificate.getFechaEmision()
        holder.textViewUsuario.text = "Doc: ${certificate.getUsuarioId()}"
        holder.textViewEstudiante.text = "Est: ${certificate.getEstudiante()}"
        holder.textViewEmisor.text = certificate.getNombreEmisor()
        holder.textViewCodeVerify.text = certificate.getCodigoVerificacion()
        holder.textViewState.text = if (certificate.getEstado()) "Activo" else "Inactivo"

        // Configurar los listeners de los botones
        holder.updateButton.setOnClickListener {
            // Crear y mostrar el dialog cuando se haga click en el botón de actualizar
            val dialog = UpdateCertificateDialog(certificate) {
                // Acción después de la actualización, por ejemplo recargar la lista
                notifyItemChanged(position) // Solo actualizamos el item actual
            }
            dialog.show(fragmentManager, "UpdateCertificateDialog")
        }

        holder.deleteButton.setOnClickListener { onDeleteClick(certificate) }
        holder.infoButton.setOnClickListener { onInfoClick(certificate) }
    }

    override fun getItemCount(): Int = certificatesFiltrados.size

    override fun getFilter(): Filter {
        return object : Filter() {
            override fun performFiltering(constraint: CharSequence?): FilterResults {
                val filteredList = mutableListOf<Certificado>()
                if (constraint.isNullOrEmpty()) {
                    filteredList.addAll(certificates)
                } else {
                    val filterPattern = constraint.toString().lowercase().trim()
                    certificates.forEach { certificado ->
                        if (certificado.getNombreEmisor().lowercase().contains(filterPattern) ||
                            certificado.getUsuarioId().lowercase().contains(filterPattern) ||
                            certificado.getEstudiante().lowercase().contains(filterPattern) ||
                            certificado.getCodigoVerificacion().lowercase().contains(filterPattern) ||
                            certificado.getFechaEmision().lowercase().contains(filterPattern)
                        ) {
                            filteredList.add(certificado)
                        }
                    }
                }
                val results = FilterResults()
                results.values = filteredList
                return results
            }

            @Suppress("UNCHECKED_CAST")
            override fun publishResults(constraint: CharSequence?, results: FilterResults?) {
                certificatesFiltrados = results?.values as List<Certificado>
                notifyDataSetChanged()
            }
        }
    }

    // Método para actualizar la lista de certificados
    fun updateList(newList: List<Certificado>) {
        certificates = newList
        certificatesFiltrados = newList // Actualiza ambos
        notifyDataSetChanged() // Notifica el cambio a RecyclerView
    }

    // Método para limpiar el filtro
    fun limpiarFiltro() {
        certificatesFiltrados = certificates
        notifyDataSetChanged()
    }
}
