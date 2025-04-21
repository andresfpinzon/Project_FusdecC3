package com.example.fusdeckotlin.ui.adapters.administrativo.certificate

import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import android.view.LayoutInflater
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import androidx.lifecycle.lifecycleScope
import com.example.fusdeckotlin.models.administrativo.certificado.Certificado
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.administrativo.certificate.CertificadoServices
import com.example.fusdeckotlin.services.administrativo.usuario.UsuarioServices
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServices
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.certificado.UpdateCertificadoDto
import kotlinx.coroutines.launch

class UpdateCertificateDialog(
    private val certificado: Certificado,
    private val onUpdated: () -> Unit
) : DialogFragment() {

    private lateinit var inputEmisor: EditText
    private val certificadoService = CertificadoServices()
    private val userService = UsuarioServices()
    private val estudianteService = EstudianteServices()

    private var usuario: Usuario? = null
    private var estudiante: Estudiante? = null

    override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
        val view = LayoutInflater.from(context).inflate(R.layout.dialog_update_certificate, null)
        inputEmisor = view.findViewById(R.id.inputTextEmisorUpdate)

        val builder = AlertDialog.Builder(requireContext())
        builder.setTitle("Actualizar Certificado")
            .setView(view)
            .setPositiveButton("Actualizar") { _, _ ->
                actualizarCertificado()
            }
            .setNegativeButton("Cancelar", null)

        lifecycleScope.launch {
            cargarDatos()
        }

        return builder.create()
    }

    private suspend fun cargarDatos() {
        try {
            val usuarioResult = userService.getUserByDocument(certificado.getUsuarioId())
            val estudianteResult = estudianteService.obtenerEstudiantePorDocumento(certificado.getEstudiante())

            usuario = usuarioResult.getOrNull()
            estudiante = estudianteResult.getOrNull()

            inputEmisor.setText(certificado.getNombreEmisor())
        } catch (e: Exception) {
            Toast.makeText(context, "Error cargando datos: ${e.message}", Toast.LENGTH_LONG).show()
        }
    }

    private fun actualizarCertificado() {
        val emisor = inputEmisor.text.toString().trim()
        if (usuario == null || estudiante == null || emisor.isEmpty()) {
            Toast.makeText(context, "Todos los campos deben estar llenos", Toast.LENGTH_SHORT).show()
            return
        }

        val dto = UpdateCertificadoDto(
            usuarioId = usuario!!.getNumeroDocumento(),
            estudianteId = estudiante!!.getNumeroDocumento(),
            nombreEmisor = emisor
        )

        lifecycleScope.launch {
            certificadoService.updateCertificate(certificado.getId(), dto)
                .onSuccess {
                    Toast.makeText(context, "Actualizado correctamente", Toast.LENGTH_SHORT).show()
                    onUpdated()
                    dismiss()
                }.onFailure {
                    Toast.makeText(context, "Error al actualizar: ${it.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
}
