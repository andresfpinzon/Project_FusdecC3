package com.example.fusdeckotlin.ui.activities.administrativo.auditoria

import android.os.Bundle
import android.view.View
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.models.administrativo.auditoria.Auditoria
import com.example.fusdeckotlin.services.administrativo.auditoria.AuditoriaServices
import com.example.fusdeckotlin.ui.adapters.administrativo.auditoria.AuditoriaAdapter
import kotlinx.coroutines.launch

class AuditoriaActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var searchView: SearchView

    private val auditoriaService = AuditoriaServices()

    private lateinit var auditoriaAdapter: AuditoriaAdapter
    private var listaAuditorias: List<Auditoria> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auditoria)

        recyclerView = findViewById(R.id.recyclerAuditorias)
        progressBar = findViewById(R.id.progressBar)
        searchView = findViewById(R.id.searchView)

        recyclerView.layoutManager = LinearLayoutManager(this)

        configurarSearchView()
        obtenerAuditorias()
    }

    private fun configurarSearchView() {
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                filtrarAuditorias(newText.orEmpty())
                return true
            }
        })
    }

    private fun obtenerAuditorias() {
        lifecycleScope.launch {
            progressBar.visibility = View.VISIBLE
            val result = auditoriaService.getAuditorias()
            progressBar.visibility = View.GONE

            result.onSuccess { auditorias ->
                listaAuditorias = auditorias
                auditoriaAdapter = AuditoriaAdapter(listaAuditorias)
                recyclerView.adapter = auditoriaAdapter
            }.onFailure { error ->
                Toast.makeText(this@AuditoriaActivity, "Error: ${error.message}", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun filtrarAuditorias(query: String) {
        val filtro = query.lowercase().trim()
        val listaFiltrada = listaAuditorias.filter { auditoria ->
            auditoria.getNombreEmisor()?.lowercase()?.contains(filtro) == true ||
                    auditoria.getFechaAuditoria()?.lowercase()?.contains(filtro) == true ||
                    auditoria.getCertificadoId().contains(filtro) == true
        }
        auditoriaAdapter.actualizarLista(listaFiltrada)
    }
}
