package com.example.fusdeckotlin.models.auth

import android.content.Context
import android.content.SharedPreferences

object AuthManager {
    private const val PREFS_NAME = "com.example.fusdeckotlin.auth_prefs"
    private const val TOKEN_KEY = "jwt_token"

    private lateinit var sharedPreferences: SharedPreferences

    fun init(context: Context) {
        sharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun saveToken(token: String) {
        sharedPreferences.edit().putString(TOKEN_KEY, token).apply()
    }

    fun getToken(): String? {
        return sharedPreferences.getString(TOKEN_KEY, null)
    }

    fun clearToken() {
        sharedPreferences.edit().remove(TOKEN_KEY).apply()
    }

    fun isLoggedIn(): Boolean {
        return getToken() != null
    }
}