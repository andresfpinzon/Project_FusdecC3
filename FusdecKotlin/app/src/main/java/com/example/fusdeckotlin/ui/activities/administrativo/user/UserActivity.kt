package com.example.fusdeckotlin.ui.activities.administrativo.user

import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.services.administrativo.usuario.UsuarioServices
import com.example.fusdeckotlin.ui.adapters.administrador.userAdapter.UserAdapter
import com.google.android.material.textfield.TextInputEditText
import models.administrativo.user.model.Usuario

class UserActivity : AppCompatActivity()  {

    private lateinit var nombre: TextInputEditText
    private lateinit var apellidos : TextInputEditText
    private lateinit var documento : TextInputEditText
    private lateinit var correo : TextInputEditText
    private lateinit var password : TextInputEditText
    private lateinit var role : TextInputEditText
    private lateinit var confirmarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var userRecyclerView: RecyclerView

    private val users = mutableListOf<Usuario>() // Lista vacía al principio, actualizada por el servicio

    private lateinit var adapter : UserAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user)

        nombre = findViewById(R.id.inputNombres)
        apellidos = findViewById(R.id.inputApellidos)
        documento = findViewById(R.id.inputNumeroDocumento)
        correo = findViewById(R.id.inputCorreo)
        password = findViewById(R.id.inputPassword)
        role = findViewById(R.id.inputRole)
        confirmarButton = findViewById(R.id.buttonConfirmar)
        cancelarButton = findViewById(R.id.buttonCancelar)
        userRecyclerView = findViewById(R.id.recyclerViewUsers)

        // Inicializamos el adaptador
        adapter = UserAdapter(users, ::onUpdateClick, ::onDeleteClick)
        userRecyclerView.layoutManager = LinearLayoutManager(this)
        userRecyclerView.adapter = adapter

        // Botón confirmar: Guarda o actualiza un usuario
        confirmarButton.setOnClickListener {
            guardarUsuario()
        }

        // Botón cancelar: Cierra la actividad
        cancelarButton.setOnClickListener {
            finish()
        }
    }

    private fun guardarUsuario() {
        val nombreUsuario = nombre.text.toString().trim()
        val apellidoUsuario = apellidos.text.toString().trim()
        val numeroDocumento = documento.text.toString().trim()
        val correoUsuario = correo.text.toString().trim()
        val passwordUsuario = password.text.toString().trim()
        val rolUsuario = role.text.toString().trim()

        // Validación básica
        if (nombreUsuario.isEmpty() || apellidoUsuario.isEmpty() || numeroDocumento.isEmpty() || correoUsuario.isEmpty() || passwordUsuario.isEmpty() || rolUsuario.isEmpty()) {
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        // Crear un nuevo usuario
        val nuevoUsuario = Usuario(
            nombreUsuario = nombreUsuario,
            apellidoUsuario = apellidoUsuario,
            numeroDocumento = numeroDocumento,
            correo = correoUsuario,
            password = passwordUsuario,
            roles = listOf(rolUsuario), // Asumimos que el rol es solo uno
            estadoUsuario = true, // Estado activo por defecto
        )

        // Usamos el servicio para crear el usuario
        val usuarioCreado = UsuarioServices.createusuario(users, nuevoUsuario)

        // Actualizamos la UI con el nuevo usuario
        adapter.notifyDataSetChanged()

        Toast.makeText(this, "Usuario guardado exitosamente", Toast.LENGTH_SHORT).show()

        limpiarFormulario()
    }

    private fun limpiarFormulario() {
        nombre.text?.clear()
        apellidos.text?.clear()
        documento.text?.clear()
        correo.text?.clear()
        password.text?.clear()
        role.text?.clear()
    }

    private fun onUpdateClick(usuario: Usuario) {
        // Aquí puedes implementar la lógica para actualizar un usuario
        nombre.setText(usuario.getNombreUsuario())
        apellidos.setText(usuario.getApellidoUsuario())
        documento.setText(usuario.getNumeroDocumento())
        correo.setText(usuario.getCorreo())
        password.setText(usuario.getPassword())
        role.setText(usuario.getRoles().joinToString(", "))

        // Eliminar el usuario de la lista temporal y actualizar
        users.remove(usuario)
        adapter.notifyDataSetChanged()
    }

    private fun onDeleteClick(usuario: Usuario) {
        val isRemoved = UsuarioServices.removeUserByNit(usuario.getNumeroDocumento(), users)

        if (isRemoved) {
            Toast.makeText(this, "Usuario eliminado", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Error al eliminar el usuario", Toast.LENGTH_SHORT).show()
        }

        adapter.notifyDataSetChanged()
    }
}
