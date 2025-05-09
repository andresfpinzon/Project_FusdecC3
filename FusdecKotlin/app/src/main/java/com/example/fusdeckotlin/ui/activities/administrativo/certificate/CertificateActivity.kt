package com.example.fusdeckotlin.ui.activities.administrativo.certificate

import android.app.AlertDialog
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.fusdeckotlin.R
import com.example.fusdeckotlin.dto.administrativo.certificado.CreateCertificadoDto
import com.example.fusdeckotlin.dto.administrativo.certificado.UpdateCertificadoDto
import com.example.fusdeckotlin.models.administrativo.certificado.Certificado
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import com.example.fusdeckotlin.models.auth.AuthManager
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.services.administrativo.certificate.CertificadoServices
import com.example.fusdeckotlin.services.administrativo.usuario.UsuarioServices
import com.example.fusdeckotlin.services.secretario.estudiante.EstudianteServices
import com.example.fusdeckotlin.ui.adapters.administrativo.certificate.CertificateAdapter
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CertificateActivity : AppCompatActivity() {

    private lateinit var inputEmisor: EditText
    private lateinit var btnGuardar: Button
    private lateinit var btnCancelar: Button
    private lateinit var recyclerView: RecyclerView
    private lateinit var tvUsuarioSeleccionado: TextView
    private lateinit var tvEstudianteSeleccionado: TextView

    private val certificadoService = CertificadoServices()
    private val estudianteService = EstudianteServices()
    private val userService = UsuarioServices()

    private lateinit var adapter: CertificateAdapter
    private var isEditing = false
    private var currentCertificateId: Int? = null
    private var usuarioSeleccionado: Usuario? = null
    private var estudianteSeleccionado: Estudiante? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_certificate)

        initViews()
        setupRecyclerView()
        setupListeners()
        loadCertificadosActivos()
        autoLlenarUsuarioDesdeToken()
    }

    private fun initViews() {
        inputEmisor = findViewById(R.id.inputTextEmisorC)
        btnGuardar = findViewById(R.id.buttonGuardarC)
        btnCancelar = findViewById(R.id.buttonCancelarC)
        recyclerView = findViewById(R.id.recyclerViewCertificates)
        tvUsuarioSeleccionado = findViewById(R.id.tvUsuarioSeleccionado)
        tvEstudianteSeleccionado = findViewById(R.id.tvEstudianteSeleccionado)
    }

    private fun autoLlenarUsuarioDesdeToken() {
        val userId = AuthManager.getUserIdFromToken()
        if (userId == null) {
            showError("Error al obtener ID de usuario del token.")
            return
        }

        lifecycleScope.launch {
            try {
                val result = userService.getUserByDocument(userId)
                result.onSuccess { usuario ->
                    usuarioSeleccionado = usuario
                    tvUsuarioSeleccionado.text =
                        "${usuario.getNombreUsuario()} ${usuario.getApellidoUsuario()} (${usuario.getNumeroDocumento()})"
                    inputEmisor.setText("${usuario.getNombreUsuario()} ${usuario.getApellidoUsuario()}")
                }.onFailure {
                    showError("Error al obtener usuario desde el token: ${it.message}")
                }
            } catch (e: Exception) {
                showError("Error inesperado: ${e.message}")
            }
        }
    }

    private fun setupRecyclerView() {
        adapter = CertificateAdapter(
            certificates = emptyList(),
            fragmentManager = supportFragmentManager,  // Pasa el FragmentManager aquí
            onDeleteClick = ::onDeleteClick,
            onInfoClick = ::onInfoClick
        )
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter
    }


    private fun setupListeners() {
        btnGuardar.setOnClickListener { crearCertificado() }
        btnCancelar.setOnClickListener { finish() }

        findViewById<Button>(R.id.btnSeleccionarUsuario).setOnClickListener {
            mostrarDialogoSeleccionUsuario()
        }

        findViewById<Button>(R.id.btnSeleccionarEstudiante).setOnClickListener {
            mostrarDialogoSeleccionEstudiante()
        }
    }

    private fun mostrarDialogoSeleccionUsuario() {
        lifecycleScope.launch {
            try {
                val usuarios = userService.getUsersActives().getOrThrow()
                val dialogBuilder = AlertDialog.Builder(this@CertificateActivity)
                dialogBuilder.setTitle("Seleccionar Usuario")
                val nombresUsuarios = usuarios.map {
                    "${it.getNombreUsuario()} ${it.getApellidoUsuario()} (${it.getNumeroDocumento()})"
                }.toTypedArray()
                dialogBuilder.setItems(nombresUsuarios) { _, which ->
                    val usuario = usuarios[which]
                    usuarioSeleccionado = usuario
                    tvUsuarioSeleccionado.text =
                        "${usuario.getNombreUsuario()} ${usuario.getApellidoUsuario()} (${usuario.getNumeroDocumento()})"
                }
                dialogBuilder.setNegativeButton("Cancelar", null)
                dialogBuilder.show()
            } catch (e: Exception) {
                showError("Error al cargar usuarios: ${e.message}")
            }
        }
    }

    private fun mostrarDialogoSeleccionEstudiante() {
        lifecycleScope.launch {
            try {
                val estudiantes = estudianteService.listarEstudiantesActivos().getOrThrow()
                val dialogBuilder = AlertDialog.Builder(this@CertificateActivity)
                dialogBuilder.setTitle("Seleccionar Estudiante")
                val nombresEstudiantes = estudiantes.map {
                    "${it.getNombre()} ${it.getApellido()} (${it.getNumeroDocumento()})"
                }.toTypedArray()
                dialogBuilder.setItems(nombresEstudiantes) { _, which ->
                    val estudiante = estudiantes[which]
                    estudianteSeleccionado = estudiante
                    tvEstudianteSeleccionado.text =
                        "${estudiante.getNombre()} ${estudiante.getApellido()} (${estudiante.getNumeroDocumento()})"
                }
                dialogBuilder.setNegativeButton("Cancelar", null)
                dialogBuilder.show()
            } catch (e: Exception) {
                showError("Error al cargar estudiantes: ${e.message}")
            }
        }
    }

    private fun crearCertificado() {
        val nombreEmisor = inputEmisor.text.toString().trim()
        if (usuarioSeleccionado == null) {
            showError("Debe seleccionar un usuario")
            return
        }
        if (estudianteSeleccionado == null) {
            showError("Debe seleccionar un estudiante")
            return
        }
        if (nombreEmisor.isEmpty()) {
            showError("Ingrese el nombre del emisor")
            return
        }

        lifecycleScope.launch {
            try {
                val nuevoCertificado = CreateCertificadoDto(
                    usuarioId = usuarioSeleccionado!!.getNumeroDocumento(),
                    estudianteId = estudianteSeleccionado!!.getNumeroDocumento(),
                    nombreEmisor = nombreEmisor
                )
                if (isEditing && currentCertificateId != null) {
                    val dto = UpdateCertificadoDto(
                        usuarioId = usuarioSeleccionado!!.getNumeroDocumento(),
                        estudianteId = estudianteSeleccionado!!.getNumeroDocumento(),
                        nombreEmisor = nombreEmisor
                    )

                    certificadoService.updateCertificate(currentCertificateId!!, dto)
                        .onSuccess {
                            showSuccess("Certificado actualizado")
                            resetEditingState()
                            loadCertificadosActivos()
                        }.onFailure {
                            showError("Error al actualizar: ${it.message}")
                        }
                } else {
                    certificadoService.createCertificado(nuevoCertificado)
                        .onSuccess {
                            showSuccess("Certificado creado")
                            resetEditingState()
                            loadCertificadosActivos()
                        }.onFailure {
                            showError("Error al crear: ${it.message}")
                        }
                }
            } catch (e: Exception) {
                showError("Error: ${e.message}")
            }
        }
    }

    private fun onUpdateClick(certificado: Certificado) {
        isEditing = true
        currentCertificateId = certificado.getId().toInt()
        tvUsuarioSeleccionado.text = "Buscando usuario..."
        tvEstudianteSeleccionado.text = "Buscando estudiante..."
        lifecycleScope.launch {
            try {
                val usuarioResult = userService.getUserByDocument(certificado.getUsuarioId())
                val estudianteResult = estudianteService.obtenerEstudiantePorDocumento(certificado.getEstudiante())
                usuarioResult.onSuccess { usuario ->
                    estudianteResult.onSuccess { estudiante ->
                        withContext(Dispatchers.Main) {
                            usuarioSeleccionado = usuario
                            estudianteSeleccionado = estudiante
                            tvUsuarioSeleccionado.text =
                                "${usuario.getNombreUsuario()} ${usuario.getApellidoUsuario()} (${usuario.getNumeroDocumento()})"
                            tvEstudianteSeleccionado.text =
                                "${estudiante.getNombre()} ${estudiante.getApellido()} (${estudiante.getNumeroDocumento()})"
                            inputEmisor.setText(certificado.getNombreEmisor())
                        }
                    }.onFailure {
                        showError("Error al cargar estudiante: ${it.message}")
                    }
                }.onFailure {
                    showError("Error al cargar usuario: ${it.message}")
                }
            } catch (e: Exception) {
                showError("Error al cargar datos: ${e.message}")
            }
        }
    }

    private fun onDeleteClick(certificado: Certificado) {
        AlertDialog.Builder(this)
            .setTitle("Confirmar eliminación")
            .setMessage("¿Está seguro de eliminar este certificado?")
            .setPositiveButton("Sí") { _, _ ->
                lifecycleScope.launch {
                    certificadoService.deleteCertificateById(certificado.getId().toString())
                        .onSuccess {
                            showSuccess("Certificado eliminado")
                            loadCertificadosActivos()
                        }.onFailure {
                            showError("Error al eliminar: ${it.message}")
                        }
                }
            }
            .setNegativeButton("No", null)
            .show()
    }

    private fun onInfoClick(certificado: Certificado) {
        val mensaje = """
            ID: ${certificado.getId()}
            Usuario ID: ${certificado.getUsuarioId()}
            Estudiante ID: ${certificado.getEstudiante()}
            Emisor: ${certificado.getNombreEmisor()}
        """.trimIndent()

        AlertDialog.Builder(this)
            .setTitle("Detalle del Certificado")
            .setMessage(mensaje)
            .setPositiveButton("OK", null)
            .show()
    }

    private fun resetEditingState() {
        isEditing = false
        currentCertificateId = null
        inputEmisor.setText("")
        usuarioSeleccionado = null
        estudianteSeleccionado = null
        tvUsuarioSeleccionado.text = "Sin usuario seleccionado"
        tvEstudianteSeleccionado.text = "Sin estudiante seleccionado"
    }

    private fun loadCertificadosActivos() {
        lifecycleScope.launch {
            try {
                val certificados = certificadoService.getCertificatesActives().getOrThrow()
                adapter.updateList(certificados)
            } catch (e: Exception) {
                showError("Error al cargar certificados: ${e.message}")
            }
        }
    }

    private fun showError(message: String) {
        Toast.makeText(this, "⚠️ $message", Toast.LENGTH_LONG).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, "✅ $message", Toast.LENGTH_SHORT).show()
    }
}
