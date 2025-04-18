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

    fun getUserIdFromToken(): String? {
        val token = getToken() ?: return null
        try {
            val parts = token.split(".")
            if (parts.size != 3) return null

            val payload = parts[1]
            val paddedPayload = when (payload.length % 4) {
                2 -> "$payload=="
                3 -> "$payload="
                else -> payload
            }

            val decodedPayload = String(
                android.util.Base64.decode(paddedPayload, android.util.Base64.URL_SAFE),
                Charsets.UTF_8
            )

            // Parsear el JSON y extraer el ID
            val jsonObject = org.json.JSONObject(decodedPayload)
            return jsonObject.getString("id") // Extraemos el campo "id"
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }
}