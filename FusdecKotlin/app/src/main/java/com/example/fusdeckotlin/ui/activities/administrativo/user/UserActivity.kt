package com.example.fusdeckotlin.ui.activities.administrativo.user

import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.user.CreateUserDto
import com.example.fusdeckotlin.dto.administrativo.user.UpdateUserDto
import com.example.fusdeckotlin.dto.administrativo.userRol.AddRolUserDto
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import com.example.fusdeckotlin.services.administrativo.usuario.UsuarioServices
import com.example.fusdeckotlin.services.administrativo.userRolServices.UserRolServices
import com.example.fusdeckotlin.ui.adapters.administrativo.user.UserAdapter
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.launch

class UserActivity : AppCompatActivity() {

    // Views
    private lateinit var nombre: TextInputEditText
    private lateinit var apellidos: TextInputEditText
    private lateinit var documento: TextInputEditText
    private lateinit var correo: TextInputEditText
    private lateinit var password: TextInputEditText
    private lateinit var role: TextInputEditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var userRecyclerView: RecyclerView

    // Services
    private val usuarioServices = UsuarioServices()
    private val rolServices = UserRolServices()
    private lateinit var adapter: UserAdapter

    // State
    private var isEditing = false
    private var currentNumeroDocument: String? = null
    private val roles = arrayOf("Administrativo", "Instructor", "Secretario")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        initViews()
        setupRecyclerView()
        setupListeners()
        cargarUsuarios()
    }

    private fun initViews() {
        nombre = findViewById(R.id.inputNombres)
        apellidos = findViewById(R.id.inputApellidos)
        documento = findViewById(R.id.inputNumeroDocumento)
        correo = findViewById(R.id.inputCorreo)
        password = findViewById(R.id.inputPassword)
        role = findViewById(R.id.inputRole)
        confirmarButton = findViewById(R.id.buttonConfirmar)
        cancelarButton = findViewById(R.id.buttonCancelar)
        userRecyclerView = findViewById(R.id.recyclerViewUsers)

        role.setOnClickListener {
            showDialogSelection("Rol", roles, role)
        }
    }

    private fun setupRecyclerView() {
        adapter = UserAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        userRecyclerView.apply {
            layoutManager = LinearLayoutManager(this@UserActivity)
            adapter = this@UserActivity.adapter
            setHasFixedSize(true)
        }
    }

    private fun setupListeners() {
        confirmarButton.setOnClickListener { guardarUsuario() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun cargarUsuarios() {
        lifecycleScope.launch {
            try {
                usuarioServices.getUsersActives().onSuccess { users ->
                    adapter.actualizarLista(users)
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
        val selectedRole = role.text.toString().trim()

        if (nombreUsuario.isEmpty() || apellidoUsuario.isEmpty() || numeroDocumento.isEmpty() ||
            correoUsuario.isEmpty() || passwordUsuario.isEmpty() || selectedRole.isEmpty()) {
            showError("Complete todos los campos obligatorios")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentNumeroDocument != null) {
                    actualizarUsuario(numeroDocumento, nombreUsuario, apellidoUsuario, correoUsuario, passwordUsuario, selectedRole)
                } else {
                    crearUsuario(numeroDocumento, nombreUsuario, apellidoUsuario, correoUsuario, passwordUsuario, selectedRole)
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
        rol: String
    ) {
        val createData = CreateUserDto(documento, nombre, apellido, correo, password)
        usuarioServices.createUser(createData).onSuccess {
            asignarRolUsuario(documento, rol)
            runOnUiThread {
                showSuccess("Usuario creado")
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
        nuevoRol: String
    ) {
        val updateData = UpdateUserDto(nombre, apellido, correo, password)
        usuarioServices.updateUser(documento, updateData).onSuccess {
            actualizarRolUsuario(documento, nuevoRol)
            runOnUiThread {
                showSuccess("Usuario actualizado")
                resetEditingState()
                cargarUsuarios()
            }
        }.onFailure { error ->
            showError("Error al actualizar usuario: ${error.message}")
        }
    }

    private suspend fun asignarRolUsuario(documento: String, rol: String) {
        rolServices.addRolToUser(AddRolUserDto(documento, rol)).onFailure { error ->
            showError("Error al asignar rol: ${error.message}")
        }
    }

    private suspend fun actualizarRolUsuario(documento: String, nuevoRol: String) {
        rolServices.getRoleByUser(documento).onSuccess { currentRol ->
            if (currentRol.getRol() != nuevoRol) {
                rolServices.delteRoleOfUser(documento, currentRol.getRol()).onSuccess {
                    asignarRolUsuario(documento, nuevoRol)
                }.onFailure { error ->
                    showError("Error al actualizar rol: ${error.message}")
                }
            }
        }.onFailure {
            asignarRolUsuario(documento, nuevoRol)
        }
    }

    private fun onUpdateClick(usuario: Usuario) {
        isEditing = true
        currentNumeroDocument = usuario.getNumeroDocumento()
        documento.setText(usuario.getNumeroDocumento())
        nombre.setText(usuario.getNombreUsuario())
        apellidos.setText(usuario.getApellidoUsuario())
        correo.setText(usuario.getCorreo())
        password.setText(usuario.getPassword())

        lifecycleScope.launch {
            rolServices.getRoleByUser(usuario.getNumeroDocumento()).onSuccess { userRol ->
                runOnUiThread {
                    role.setText(userRol.getRol())
                }
            }.onFailure { error ->
                showError("Error al obtener rol: ${error.message}")
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
                        rolServices.getRoleByUser(usuario.getNumeroDocumento()).onSuccess { rol ->
                            rolServices.delteRoleOfUser(usuario.getNumeroDocumento(), rol.getRol())
                        }
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

    private fun showDialogSelection(title: String, options: Array<String>, campoDestino: TextInputEditText) {
        AlertDialog.Builder(this)
            .setTitle("Seleccionar $title")
            .setItems(options) { _, which ->
                campoDestino.setText(options[which])
            }
            .setNegativeButton("Cancelar") { dialog, _ -> dialog.dismiss() }
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
        role.text?.clear()
    }
}