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
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario

class UserActivity : AppCompatActivity() {

    // Views
    private lateinit var nombre: TextInputEditText
    private lateinit var apellidos: TextInputEditText
    private lateinit var documento: TextInputEditText
    private lateinit var correo: TextInputEditText
    private lateinit var password: TextInputEditText
    //private lateinit var role: TextInputEditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var userRecyclerView: RecyclerView

    // Services & Adapter
    private val usuarioServices = UsuarioServices()
    private lateinit var adapter: UserAdapter

    // State
    private var isEditing = false
    private var currentNumeroDocument: String? = null
    private var usuariosOriginales: List<Usuario> = emptyList()


    // option for select
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
        //role = findViewById(R.id.inputRole)
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
                result.onSuccess { users ->
                    adapter.actualizarLista(users)
                }.onFailure { error ->
                    showError("error al cargar los users: ${error.message}")
                }
            }catch (e: Exception) {
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

        if (nombreUsuario.isEmpty() || apellidoUsuario.isEmpty() || numeroDocumento.isEmpty() ||
            correoUsuario.isEmpty() || passwordUsuario.isEmpty()) {
            showError("Complete todos los campos obligatorios")
            return
        }

        lifecycleScope.launch {
            try {
                if (isEditing && currentNumeroDocument != null) {
                    // Modo de edición: Actualizar usuario
                    val updateData = UpdateUserDto(
                        nombre = nombreUsuario,
                        apellido = apellidoUsuario,
                        correo = correoUsuario,
                        password = passwordUsuario
                    )
                    usuarioServices.updateUser(currentNumeroDocument!!, updateData)
                        .onSuccess {
                            runOnUiThread {
                                showSuccess("Usuario actualizado")
                                resetEditingState()
                                cargarUsuarios()
                            }
                        }.onFailure { error ->
                            showError("Error al actualizar: ${error.message}")
                        }
                } else {
                    // Modo de creación: Crear usuario
                    val createData = CreateUserDto(
                        numeroDocumento = numeroDocumento,
                        nombre = nombreUsuario,
                        apellido = apellidoUsuario,
                        correo = correoUsuario,
                        password = passwordUsuario
                    )
                    usuarioServices.createUser(createData)
                        .onSuccess {
                            runOnUiThread {
                                showSuccess("Usuario creado")
                                resetEditingState()
                                cargarUsuarios()
                            }
                        }.onFailure { error ->
                            showError("Error al crear: ${error.message}")
                        }
                }
            } catch (e: Exception) {
                showError("Error inesperado: ${e.message}")
            }
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
    }

    private fun onDeleteClick(usuario: Usuario) {
        AlertDialog.Builder(this)
            .setTitle("Eliminar usuario")
            .setMessage("¿Confirmas que deseas eliminar este usuario?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    usuarioServices.deleteUserById(usuario.getNumeroDocumento())
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

    private fun resetEditingState(){
        isEditing = false
        currentNumeroDocument = null
        nombre.text?.clear()
        apellidos.text?.clear()
        correo.text?.clear()
        password.text?.clear()
    }

    private fun showDialogSelection(title: String, options: Array<String>, campoDestino:TextInputEditText ){
        AlertDialog.Builder(this)
            .setTitle("Seleccionar ${title}")
            .setItems(options) {_, which ->
                campoDestino.setText(options[which])
            }
            .setNegativeButton ("Cancelar") { dialog, _ -> dialog.dismiss() }
            .create()
            .show()
    }
}