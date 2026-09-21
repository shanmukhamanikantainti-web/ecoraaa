package com.pegasus.os.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.ConnectionState
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.core.SystemStatus
import com.pegasus.os.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

/**
 * PEGASUS OS System Bar
 * Compact top bar: PEGASUS, workspace, time, network, battery, notifications
 * Must feel like a real OS component, not oversized.
 */
@Composable
fun SystemBar(
    coreManager: PegasusCoreManager,
    modifier: Modifier = Modifier
) {
    val connectionState by coreManager.connectionState.collectAsState()
    val systemStatus by coreManager.systemStatus.collectAsState()
    var currentTime by remember { mutableStateOf(getTimeString()) }

    // Update clock every second
    LaunchedEffect(Unit) {
        while (true) {
            currentTime = getTimeString()
            kotlinx.coroutines.delay(1000)
        }
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .background(DeepBackground.copy(alpha = 0.95f))
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        // Left: PEGASUS + workspace
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // PEGASUS indicator
            Text(
                text = "\u25C9",
                fontSize = 12.sp,
                color = when (connectionState) {
                    ConnectionState.CONNECTED -> PegasusAccent
                    ConnectionState.CONNECTING -> WarningColor
                    ConnectionState.ERROR -> ErrorColor
                    ConnectionState.DISCONNECTED -> DisabledText
                }
            )
            Text(
                text = "PEGASUS",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = PrimaryText,
                letterSpacing = 1.5.sp
            )

            Text(
                text = "\u2022",
                fontSize = 8.sp,
                color = SubtleBorder
            )

            Text(
                text = "HOME",
                fontSize = 10.sp,
                color = TertiaryText,
                letterSpacing = 0.5.sp
            )
        }

        // Right: time, network, battery
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Network indicator
            Icon(
                imageVector = Icons.Outlined.Wifi,
                contentDescription = "Network",
                tint = SuccessColor,
                modifier = Modifier.size(14.dp)
            )

            // Battery
            Icon(
                imageVector = Icons.Outlined.BatteryFull,
                contentDescription = "Battery",
                tint = SuccessColor,
                modifier = Modifier.size(14.dp)
            )

            // Time
            Text(
                text = currentTime,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = SecondaryText,
                letterSpacing = 0.5.sp
            )
        }
    }
}

private fun getTimeString(): String {
    val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
    return sdf.format(Date())
}
