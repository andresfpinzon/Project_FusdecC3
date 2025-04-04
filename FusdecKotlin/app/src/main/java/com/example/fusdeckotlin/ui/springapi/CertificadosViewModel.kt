import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import android.util.Log
import com.example.fusdeckotlin.config.retrofit.RetrofitClient

class CertificadosViewModel : ViewModel() {

    fun cargarCertificados() {
        viewModelScope.launch {
            try {
                val certificados = RetrofitClient.certificadoApi.obtenerCertificados()
                Log.d("Certificados", certificados.toString())
                // Puedes mapearlos, mostrarlos en UI, etc.
            } catch (e: Exception) {
                Log.e("Error", "Error al obtener certificados: ${e.message}")
            }
        }
    }
}
