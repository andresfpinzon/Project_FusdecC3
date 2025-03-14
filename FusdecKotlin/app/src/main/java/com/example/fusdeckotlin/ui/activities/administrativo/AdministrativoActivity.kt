package com.example.fusdeckotlin.ui.activities.administrativo

import android.content.Intent
import android.os.Bundle
import android.widget.Button

import androidx.appcompat.app.AppCompatActivity
import com.example.fusdeckotlin.MainActivity
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.ui.activities.administrativo.brigada.BrigadaActivity
import com.example.fusdeckotlin.ui.activities.administrativo.colegio.ColegioActivity
import com.example.fusdeckotlin.ui.activities.administrativo.comando.ComandoActivity


class AdministrativoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_administrativo)



        val colegioButton: Button = findViewById(R.id.colegioButton)
        val comandoButton: Button = findViewById(R.id.comandoButton)
        val brigadaButton: Button = findViewById(R.id.brigadaButton)
        val unidadButton: Button = findViewById(R.id.unidadButton)

        val volverButton: Button = findViewById(R.id.volverButton)



        brigadaButton.setOnClickListener {
            val intent = Intent(this, BrigadaActivity::class.java)
            startActivity(intent)
        }

        colegioButton.setOnClickListener {
            val intent = Intent(this, ColegioActivity::class.java)
            startActivity(intent)
        }

        comandoButton.setOnClickListener {
            val intent = Intent(this, ComandoActivity::class.java)
            startActivity(intent)
        }

        volverButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
                startActivity(intent)
                finish()
        }



    }
}
