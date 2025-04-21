package com.example.fusdeckotlin.ui.activities.administrativo.auditoria
import com.example.fusdeckotlin.R
import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.databinding.ActivityAuditoriaBinding
import com.example.fusdeckotlin.models.administrativo.auditoria.Auditoria
import com.example.fusdeckotlin.services.administrativo.auditoria.AuditoriaServices
import com.example.fusdeckotlin.ui.adapters.administrativo.auditoria.AuditoriaAdapter
import kotlinx.coroutines.launch

class AuditoriaActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private val auditoriaService = AuditoriaServices()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auditoria)

        recyclerView = findViewById(R.id.recyclerAuditorias)
        progressBar = findViewById(R.id.progressBar)

        recyclerView.layoutManager = LinearLayoutManager(this)
        obtenerAuditorias()
    }

    private fun obtenerAuditorias() {
        lifecycleScope.launch {
            progressBar.visibility = View.VISIBLE
            val result = auditoriaService.getAuditorias()
            progressBar.visibility = View.GONE

            result.onSuccess { auditorias ->
                recyclerView.adapter = AuditoriaAdapter(auditorias)
            }.onFailure { error ->
                Toast.makeText(this@AuditoriaActivity, "Error: ${error.message}", Toast.LENGTH_LONG).show()
            }
        }
    }
}
