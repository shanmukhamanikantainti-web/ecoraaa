package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * System Monitor Window
 * Compact technical display of system resources and agent state.
 */
@Composable
fun SystemMonitorScreen(
    coreManager: PegasusCoreManager,
    isWindowed: Boolean = false
) {
    val systemStatus by coreManager.systemStatus.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(12.dp)
    ) {
        Text(
            text = "SYSTEM MONITOR",
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = PrimaryText,
            letterSpacing = 1.sp
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Resource bars
        val resources = listOf(
            ResourceInfo("CPU", 23, SuccessColor),
            ResourceInfo("RAM", 45, SuccessColor),
            ResourceInfo("GPU", 12, SuccessColor),
            ResourceInfo("NPU", 0, DisabledText),
            ResourceInfo("Storage", 67, WarningColor),
            ResourceInfo("Network", 8, SuccessColor),
            ResourceInfo("Battery", 78, SuccessColor),
            ResourceInfo("Thermal", 32, SuccessColor),
        )

        resources.forEach { resource ->
            ResourceBar(resource = resource)
            Spacer(modifier = Modifier.height(6.dp))
        }

        Spacer(modifier = Modifier.height(12.dp))
        HorizontalDivider(color = SubtleBorder, thickness = 1.dp)
        Spacer(modifier = Modifier.height(12.dp))

        // Agent status
        Text(
            text = "AGENTS",
            fontSize = 9.sp,
            fontWeight = FontWeight.SemiBold,
            color = TertiaryText,
            letterSpacing = 1.sp
        )

        Spacer(modifier = Modifier.height(6.dp))

        val agents = listOf(
            AgentStatusInfo("Research Agent", "IDLE", DisabledText),
            AgentStatusInfo("Coding Agent", "IDLE", DisabledText),
            AgentStatusInfo("Testing Agent", "IDLE", DisabledText),
            AgentStatusInfo("Market Agent", "IDLE", DisabledText),
        )

        agents.forEach { agent ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 2.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = agent.name,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    color = SecondaryText
                )
                Text(
                    text = agent.state,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    color = agent.stateColor
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // PEGASUS Core status
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "PEGASUS Core",
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                color = SecondaryText
            )
            Text(
                text = if (systemStatus.coreOnline) "ONLINE" else "OFFLINE",
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                color = if (systemStatus.coreOnline) SuccessColor else ErrorColor
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Uptime",
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                color = SecondaryText
            )
            Text(
                text = formatUptime(systemStatus.uptime),
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                color = TertiaryText
            )
        }
    }
}

data class ResourceInfo(
    val name: String,
    val percent: Int,
    val color: androidx.compose.ui.graphics.Color
)

data class AgentStatusInfo(
    val name: String,
    val state: String,
    val stateColor: androidx.compose.ui.graphics.Color
)

@Composable
fun ResourceBar(resource: ResourceInfo) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = resource.name,
            fontSize = 10.sp,
            fontFamily = FontFamily.Monospace,
            color = SecondaryText,
            modifier = Modifier.width(50.dp)
        )

        LinearProgressIndicator(
            progress = { resource.percent / 100f },
            modifier = Modifier
                .weight(1f)
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = resource.color,
            trackColor = ElevatedSurface,
        )

        Text(
            text = "${resource.percent}%",
            fontSize = 10.sp,
            fontFamily = FontFamily.Monospace,
            color = TertiaryText,
            modifier = Modifier.width(30.dp)
        )
    }
}

private fun formatUptime(seconds: Long): String {
    val hours = seconds / 3600
    val minutes = (seconds % 3600) / 60
    val secs = seconds % 60
    return "%02d:%02d:%02d".format(hours, minutes, secs)
}
