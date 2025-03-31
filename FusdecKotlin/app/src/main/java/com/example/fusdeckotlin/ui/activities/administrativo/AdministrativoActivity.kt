package com.example.fusdeckotlin.ui.activities.administrativo

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.activities.administrativo.auditoria.AuditoriaActivity
import com.example.fusdeckotlin.ui.activities.administrativo.certificate.CertificateActivity
import com.example.fusdeckotlin.ui.activities.administrativo.user.UserActivity
import com.example.fusdeckotlin.ui.activities.administrativo.brigada.BrigadaActivity
import com.example.fusdeckotlin.ui.activities.administrativo.colegio.ColegioActivity
import com.example.fusdeckotlin.ui.activities.administrativo.comando.ComandoActivity
import com.example.fusdeckotlin.ui.activities.administrativo.unidad.UnidadActivity

class AdministrativoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_administrativo)


        val auditoriaButton: Button = findViewById(R.id.auditoriaButton)
        val brigadaButton: Button = findViewById(R.id.brigadaButton)
        val certificadoButton: Button = findViewById(R.id.certificadoButton)
        val colegioButton: Button = findViewById(R.id.colegioButton)
        val comandoButton: Button = findViewById(R.id.comandoButton)
        val unidadButton: Button = findViewById(R.id.unidadButton)
        val userButton: Button = findViewById(R.id.userButton)
        val volverButton: Button = findViewById(R.id.volverButton)

        val buttons = listOf(userButton, colegioButton, comandoButton, brigadaButton, unidadButton, volverButton)

        buttons.forEach { button ->
            button.setOnClickListener {
                val intent = when (button.id) {
                    R.id.userButton -> Intent(this, UserActivity::class.java)
                    R.id.colegioButton -> Intent(this, ColegioActivity::class.java)
                    R.id.comandoButton -> Intent(this, ComandoActivity::class.java)
                    R.id.brigadaButton -> Intent(this, BrigadaActivity::class.java)
                    R.id.unidadButton -> Intent(this, UnidadActivity::class.java)
                    R.id.volverButton -> Intent(this, MainActivity::class.java)
                    else -> null
                }
                intent?.let { startActivity(it) }
                animateButton(button)
            }

        auditoriaButton.setOnClickListener {
            val intent = Intent(this, AuditoriaActivity::class.java)
            startActivity(intent)
        }

        brigadaButton.setOnClickListener {

            Toast.makeText(this, "Módulo de Brigada", Toast.LENGTH_SHORT).show()
        }

        userButton.setOnClickListener{
            val intent = Intent(this, UserActivity::class.java)
            startActivity(intent)
        }

        certificadoButton.setOnClickListener {
            val intent = Intent (this, CertificateActivity::class.java)
            startActivity(intent)
        }

        volverButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }
    }

    private fun animateButton(button: Button) {
        val animator = ObjectAnimator.ofFloat(button, "translationY", 0f, -10f, 0f)
        animator.duration = 300
        animator.start()
    }
}