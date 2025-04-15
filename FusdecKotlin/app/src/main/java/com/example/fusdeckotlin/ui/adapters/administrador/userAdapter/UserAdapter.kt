package com.example.fusdeckotlin.ui.adapters.administrador.userAdapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import models.administrativo.user.model.Usuario
class UserAdapter(
    private val users: MutableList<Usuario>,
    private val onUpdateClick: (Usuario) -> Unit,
    private val onDeleteClick: (Usuario) -> Unit
) : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {

    inner class UserViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val textIdUser: TextView = itemView.findViewById(R.id.textViewUserId)
        private val textNombres: TextView = itemView.findViewById(R.id.textViewNombres)
        private val textApellidos: TextView = itemView.findViewById(R.id.textViewApellidos)
        private val textDocumento: TextView = itemView.findViewById(R.id.textViewDocumento)
        private val textCorreo: TextView = itemView.findViewById(R.id.textViewCorreo)
        private val textPassword: TextView = itemView.findViewById(R.id.textViewPassword)
        private val textRol : TextView = itemView.findViewById(R.id.textViewRol)
        private val textEstado: TextView = itemView.findViewById(R.id.textViewEstado)
        private val textCreadoEn: TextView = itemView.findViewById(R.id.textViewCreadoEn)
        private val updateButton: ImageButton = itemView.findViewById(R.id.updateButton)
        private val deleteButton: ImageButton = itemView.findViewById(R.id.deleteButton)

        fun bind(user: Usuario) {
            // Vincular datos a los TextView
            textIdUser.text = "ID: ${user.getUserId()}"
            textNombres.text = "Nombres: ${user.getNombreUsuario()}"
            textApellidos.text = "Apellidos: ${user.getApellidoUsuario()}"
            textDocumento.text = "Documento: ${user.getNumeroDocumento()}"
            textCorreo.text = "Correo: ${user.getCorreo()}"
            textPassword.text = "Contraseña: ${user.getPassword()}"
            textRol.text = "Roles: ${user.getRoles()}"
            textEstado.text = "Estado: ${user.getEstadoUsuario()}"
            textCreadoEn.text = "Creado: ${user.getCreadoEn()}"

            // Listener para el botón de actualización
            updateButton.setOnClickListener {
                onUpdateClick(user)
            }

            // Listener para el botón de eliminación
            deleteButton.setOnClickListener {
                onDeleteClick(user)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_user, parent, false)
        return UserViewHolder(view)
    }

    override fun onBindViewHolder(holder: UserViewHolder, position: Int) {
        holder.bind(users[position])
    }

    override fun getItemCount(): Int = users.size
}