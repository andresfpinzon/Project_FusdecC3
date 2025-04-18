package com.example.fusdeckotlin.ui.adapters.administrativo.user

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import java.time.format.DateTimeFormatter

class UserAdapter(
    private var users: List<Usuario>,
    private val onUpdateClick: (Usuario) -> Unit,
    private val onDeleteClick: (Usuario) -> Unit
) : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {

    // Patrón ViewHolder similar al AsistenciaAdapter
    class UserViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textIdUser: TextView = itemView.findViewById(R.id.textViewUserId)
        val textNombres: TextView = itemView.findViewById(R.id.textViewNombres)
        val textApellidos: TextView = itemView.findViewById(R.id.textViewApellidos)
        val textDocumento: TextView = itemView.findViewById(R.id.textViewDocumento)
        val textCorreo: TextView = itemView.findViewById(R.id.textViewCorreo)
        val textPassword: TextView = itemView.findViewById(R.id.textViewPassword)
        val textRol: TextView = itemView.findViewById(R.id.textViewRol)
        val textEstado: TextView = itemView.findViewById(R.id.textViewEstado)
        val textCreadoEn: TextView = itemView.findViewById(R.id.textViewCreadoEn)
        val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_user, parent, false)
        return UserViewHolder(view)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        val user = users[position]

        // Configurar los textos similar al AsistenciaAdapter
        holder.textIdUser.text = "ID: ${user.getUserId()}"
        holder.textNombres.text = "Nombres: ${user.getNombreUsuario()}"
        holder.textApellidos.text = "Apellidos: ${user.getApellidoUsuario()}"
        holder.textDocumento.text = "Documento: ${user.getNumeroDocumento()}"
        holder.textCorreo.text = "Correo: ${user.getCorreo()}"
        holder.textPassword.text = "Contraseña: ${user.getPassword()}"
        holder.textRol.text = "Roles: ${formatRoles(user.getRoles())}"
        holder.textEstado.text = "Estado: ${user.getEstadoUsuario()}"
        holder.textCreadoEn.text = "Creado: ${formatDate(user.getCreadoEn())}"

        // Configurar los listeners de los botones
        holder.updateButton.setOnClickListener { onUpdateClick(user) }
        holder.deleteButton.setOnClickListener { onDeleteClick(user) }
    }

    override fun getItemCount(): Int = users.size

    // Método para actualizar la lista similar al AsistenciaAdapter
    fun actualizarLista(nuevosUsuarios: List<Usuario>) {
        users = nuevosUsuarios
        notifyDataSetChanged()
    }

    // Función auxiliar para formatear roles (similar al manejo de estudiantes en AsistenciaAdapter)
    private fun formatRoles(roles: List<String>): String {
        return roles.joinToString(", ")
    }

    // Función auxiliar para formatear fecha (similar al AsistenciaAdapter)
    private fun formatDate(date: String): String {
        return date?.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")) ?: "Fecha no disponible"
    }
}