package com.example.fusdeckotlin.config.retrofit

import com.example.fusdeckotlin.api.administrativo.auditoria.IAuditoriaApi
import com.example.fusdeckotlin.api.administrativo.brigada.BrigadaApi
import com.example.fusdeckotlin.api.administrativo.certificado.ICertificadoApi
import com.example.fusdeckotlin.api.administrativo.comando.ComandoApi
import com.example.fusdeckotlin.api.administrativo.unidad.UnidadApi
import com.example.fusdeckotlin.api.administrativo.user.IUserApi
import com.example.fusdeckotlin.api.auth.AuthApi
import com.example.fusdeckotlin.api.instructor.asistencia.AsistenciaApi
import com.example.fusdeckotlin.api.secretario.estudiante.EstudianteApi
import com.example.fusdeckotlin.models.auth.AuthManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.create

object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:3000/"

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

    private val retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
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

    val authApi: AuthApi by lazy { retrofit.create(AuthApi::class.java) }
    val asistenciaApi: AsistenciaApi by lazy { retrofit.create(AsistenciaApi::class.java) }
    val estudianteApi: EstudianteApi by lazy { retrofit.create(EstudianteApi::class.java) }
    val brigadaApi: BrigadaApi by lazy { retrofit.create(BrigadaApi::class.java)}
    val comandoApi: ComandoApi by lazy {retrofit.create(ComandoApi::class.java)}
    val unidadApi : UnidadApi by lazy { retrofit.create(UnidadApi::class.java)}
    val userApi : IUserApi by lazy { retrofit.create(IUserApi::class.java) }
    val auditoriaApi : IAuditoriaApi by lazy {retrofit.create(IAuditoriaApi::class.java)}
    val certificadoApi : ICertificadoApi by lazy { retrofit.create(ICertificadoApi::class.java)}

}