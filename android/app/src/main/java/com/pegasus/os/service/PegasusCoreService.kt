package com.pegasus.os.service

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.util.Log
import com.pegasus.os.PegasusApplication
import com.pegasus.os.R
import com.pegasus.os.core.ConnectionState
import com.pegasus.os.ui.MainActivity
import kotlinx.coroutines.*

/**
 * PEGASUS Core Background Service
 * Maintains connection to the Python PEGASUS Core backend.
 * Runs as a foreground service to prevent being killed by Android.
 */
class PegasusCoreService : Service() {

    companion object {
        private const val TAG = "PegasusCoreService"
        private const val NOTIFICATION_ID = 1001
        const val ACTION_START = "com.pegasus.os.START"
        const val ACTION_STOP = "com.pegasus.os.STOP"
    }

    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var reconnectJob: Job? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        Log.i(TAG, "PEGASUS Core service created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> startService()
            ACTION_STOP -> stopService()
            else -> startService()
        }
        return START_STICKY
    }

    private fun startService() {
        startForeground(NOTIFICATION_ID, createNotification("PEGASUS Core starting..."))
        connectToCore()
    }

    private fun connectToCore() {
        val coreManager = (application as PegasusApplication).coreManager
        coreManager.connect()

        // Monitor connection and reconnect if needed
        reconnectJob = scope.launch {
            coreManager.connectionState.collect { state ->
                when (state) {
                    ConnectionState.CONNECTED -> {
                        updateNotification("PEGASUS Core online")
                    }
                    ConnectionState.CONNECTING -> {
                        updateNotification("PEGASUS Core connecting...")
                    }
                    ConnectionState.ERROR -> {
                        updateNotification("PEGASUS Core connection lost")
                    }
                    ConnectionState.DISCONNECTED -> {
                        updateNotification("PEGASUS Core offline")
                    }
                }
            }
        }
    }

    private fun stopService() {
        val coreManager = (application as PegasusApplication).coreManager
        coreManager.disconnect()
        reconnectJob?.cancel()
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun createNotification(text: String): Notification {
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_IMMUTABLE
        )

        return Notification.Builder(this, PegasusApplication.CHANNEL_SYSTEM)
            .setContentTitle("PEGASUS OS")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_menu_info_details)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    private fun updateNotification(text: String) {
        val notification = createNotification(text)
        val manager = getSystemService(android.app.NotificationManager::class.java)
        manager.notify(NOTIFICATION_ID, notification)
    }

    override fun onDestroy() {
        super.onDestroy()
        scope.cancel()
    }
}
