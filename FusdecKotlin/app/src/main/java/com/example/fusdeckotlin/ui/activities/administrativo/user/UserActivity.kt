package com.example.fusdeckotlin.ui.activities.administrativo.user

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.userRol.UsuarioRolResponse
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import com.example.fusdeckotlin.services.administrativo.userRolServices.UserRolServices
import com.example.fusdeckotlin.services.administrativo.usuario.UsuarioServices
import com.example.fusdeckotlin.ui.adapters.administrativo.user.UserAdapter
import com.google.android.material.chip.Chip
import com.google.android.material.chip.ChipGroup
import kotlinx.coroutines.launch

class UserActivity : AppCompatActivity() {

    // Views
    private lateinit var nombre: EditText
    private lateinit var apellidos: EditText
    private lateinit var documento: EditText
    private lateinit var correo: EditText
    private lateinit var password: EditText
    private lateinit var rolesCheckboxContainer: LinearLayout
    private lateinit var selectedRolesChipGroup: ChipGroup
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var userRecyclerView: RecyclerView

    // Services
    private val usuarioServices = UsuarioServices()
    private val rolServices = UserRolServices()

    // Adapter
    private lateinit var adapter: UserAdapter

    // State
    private var isEditing = false
    private var currentNumeroDocument: String? = null
    private val roles = listOf("Administrativo", "Instructor", "Secretario")
    private val roleIds = mapOf(
        "Administrativo" to 1,
        "Instructor" to 2,
        "Secretario" to 3
    )
    private val roleColors = mapOf(
        "Administrativo" to R.color.role_admin,
        "Instructor" to R.color.role_instructor,
        "Secretario" to R.color.role_secretary
    )

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)
        initViews()
        setupRecyclerView()
        setupRolesSelection()
        setupListeners()
        cargarUsuarios()
    }

    private fun initViews() {
        nombre = findViewById(R.id.inputNombres)
        apellidos = findViewById(R.id.inputApellidos)
        documento = findViewById(R.id.inputNumeroDocumento)
        correo = findViewById(R.id.inputCorreo)
        password = findViewById(R.id.inputPassword)
        rolesCheckboxContainer = findViewById(R.id.rolesCheckboxContainer)
        selectedRolesChipGroup = findViewById(R.id.selectedRolesChipGroup)
        confirmarButton = findViewById(R.id.buttonConfirmar)
        cancelarButton = findViewById(R.id.buttonCancelar)
        userRecyclerView = findViewById(R.id.recyclerViewUsers)
    }

    private fun setupRecyclerView() {
        adapter = UserAdapter(
            emptyList(),
            emptyMap(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        userRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@UserActivity)
            this.adapter = this@UserActivity.adapter
            setHasFixedSize(true)
        }
    }

    private fun setupRolesSelection() {
        rolesCheckboxContainer.removeAllViews()

        roles.forEach { role ->
            val checkBox = CheckBox(this).apply {
                text = role
                id = View.generateViewId()
            }

            rolesCheckboxContainer.addView(checkBox)
        }
    }

    private fun setupListeners() {
        confirmarButton.setOnClickListener { guardarUsuario() }
        cancelarButton.setOnClickListener { finish() }

        // Actualizar chips cuando cambian los checkboxes
        rolesCheckboxContainer.setOnHierarchyChangeListener(object : ViewGroup.OnHierarchyChangeListener {
            override fun onChildViewAdded(parent: View?, child: View?) {
                updateSelectedRolesChips()
            }
            override fun onChildViewRemoved(parent: View?, child: View?) {
                updateSelectedRolesChips()
            }
        })
    }

    private fun updateSelectedRolesChips() {
        selectedRolesChipGroup.removeAllViews()

        for (i in 0 until rolesCheckboxContainer.childCount) {
            val checkBox = rolesCheckboxContainer.getChildAt(i) as? CheckBox
            if (checkBox?.isChecked == true) {
                val roleName = checkBox.text.toString()
                val chip = Chip(this).apply {
                    text = roleName
                    isCloseIconVisible = true
                    setTextColor(resources.getColor(android.R.color.white, null))
                    setChipBackgroundColorResource(roleColors[roleName] ?: R.color.role_default)

                    setOnCloseIconClickListener {
                        checkBox.isChecked = false
                        selectedRolesChipGroup.removeView(this)
                    }
                }
                selectedRolesChipGroup.addView(chip)
            }
        }
    }

    private fun getSelectedRoles(): List<String> {
        val selected = mutableListOf<String>()
        for (i in 0 until rolesCheckboxContainer.childCount) {
            val checkBox = rolesCheckboxContainer.getChildAt(i) as? CheckBox
            if (checkBox?.isChecked == true) {
                selected.add(checkBox.text.toString())
            }
        }
        return selected
    }

    private fun setSelectedRoles(roles: List<String>) {
        for (i in 0 until rolesCheckboxContainer.childCount) {
            val checkBox = rolesCheckboxContainer.getChildAt(i) as? CheckBox
            if (checkBox != null) {
                checkBox?.isChecked = roles.contains(checkBox.text.toString())
            }
        }
        updateSelectedRolesChips()
    }

    private fun cargarUsuarios() {
        lifecycleScope.launch {
            try {
                usuarioServices.getUsersActives().onSuccess { users ->
                    val rolesMap = mutableMapOf<String, List<String>>()
                    users.forEach { user ->
                        rolServices.getRolesByUser(user.getNumeroDocumento()).onSuccess { roles ->
                            rolesMap[user.getNumeroDocumento()] = roles.map { it.rolNombre }
                        }.onFailure { error ->
                            showError("Error al obtener roles: ${error.message}")
                        }
                    }
                    adapter.actualizarDatos(users, rolesMap)
                }.onFailure { error ->
                    showError("Error al cargar usuarios: ${error.message}")
                }
            } catch (e: Exception) {
                showError("Error inesperado: ${e.message}")
            }
        }
    }

    private fun guardarUsuario() {
        val nombreUsuario = nombre.text.toString().trim()
        val apellidoUsuario = apellidos.text.toString().trim()
        val numeroDocumento = documento.text.toString().trim()
        val correoUsuario = correo.text.toString().trim()
        val passwordUsuario = password.text.toString().trim()
        val selectedRoles = getSelectedRoles()
        val rolesIds = selectedRoles.mapNotNull { roleIds[it] }

        if (nombreUsuario.isEmpty() || apellidoUsuario.isEmpty() ||
            numeroDocumento.isEmpty() || correoUsuario.isEmpty()) {
            showError("Complete todos los campos obligatorios")
            return
        }

        if (!isEditing && passwordUsuario.isEmpty()) {
            showError("La contraseña es obligatoria para nuevos usuarios")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentNumeroDocument != null) {
                    actualizarUsuario(
                        currentNumeroDocument!!,
                        nombreUsuario,
                        apellidoUsuario,
                        correoUsuario,
                        passwordUsuario,
                        rolesIds
                    )
                } else {
                    crearUsuario(
                        numeroDocumento,
                        nombreUsuario,
                        apellidoUsuario,
                        correoUsuario,
                        passwordUsuario,
                        rolesIds
                    )
                }
            } catch (e: Exception) {
                showError("Error inesperado: ${e.message}")
            }
        }
    }

    private suspend fun crearUsuario(
        documento: String,
        nombre: String,
        apellido: String,
        correo: String,
        password: String,
        rolesIds: List<Int>
    ) {
        rolServices.createUserWithRoles(
            documento, nombre, apellido, correo, password, rolesIds
        ).onSuccess {
            runOnUiThread {
                showSuccess("Usuario creado con roles")
                resetEditingState()
                cargarUsuarios()
            }
        }.onFailure { error ->
            showError("Error al crear usuario: ${error.message}")
        }
    }

    private suspend fun actualizarUsuario(
        documento: String,
        nombre: String,
        apellido: String,
        correo: String,
        password: String,
        rolesIds: List<Int>
    ) {
        rolServices.updateUserWithRoles(
            documento,
            nombre,
            apellido,
            correo,
            if (password.isNotEmpty()) password else null,
            true,
            rolesIds
        ).onSuccess {
            runOnUiThread {
                showSuccess("Usuario actualizado con roles")
                resetEditingState()
                cargarUsuarios()
            }
        }.onFailure { error ->
            showError("Error al actualizar usuario: ${error.message}")
        }
    }

    private fun onUpdateClick(usuario: Usuario) {
        isEditing = true
        currentNumeroDocument = usuario.getNumeroDocumento()
        documento.setText(usuario.getNumeroDocumento())
        nombre.setText(usuario.getNombreUsuario())
        apellidos.setText(usuario.getApellidoUsuario())
        correo.setText(usuario.getCorreo())
        password.setText("")

        lifecycleScope.launch {
            rolServices.getRolesByUser(usuario.getNumeroDocumento()).onSuccess { roles ->
                runOnUiThread {
                    setSelectedRoles(roles.map { it.rolNombre })
                }
            }.onFailure { error ->
                showError("Error al obtener roles: ${error.message}")
            }
        }
    }

    private fun onDeleteClick(usuario: Usuario) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar usuario")
            .setMessage("¿Confirmas que deseas eliminar este usuario?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    usuarioServices.deleteUserById(usuario.getNumeroDocumento()).onSuccess {
                        runOnUiThread {
                            showSuccess("Usuario eliminado")
                            cargarUsuarios()
                        }
                    }.onFailure { error ->
                        showError("Error al eliminar: ${error.message}")
                    }
                }
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun resetEditingState() {
        isEditing = false
        currentNumeroDocument = null
        nombre.text?.clear()
        apellidos.text?.clear()
        documento.text?.clear()
        correo.text?.clear()
        password.text?.clear()
        setSelectedRoles(emptyList())
    }
}