package com.example.fusdeckotlin.config.retrofit

import com.example.fusdeckotlin.api.administrativo.colegio.ColegioApi
import com.example.fusdeckotlin.api.administrativo.auditoria.AuditoriaApi
import com.example.fusdeckotlin.api.administrativo.brigada.BrigadaApi
import com.example.fusdeckotlin.api.administrativo.certificado.CertificadoApi
import com.example.fusdeckotlin.api.administrativo.comando.ComandoApi
import com.example.fusdeckotlin.api.administrativo.unidad.UnidadApi
import com.example.fusdeckotlin.api.administrativo.user.IUserApi
import com.example.fusdeckotlin.api.auth.AuthApi
import com.example.fusdeckotlin.api.instructor.asistencia.AsistenciaApi
import com.example.fusdeckotlin.api.instructor.asistenciaestudiante.AsistenciaEstudianteApi
import com.example.fusdeckotlin.api.root.fundacion.FundacionApi
import com.example.fusdeckotlin.api.secretario.curso.CursoApi
import com.example.fusdeckotlin.api.secretario.edicion.EdicionApi
import com.example.fusdeckotlin.api.secretario.estudiante.EstudianteApi
import com.example.fusdeckotlin.models.auth.AuthManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.create

object RetrofitClient {
    // API en puerto 3000
    private const val NODE_BASE_URL = "http://10.0.2.2:3000/"
    //API Spring en puerto 8080
    private const val SPRING_BASE_URL = "http://10.0.2.2:8080/"

    private val authInterceptor = Interceptor { chain ->
        val originalRequest = chain.request()

        // Agregar token solo si está disponible
        AuthManager.getToken()?.let { token ->
            val newRequest = originalRequest.newBuilder()
                .header("Authorization", "Bearer $token")
                .build()
            return@Interceptor chain.proceed(newRequest)
        }

        chain.proceed(originalRequest)
    }

    private val nodeRetrofit by lazy {
        Retrofit.Builder()
            .baseUrl(NODE_BASE_URL)
            .client(provideOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    private val springRetrofit by lazy {
        Retrofit.Builder()
            .baseUrl(SPRING_BASE_URL)
            .client(provideOkHttpClient())
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    private fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(authInterceptor) // Interceptor de autenticación
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            })
            .build()
    }

    // Spring
    val authApi: AuthApi by lazy { springRetrofit.create(AuthApi::class.java) }
    val estudianteApi: EstudianteApi by lazy { springRetrofit.create(EstudianteApi::class.java) }
    val asistenciaApi: AsistenciaApi by lazy { springRetrofit.create(AsistenciaApi::class.java) }
    val asistenciaestudianteApi: AsistenciaEstudianteApi by lazy { springRetrofit.create(AsistenciaEstudianteApi::class.java) }

    //Node
    val cursoApi: CursoApi by lazy { nodeRetrofit.create(CursoApi::class.java) }
    val edicionApi: EdicionApi by lazy { nodeRetrofit.create(EdicionApi::class.java) }
    val colegioApi: ColegioApi by lazy { nodeRetrofit.create(ColegioApi::class.java) }
    val fundacionApi: FundacionApi by lazy { nodeRetrofit.create(FundacionApi::class.java) }

    val brigadaApi: BrigadaApi by lazy { nodeRetrofit.create(BrigadaApi::class.java)}
    val comandoApi: ComandoApi by lazy {nodeRetrofit.create(ComandoApi::class.java)}
    val unidadApi : UnidadApi by lazy { nodeRetrofit.create(UnidadApi::class.java)}
    val userApi : IUserApi by lazy { nodeRetrofit.create(IUserApi::class.java) }
    val auditoriaApi : AuditoriaApi by lazy {nodeRetrofit.create(AuditoriaApi::class.java)}
    val certificadoApi : CertificadoApi by lazy { nodeRetrofit.create(CertificadoApi::class.java)}

}