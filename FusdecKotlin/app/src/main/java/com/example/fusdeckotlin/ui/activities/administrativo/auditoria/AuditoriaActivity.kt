package com.example.fusdeckotlin.ui.activities.administrativo.auditoria

import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.services.administrativo.auditoria.AuditoriaServices
import com.example.fusdeckotlin.ui.adapters.administrador.auditoriaAdapter.AuditoriaAdapter
import com.google.android.material.textfield.TextInputEditText
import models.administrativo.auditoria.model.AuditoriaModel

class AuditoriaActivity : AppCompatActivity() {
    private lateinit var emisorAuditoria :TextInputEditText
    private lateinit var auditoriaRecyclerView: RecyclerView
    private lateinit var guardarButton: Button
    private lateinit var cancelarButton: Button

    private val auditorias = mutableListOf<AuditoriaModel>()

    private lateinit var adapter : AuditoriaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auditoria)

        emisorAuditoria = findViewById(R.id.inputNombreEmisorAuditoria)
        auditoriaRecyclerView = findViewById(R.id.recyclerViewAuditorias)

        adapter = AuditoriaAdapter(auditorias, ::onUpdateClick, ::onDeleteClick)
        auditoriaRecyclerView.layoutManager = LinearLayoutManager(this)
        auditoriaRecyclerView.adapter = adapter
        guardarButton.setOnClickListener {
            guardarAuditoria()
        }
        cancelarButton.setOnClickListener {
            finish()
        }



    }

    private fun guardarAuditoria(){
        val nombreEmisor = emisorAuditoria.text.toString().trim()
        if (nombreEmisor.isNotEmpty()){
            Toast.makeText(this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show()
            return
        }

        val newAuditoria = AuditoriaModel(
            nombreEmisor = nombreEmisor
        )

        val usuarioCreado = AuditoriaServices.createAuditoria(auditorias, newAuditoria)
        adapter.notifyDataSetChanged()
        Toast.makeText(this, "Auditoria guardada exitosamente", Toast.LENGTH_SHORT).show()

        limpiarFormulario()
    }
    private fun limpiarFormulario(){
        emisorAuditoria.text?.clear()
    }

    private fun onUpdateClick(auditoria: AuditoriaModel){
        emisorAuditoria.setText(auditoria.getNombreEmisorAuditoria())
        auditorias.remove(auditoria)
        adapter.notifyDataSetChanged()
    }

    private fun onDeleteClick(auditoria: AuditoriaModel){
        val isRemoved = AuditoriaServices.removeAuditoriaById(auditorias, auditoria.getIdAuditoria())
        if (isRemoved) {
            Toast.makeText(this, "Auditoria eliminada", Toast.LENGTH_SHORT).show()
        } else {
            Toast.makeText(this, "Error al eliminar la Auditoria", Toast.LENGTH_SHORT).show()
        }
    }
}