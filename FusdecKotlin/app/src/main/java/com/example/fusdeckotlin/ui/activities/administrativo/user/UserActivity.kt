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
import com.example.fusdeckotlin.services.administrativo.usuario.UsuarioServices
import com.example.fusdeckotlin.ui.adapters.administrativo.user.UserAdapter
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.launch
import models.administrativo.user.model.Usuario

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

    // Services & Adapter
    private val usuarioServices = UsuarioServices()
    private lateinit var adapter: UserAdapter

    // State
    private var isEditing = false
    private var currentUserId: String? = null
    private var usuariosOriginales: List<Usuario> = emptyList()

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
                val result = usuarioServices.getUsersActives()
                result.onSuccess { usuarios ->
                    usuariosOriginales = usuarios
                    runOnUiThread {
                        adapter.actualizarLista(usuarios)
                        if (usuarios.isEmpty()) {
                            showInfo("No hay usuarios registrados")
                        }
                    }
                }.onFailure { error ->
                    runOnUiThread {
                        showError("Error al cargar usuarios: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Error inesperado: ${e.message}")
                }
            }
        }
    }

    private fun guardarUsuario() {
        val nombreUsuario = nombre.text.toString().trim()
        val apellidoUsuario = apellidos.text.toString().trim()
        val numeroDocumento = documento.text.toString().trim()
        val correoUsuario = correo.text.toString().trim()
        val passwordUsuario = password.text.toString().trim()
        val rolUsuario = role.text.toString().trim()

        if (nombreUsuario.isEmpty() || apellidoUsuario.isEmpty() || numeroDocumento.isEmpty() ||
            correoUsuario.isEmpty() || passwordUsuario.isEmpty() || rolUsuario.isEmpty()) {
            showError("Complete todos los campos obligatorios")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentUserId != null) {
                    actualizarUsuario(nombreUsuario, apellidoUsuario, numeroDocumento, correoUsuario, passwordUsuario, rolUsuario)
                } else {
                    crearUsuario(nombreUsuario, apellidoUsuario, numeroDocumento, correoUsuario, passwordUsuario, rolUsuario)
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }

    private suspend fun crearUsuario(
        nombre: String,
        apellidos: String,
        documento: String,
        correo: String,
        password: String,
        rol: String
    ) {
        val createData = CreateUserDto(
            nombreUsuario = nombre,
            apellidoUsuario = apellidos,
            numeroDocumento = documento,
            correo = correo,
            password = password,
            roles = listOf(rol)
        )

        usuarioServices.createUser(createData)
            .onSuccess {
                runOnUiThread {
                    showSuccess("Usuario creado")
                    resetForm()
                    cargarUsuarios()
                }
            }.onFailure { error ->
                showError("Error al crear: ${error.message}")
            }
    }

    private suspend fun actualizarUsuario(
        nombre: String,
        apellidos: String,
        documento: String,
        correo: String,
        password: String,
        rol: String
    ) {
        val updateData = UpdateUserDto(
            nombreUsuario = nombre,
            apellidoUsuario = apellidos,
            numeroDocumento = documento,
            correo = correo,
            password = password,
            roles = listOf(rol)
        )

        usuarioServices.updateUser(currentUserId!!, updateData)
            .onSuccess {
                runOnUiThread {
                    showSuccess("Usuario actualizado")
                    resetForm()
                    cargarUsuarios()
                }
            }.onFailure { error ->
                showError("Error al actualizar: ${error.message}")
            }
    }

    private fun resetForm() {
        isEditing = false
        currentUserId = null
        nombre.text?.clear()
        apellidos.text?.clear()
        documento.text?.clear()
        correo.text?.clear()
        password.text?.clear()
        role.text?.clear()
    }

    private fun onUpdateClick(usuario: Usuario) {
        isEditing = true
        currentUserId = usuario.getUserId()
        nombre.setText(usuario.getNombreUsuario())
        apellidos.setText(usuario.getApellidoUsuario())
        documento.setText(usuario.getNumeroDocumento())
        correo.setText(usuario.getCorreo())
        password.setText(usuario.getPassword())
        role.setText(usuario.getRoles().joinToString(", "))
    }

    private fun onDeleteClick(usuario: Usuario) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar usuario")
            .setMessage("¿Confirmas que deseas eliminar este usuario?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    usuarioServices.deleteUserById(usuario.getUserId()!!)
                        .onSuccess {
                            runOnUiThread {
                                showSuccess("Usuario eliminado")
                                cargarUsuarios()
                            }
                        }
                        .onFailure { error ->
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

    private fun showInfo(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}