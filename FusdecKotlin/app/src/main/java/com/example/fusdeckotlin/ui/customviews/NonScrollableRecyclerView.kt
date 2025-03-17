package com.example.fusdeckotlin.ui.customviews

import android.content.Context
import android.util.AttributeSet
import android.view.MotionEvent
import androidx.recyclerview.widget.RecyclerView

class NonScrollableRecyclerView(context: Context, attrs: AttributeSet) : RecyclerView(context, attrs) {
    override fun onInterceptTouchEvent(e: MotionEvent): Boolean {
        // Evita que el RecyclerView intercepte el evento de desplazamiento
        return false
    }
}