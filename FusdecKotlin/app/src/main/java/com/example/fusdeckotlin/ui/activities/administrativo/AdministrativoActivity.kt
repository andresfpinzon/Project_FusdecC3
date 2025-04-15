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

        // Referencias a los botones
        val userButton: Button = findViewById(R.id.userButton)
        val colegioButton: Button = findViewById(R.id.colegioButton)
        val comandoButton: Button = findViewById(R.id.comandoButton)
        val brigadaButton: Button = findViewById(R.id.brigadaButton)
        val unidadButton: Button = findViewById(R.id.unidadButton)
        val certificadoButton: Button = findViewById(R.id.certificadoButton)
        val auditoriaButton: Button = findViewById(R.id.auditoriaButton)
        val volverButton: Button = findViewById(R.id.volverButton)

        // Botón para ir a UserActivity
        userButton.setOnClickListener {
            val intent = Intent(this, UserActivity::class.java)
            startActivity(intent)
        }

        // Botón para ir a ColegioActivity
        colegioButton.setOnClickListener {
            val intent = Intent(this, ColegioActivity::class.java)
            startActivity(intent)
        }

        // Botón para ir a ComandoActivity
        comandoButton.setOnClickListener {
            val intent = Intent(this, ComandoActivity::class.java)
            startActivity(intent)
        }

        // Botón para ir a BrigadaActivity
        brigadaButton.setOnClickListener {
            val intent = Intent(this, BrigadaActivity::class.java)
            startActivity(intent)
        }

        // Botón para ir a UnidadActivity
        unidadButton.setOnClickListener {
            val intent = Intent(this, UnidadActivity::class.java)
            startActivity(intent)
        }

        // Botón para ir a CertificateActivity
        certificadoButton.setOnClickListener {
            val intent = Intent(this, CertificateActivity::class.java)
            startActivity(intent)
        }

        // Botón para ir a AuditoriaActivity
        auditoriaButton.setOnClickListener {
            val intent = Intent(this, AuditoriaActivity::class.java)
            startActivity(intent)
        }

        // Botón para volver a MainActivity
        volverButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}