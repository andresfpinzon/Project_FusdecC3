package com.example.fusdeckotlin.ui.activities.administrativo

import android.animation.ObjectAnimator
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

        val buttonMap = mapOf(
            R.id.userButton to UserActivity::class.java,
            R.id.colegioButton to ColegioActivity::class.java,
            R.id.comandoButton to ComandoActivity::class.java,
            R.id.brigadaButton to BrigadaActivity::class.java,
            R.id.unidadButton to UnidadActivity::class.java,
            R.id.certificadoButton to CertificateActivity::class.java,
            R.id.auditoriaButton to AuditoriaActivity::class.java,
            R.id.volverButton to MainActivity::class.java
        )

        buttonMap.forEach { (buttonId, activityClass) ->
            findViewById<Button>(buttonId).setOnClickListener {
                if (buttonId == R.id.brigadaButton) {
                    Toast.makeText(this, "Módulo de Brigada", Toast.LENGTH_SHORT).show()
                } else {
                    startActivity(Intent(this, activityClass))
                    animateButton(it as Button)
                }
                if (buttonId == R.id.volverButton) finish()
            }
        }
    }

    private fun animateButton(button: Button) {
        ObjectAnimator.ofFloat(button, "translationY", 0f, -10f, 0f).apply {
            duration = 300
            start()
        }
    }
}