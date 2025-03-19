package com.example.fusdeckotlin.ui.activities.administrativo

import android.animation.ObjectAnimator
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.activities.administrativo.user.UserActivity
import com.example.fusdeckotlin.ui.activities.administrativo.brigada.BrigadaActivity
import com.example.fusdeckotlin.ui.activities.administrativo.colegio.ColegioActivity
import com.example.fusdeckotlin.ui.activities.administrativo.comando.ComandoActivity
import com.example.fusdeckotlin.ui.activities.administrativo.unidad.UnidadActivity

class AdministrativoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_administrativo)

        val userButton: Button = findViewById(R.id.userButton)
        val colegioButton: Button = findViewById(R.id.colegioButton)
        val comandoButton: Button = findViewById(R.id.comandoButton)
        val brigadaButton: Button = findViewById(R.id.brigadaButton)
        val unidadButton: Button = findViewById(R.id.unidadButton)
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
        }
    }

    private fun animateButton(button: Button) {
        val animator = ObjectAnimator.ofFloat(button, "translationY", 0f, -10f, 0f)
        animator.duration = 300
        animator.start()
    }
}