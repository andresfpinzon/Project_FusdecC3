package com.example.fusdeckotlin.ui.activities.administrativo.certificate

import android.app.AlertDialog
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.certificado.CreateCertificadoDto
import com.example.fusdeckotlin.dto.administrativo.certificado.UpdateCertificadoDto
import com.example.fusdeckotlin.services.administrativo.certificate.CertificadoServices
import com.example.fusdeckotlin.ui.adapters.administrador.certificateAdapter.CertificateAdapter
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.launch
import com.example.fusdeckotlin.models.administrativo.certificado.CertificadoModel

class CertificateActivity : AppCompatActivity() {

    private lateinit var usuario: TextInputEditText
    private lateinit var curso: TextInputEditText
    private lateinit var estudiante: TextInputEditText
    private lateinit var emisor: TextInputEditText
    private lateinit var guardarButton: Button
    private lateinit var cancelarButton: Button
    private lateinit var certificateRecyclerView: RecyclerView

    private val certificadoServices = CertificadoServices()
    private lateinit var adapter: CertificateAdapter
    private var isEditing = false
    private var currentCertificateId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_certificate)

        initViews()
        setupRecyclerView()
        loadCertificates()
        setupButtons()
    }

    private fun initViews() {
        usuario = findViewById(R.id.inputTextUsuarioC)
        curso = findViewById(R.id.inputTextCursoC)
        estudiante = findViewById(R.id.inputTextEstudianteC)
        emisor = findViewById(R.id.inputTextEmisorC)
        guardarButton = findViewById(R.id.buttonGuardarC)
        cancelarButton = findViewById(R.id.buttonCancelarC)
        certificateRecyclerView = findViewById(R.id.recyclerViewCertificates)
    }

    private fun setupRecyclerView() {
        adapter = CertificateAdapter(
            emptyList(),
            ::onUpdateClick,
            ::onDeleteClick
        )
        certificateRecyclerView.layoutManager = LinearLayoutManager(this)
        certificateRecyclerView.adapter = adapter
    }

    private fun loadCertificates() {
        lifecycleScope.launch {
            val result = certificadoServices.getCertificatesActives()
            result.onSuccess { certificates ->
                adapter.updateList(certificates)
            }.onFailure { error ->
                showError("Error al cargar certificados: ${error.message}")
            }
        }
    }

    private fun saveCertificate() {
        val usuarioText = usuario.text.toString().trim()
        val cursoText = curso.text.toString().trim()
        val estudianteText = estudiante.text.toString().trim()
        val emisorText = emisor.text.toString().trim()

//        if (usuarioText.isEmpty() || cursoText.isEmpty() || estudianteText.isEmpty() || emisorText.isEmpty()) {
//            showError("Por favor, complete todos los campos")
//            return
//        }

        lifecycleScope.launch {
            if (isEditing && currentCertificateId != null) {
                updateCertificate(currentCertificateId!!, usuarioText, cursoText, estudianteText, emisorText)
            } else {
                createCertificate(usuarioText, cursoText, estudianteText, emisorText)
            }
        }
    }

    private suspend fun createCertificate(
        usuarioId: String,
        cursoId: String,
        estudianteId: String,
        emisor: String
    ) {
        val dto = CreateCertificadoDto(
            usuarioId = usuarioId,
            cursoId = cursoId,
            estudianteId = estudianteId,
            nombreEmisorCertificado = emisor
        )

        certificadoServices.createCertificado(dto).onSuccess {
            showSuccess("Certificado creado exitosamente")
            resetEditingState()
            loadCertificates()
        }.onFailure { error ->
            showError("Error al crear certificado: ${error.message}")
        }
    }

    private suspend fun updateCertificate(
        id: String,
        usuarioId: String,
        cursoId: String,
        estudianteId: String,
        emisor: String
    ) {
        val dto = UpdateCertificadoDto(
            usuarioId = usuarioId,
            cursoId = cursoId,
            estudianteId = estudianteId,
            nombreEmisorCertificado = emisor
        )

        certificadoServices.updateCertificate(id, dto).onSuccess {
            showSuccess("Certificado actualizado exitosamente")
            resetEditingState()
            loadCertificates()
        }.onFailure { error ->
            showError("Error al actualizar certificado: ${error.message}")
        }
    }

    private fun onUpdateClick(certificate: CertificadoModel) {
        isEditing = true
        currentCertificateId = certificate.getIdCertificado()
        usuario.setText(certificate.getUsuarioId())
        curso.setText(certificate.getCursoId())
        estudiante.setText(certificate.getEstudianteId())
        emisor.setText(certificate.getNombreEmisor())
    }

    private fun onDeleteClick(certificate: CertificadoModel) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Estás seguro de que deseas eliminar este certificado?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    certificadoServices.deleteCertificateById(certificate.getIdCertificado())
                        .onSuccess {
                            showSuccess("Certificado eliminado")
                            loadCertificates()
                        }.onFailure { error ->
                            showError("Error al eliminar: ${error.message}")
                        }
                }
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun setupButtons() {
        guardarButton.setOnClickListener { saveCertificate() }
        cancelarButton.setOnClickListener { finish() }
    }

    private fun resetEditingState() {
        isEditing = false
        currentCertificateId = null
        cleanForm()
    }

    private fun cleanForm() {
        usuario.text?.clear()
        curso.text?.clear()
        estudiante.text?.clear()
        emisor.text?.clear()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}