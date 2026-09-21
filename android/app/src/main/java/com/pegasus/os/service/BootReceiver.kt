package com.pegasus.os.service

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

/**
 * Boot Receiver
 * Starts PEGASUS Core service when the device boots.
 */
class BootReceiver : BroadcastReceiver() {

    companion object {
        private const val TAG = "PegasusBoot"
    }

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED ||
            intent.action == "android.intent.action.QUICKBOOT_POWERON") {

            Log.i(TAG, "Boot completed, starting PEGASUS Core service")

            val serviceIntent = Intent(context, PegasusCoreService::class.java).apply {
                action = PegasusCoreService.ACTION_START
            }
            context.startForegroundService(serviceIntent)
        }
    }
}
