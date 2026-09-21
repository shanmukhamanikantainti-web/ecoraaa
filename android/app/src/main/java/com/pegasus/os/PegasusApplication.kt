package com.pegasus.os

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.core.ConnectionState

/**
 * PEGASUS OS Application
 * Initializes system services, notification channels, and PEGASUS Core connection.
 */
class PegasusApplication : Application() {

    lateinit var coreManager: PegasusCoreManager
        private set

    override fun onCreate() {
        super.onCreate()
        instance = this
        coreManager = PegasusCoreManager(this)
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)

            val systemChannel = NotificationChannel(
                CHANNEL_SYSTEM,
                "System",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "PEGASUS OS system notifications"
            }

            val agentChannel = NotificationChannel(
                CHANNEL_AGENTS,
                "Agents",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Agent activity notifications"
            }

            val criticalChannel = NotificationChannel(
                CHANNEL_CRITICAL,
                "Critical",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Critical system notifications"
            }

            manager.createNotificationChannel(systemChannel)
            manager.createNotificationChannel(agentChannel)
            manager.createNotificationChannel(criticalChannel)
        }
    }

    companion object {
        const val CHANNEL_SYSTEM = "pegasus_system"
        const val CHANNEL_AGENTS = "pegasus_agents"
        const val CHANNEL_CRITICAL = "pegasus_critical"

        lateinit var instance: PegasusApplication
            private set
    }
}
