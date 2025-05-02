package com.example.fusdeckotlin.ui.adapters.administrativo.user

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import com.google.android.material.chip.Chip
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class UserAdapter(
    private var users: List<Usuario>,
    private var rolesMap: Map<String, List<String>>,
    private val onUpdateClick: (Usuario) -> Unit,
    private val onDeleteClick: (Usuario) -> Unit
) : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {

    inner class UserViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textNombres: TextView = itemView.findViewById(R.id.nombreTextView)
        val textDocumento: TextView = itemView.findViewById(R.id.numeroDocumentoTextView)
        val txtCorreo: TextView = itemView.findViewById(R.id.correoTxtView)
        val textEstado: TextView = itemView.findViewById(R.id.estadoTextView)
        val rolesContainer: LinearLayout = itemView.findViewById(R.id.rolesContainer)
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
        val documento = user.getNumeroDocumento()
        val roles = rolesMap[documento] ?: emptyList()

        holder.textNombres.text = "Nombres: ${user.getNombreUsuario()}"
        holder.textDocumento.text = "Documento: $documento"
        holder.txtCorreo.text = "Correo: ${user.getCorreo()}"
        holder.textEstado.text = "Estado: ${if (user.getEstadoUsuario()) "Activo" else "Inactivo"}"

        // Mostrar roles como chips
        holder.rolesContainer.removeAllViews()
        roles.forEach { rol ->
            val chip = Chip(holder.itemView.context).apply {
                text = rol
                setTextColor(context.resources.getColor(android.R.color.white, null))
                setChipBackgroundColorResource(
                    when (rol) {
                        "Administrativo" -> R.color.role_admin
                        "Instructor" -> R.color.role_instructor
                        "Secretario" -> R.color.role_secretary
                        else -> R.color.role_default
                    }
                )
            }
            holder.rolesContainer.addView(chip)
        }

        holder.updateButton.setOnClickListener { onUpdateClick(user) }
        holder.deleteButton.setOnClickListener { onDeleteClick(user) }
    }

    override fun getItemCount(): Int = users.size

    fun actualizarDatos(nuevosUsuarios: List<Usuario>, nuevosRoles: Map<String, List<String>>) {
        users = nuevosUsuarios
        rolesMap = nuevosRoles
        notifyDataSetChanged()
    }
}