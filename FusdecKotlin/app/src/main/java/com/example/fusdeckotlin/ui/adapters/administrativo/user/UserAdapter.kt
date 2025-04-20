package com.example.fusdeckotlin.ui.adapters.administrativo.user

import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class UserAdapter(
    private var users: List<Usuario>,
    private var rolesMap: Map<String, List<String>>,
    private val onUpdateClick: (Usuario) -> Unit,
    private val onDeleteClick: (Usuario) -> Unit,
    private val onRoleDelete: (String, String) -> Unit // Callback para eliminar roles
) : RecyclerView.Adapter<UserAdapter.UserViewHolder>() {

    inner class UserViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val textNombres: TextView = itemView.findViewById(R.id.nombreTextView)
        val textDocumento: TextView = itemView.findViewById(R.id.numeroDocumentoTextView)
        val txtCorreo: TextView = itemView.findViewById(R.id.correoTxtView)
        val textEstado: TextView = itemView.findViewById(R.id.estadoTextView)
        val rolContainer: ViewGroup = itemView.findViewById(R.id.rolesContainer) // Contenedor de roles
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

        // Mostrar roles
        setupRolesView(holder.rolContainer, roles, documento)

        // Configurar listeners para botones
        holder.updateButton.setOnClickListener { onUpdateClick(user) }
        holder.deleteButton.setOnClickListener { onDeleteClick(user) }
    }

    private fun setupRolesView(container: ViewGroup, roles: List<String>, documento: String) {
        container.removeAllViews()

        roles.forEach { rol ->
            val roleView = LayoutInflater.from(container.context)
                .inflate(R.layout.item_role, container, false)

            val tvRol = roleView.findViewById<TextView>(R.id.tvRoleName)
            val btnDelete = roleView.findViewById<ImageButton>(R.id.btnDeleteRole)

            tvRol.text = rol
            btnDelete.setOnClickListener {
                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        onRoleDelete(documento, rol) // Llamar al callback para eliminar el rol
                    } catch (e: Exception) {
                        Log.e("UserAdapter", "Error deleting role: ${e.message}")
                    }
                }
            }

            container.addView(roleView)
        }
    }

    override fun getItemCount(): Int = users.size

    fun actualizarDatos(nuevosUsuarios: List<Usuario>, nuevosRoles: Map<String, List<String>>) {
        users = nuevosUsuarios
        rolesMap = nuevosRoles
        notifyDataSetChanged()
    }
}