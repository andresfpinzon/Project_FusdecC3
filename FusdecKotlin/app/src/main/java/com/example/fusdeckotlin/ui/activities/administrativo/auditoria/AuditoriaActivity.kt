package com.example.fusdeckotlin.ui.activities.administrativo.auditoria

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.fusdeckotlin.databinding.ActivityAuditoriaBinding
import com.example.fusdeckotlin.services.administrativo.auditoria.AuditoriaServices
import com.example.fusdeckotlin.ui.adapters.administrativo.auditoria.AuditoriaAdapter
import kotlinx.coroutines.launch
import com.example.fusdeckotlin.models.administrativo.auditoria.Auditoria

class AuditoriaActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAuditoriaBinding
    private lateinit var adapter: AuditoriaAdapter
    private val auditorias = mutableListOf<Auditoria>()
    private var auditoriasOriginales = listOf<Auditoria>() // Para mantener una copia original si necesitas filtrar
    private val auditoriaServices = AuditoriaServices() // Tu servicio de auditorías

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAuditoriaBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()
        cargarAuditorias()
    }

    private fun setupRecyclerView() {
        adapter = AuditoriaAdapter(auditorias)

        binding.recyclerViewAuditorias.apply {
            layoutManager = LinearLayoutManager(this@AuditoriaActivity)
            adapter = this@AuditoriaActivity.adapter
            addItemDecoration(
                DividerItemDecoration(
                    this@AuditoriaActivity,
                    LinearLayoutManager.VERTICAL
                )
            )
        }
    }

    private fun cargarAuditorias() {
        lifecycleScope.launch {
            try {
                val result = auditoriaServices.getAuditorias()
                result.onSuccess { auditorias ->
                    auditoriasOriginales = auditorias
                    runOnUiThread {
                        adapter.actualizarLista(auditorias)
                        if (auditorias.isEmpty()) {
                            showInfo("No hay auditorías registradas")
                        }
                    }
                }.onFailure { error ->
                    runOnUiThread {
                        showError("Error al cargar auditorías: ${error.message}")
                    }
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Error inesperado: ${e.message}")
                }
            }
        }
    }

    private fun showInfo(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }
}