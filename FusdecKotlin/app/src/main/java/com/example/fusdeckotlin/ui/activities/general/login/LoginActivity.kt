package com.example.fusdeckotlin.ui.activities.general.login

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.auth.AuthManager
import com.example.fusdeckotlin.services.auth.AuthService
import com.example.fusdeckotlin.ui.activities.administrativo.AdministrativoActivity
import com.example.fusdeckotlin.ui.activities.instructor.InstructorActivity
import com.example.fusdeckotlin.ui.activities.root.RootActivity
import com.example.fusdeckotlin.ui.activities.secretario.SecretarioActivity
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.coroutines.Dispatchers

class LoginActivity : AppCompatActivity() {
    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Si ya está logueado, redirigir
        if (AuthManager.isLoggedIn()) {
           redirectBasedOnRole()
            return
        }

        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)

        btnLogin.setOnClickListener {
            val email = etEmail.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Por favor ingrese email y contraseña", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            loginUser(email, password)
        }
    }

    private fun loginUser(email: String, password: String) {
        lifecycleScope.launch {
            try {
                val response = withContext(Dispatchers.IO) {
                    AuthService.login(email, password)
                }

                if (response.isSuccessful) {
                    val token = response.body()?.token
                    token?.let {
                        // Guardar el token
                        AuthManager.saveToken(it)

                        // Redirigir a la actividad principal
                        redirectBasedOnRole()
                    } ?: run {
                        Toast.makeText(this@LoginActivity, "Token no recibido", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    val error = response.errorBody()?.string()
                    Toast.makeText(this@LoginActivity, "Error en login: ${error ?: "Desconocido"}", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(this@LoginActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                Log.e("LoginActivity", "Error en login", e)
            }
        }
    }

    private fun redirectBasedOnRole() {
        when {
            AuthManager.hasRole("ROLE_ROOT") -> {
                startActivity(Intent(this, RootActivity::class.java))
            }
            AuthManager.hasRole("ROLE_ADMINISTRATIVO") -> {
                startActivity(Intent(this, AdministrativoActivity::class.java))
            }
            AuthManager.hasRole("ROLE_SECRETARIO") -> {
                startActivity(Intent(this, SecretarioActivity::class.java))
            }
            AuthManager.hasRole("ROLE_INSTRUCTOR") -> {
                startActivity(Intent(this, InstructorActivity::class.java))
            }
            else -> {
                startActivity(Intent(this, MainActivity::class.java))
            }
        }
        finish()
    }

    fun onBackToHomeClicked(view: android.view.View) {
        startActivity(Intent(this, MainActivity::class.java))
    }

}