package com.example.fusdeckotlin.ui.activities.administrativo.certificate

import CertificadoModel
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.services.administrativoService.certificadoServices.CertificadoServices
import com.example.fusdeckotlin.ui.adapters.administrador.certificateAdapter.CertificateAdapter
import com.google.android.material.textfield.TextInputEditText

class CertificateActivity : AppCompatActivity() {

    private lateinit var usuario: TextInputEditText
    private lateinit var curso: TextInputEditText
    private lateinit var estudiante: TextInputEditText
    private lateinit var emisor: TextInputEditText

    private lateinit var guardarButton: Button
    private lateinit var cancelarButton: Button

    private lateinit var certificateRecyclerView: RecyclerView

    private var certificates = mutableListOf<CertificadoModel>()

    private lateinit var adapter : CertificateAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_certificate)

        // Initialize fields
        usuario = findViewById(R.id.inputTextUsuarioC)
        curso = findViewById(R.id.inputTextCursoC)
        estudiante = findViewById(R.id.inputTextEstudianteC)
        emisor = findViewById(R.id.inputTextEmisorC)

        guardarButton = findViewById(R.id.buttonGuardarC)
        cancelarButton = findViewById(R.id.buttonCancelarC)

        certificateRecyclerView = findViewById(R.id.recyclerViewCertificates)

        adapter = CertificateAdapter(certificates, ::onUpdateClick, ::onDeleteClick)
        certificateRecyclerView.layoutManager = LinearLayoutManager(this)
        certificateRecyclerView.adapter = adapter

        // Initialize mock certificates or load from service
        loadCertificates()

        guardarButton.setOnClickListener {
            saveCertificate()
        }
        cancelarButton.setOnClickListener {
            finish()
        }
    }

    private fun saveCertificate(){
        val usuarioCertificate = usuario.text.toString().trim()
        val cursoCertificate = curso.text.toString().trim()
        val estudianteCertificate = estudiante.text.toString().trim()
        val emisorCertificate = emisor.text.toString().trim()

        val newCertificate = CertificadoModel(
            usuarioId = usuarioCertificate,
            cursoId = cursoCertificate,
            estudianteId = estudianteCertificate,
            nombreEmisorCertificado = emisorCertificate
        )

        val certificateCreate = CertificadoServices.createCertificate(newCertificate)

        adapter.notifyItemChanged(certificates.size - 1)

        Toast.makeText(this, "Certificado guardado exitosamente", Toast.LENGTH_SHORT).show()

        cleanForm()
    }

    private fun cleanForm(){
        usuario.text?.clear()
        curso.text?.clear()
        estudiante.text?.clear()
        emisor.text?.clear()
    }

    private fun onUpdateClick(certificate: CertificadoModel){
        usuario.setText(certificate.getUsuarioId())
        curso.setText(certificate.getCursoId())
        estudiante.setText(certificate.getEstudianteId())
        emisor.setText(certificate.getNombreEmisor())

        certificates.remove(certificate)
        adapter.notifyDataSetChanged()
    }

    private fun onDeleteClick(certificate: CertificadoModel){
        val isRemoved = CertificadoServices.removeCertificateByCodeVerify(certificate.getCodigoVerificacion())

        if (isRemoved){
            Toast.makeText(this, "Certificado eliminado", Toast.LENGTH_SHORT).show()
        }else{
            Toast.makeText(this, "Error al eliminar el certificado", Toast.LENGTH_SHORT).show()
        }

        adapter.notifyDataSetChanged()
    }
    // Load mock data or fetch from your backend service
    private fun loadCertificates() {
        // Mock data for testing
        certificates.add(CertificadoModel(
            usuarioId = "User1",
            cursoId = "Course1",
            estudianteId = "Student1",
            nombreEmisorCertificado = "Emisor1"
        ))
        certificates.add(CertificadoModel(
            usuarioId = "User2",
            cursoId = "Course2",
            estudianteId = "Student2",
            nombreEmisorCertificado = "Emisor2"
        ))

        adapter.notifyDataSetChanged()
    }
}