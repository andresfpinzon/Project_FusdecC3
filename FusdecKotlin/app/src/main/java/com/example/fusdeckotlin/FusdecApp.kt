package com.example.fusdeckotlin

import android.app.Application
import com.example.fusdeckotlin.models.auth.AuthManager

class FusdecApp : Application() {
    override fun onCreate() {
        super.onCreate()
        AuthManager.init(this) // Inicializa AuthManager con el contexto global de la app
    }
}
