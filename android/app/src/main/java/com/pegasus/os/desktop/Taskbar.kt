package com.pegasus.os.desktop

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.ConnectionState
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

/**
 * PEGASUS OS — Desktop Taskbar
 *
 * Positioned at the top of the screen.
 * Contains: PEGASUS launcher, workspace indicator, running apps, system tray.
 *
 * Layout:
 * ┌────────────────────────────────────────────────────────────────┐
 * │ PEGASUS │ Workspace │ Running Apps          │ Network │ 13:42 │
 * └────────────────────────────────────────────────────────────────┘
 */
@Composable
fun PegasusTaskbar(
    desktopManager: DesktopManager,
    modifier: Modifier = Modifier
) {
    val windows by desktopManager.windows.collectAsState()
    val activeWorkspaceId by desktopManager.activeWorkspaceId.collectAsState()
    val workspaces by desktopManager.workspaces.collectAsState()
    val focusedWindowId by desktopManager.focusedWindowId.collectAsState()
    val coreManager = desktopManager.getPegasusCore()
    val connectionState by coreManager.connectionState.collectAsState()
    var currentTime by remember { mutableStateOf(getTimeString()) }

    // Update clock
    LaunchedEffect(Unit) {
        while (true) {
            currentTime = getTimeString()
            kotlinx.coroutines.delay(1000)
        }
    }

    val activeWorkspace = workspaces.find { it.id == activeWorkspaceId }
    val runningWindows = windows.filter { it.workspaceId == activeWorkspaceId }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(36.dp)
            .background(DeepBackground)
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // ── Left: PEGASUS Button + Workspace ──

        // PEGASUS launcher button
        Row(
            modifier = Modifier
                .height(28.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(AccentBackground)
                .clickable { desktopManager.toggleStartMenu() }
                .padding(horizontal = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            Text(
                text = "\u25C9",
                fontSize = 12.sp,
                color = PegasusAccent
            )
            Text(
                text = "PEGASUS",
                fontSize = 10.sp,
                fontWeight = FontWeight.SemiBold,
                color = PegasusAccent,
                letterSpacing = 1.sp
            )
        }

        Spacer(modifier = Modifier.width(8.dp))

        // Workspace indicator
        Row(
            modifier = Modifier
                .height(28.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(PrimarySurface)
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = activeWorkspace?.name ?: "Desktop 1",
                fontSize = 10.sp,
                color = SecondaryText,
                letterSpacing = 0.5.sp
            )
        }

        Spacer(modifier = Modifier.width(8.dp))

        // ── Center: Running Application Tabs ──

        Row(
            modifier = Modifier.weight(1f),
            horizontalArrangement = Arrangement.spacedBy(2.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            runningWindows.forEach { window ->
                val isFocused = window.id == focusedWindowId
                TaskbarAppTab(
                    window = window,
                    isFocused = isFocused,
                    onClick = {
                        if (isFocused) {
                            desktopManager.minimizeWindow(window.id)
                        } else {
                            desktopManager.focusWindow(window.id)
                        }
                    },
                    onClose = { desktopManager.closeWindow(window.id) }
                )
            }
        }

        // ── Right: System Tray ──

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            // PEGASUS status indicator
            Text(
                text = "\u25C9",
                fontSize = 10.sp,
                color = when (connectionState) {
                    ConnectionState.CONNECTED -> PegasusAccent
                    ConnectionState.CONNECTING -> WarningColor
                    ConnectionState.ERROR -> ErrorColor
                    ConnectionState.DISCONNECTED -> DisabledText
                }
            )

            // Network
            Icon(
                imageVector = Icons.Outlined.Wifi,
                contentDescription = "Network",
                tint = SuccessColor,
                modifier = Modifier.size(14.dp)
            )

            // Battery
            Icon(
                imageVector = Icons.Outlined.BatteryStd,
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

@Composable
fun TaskbarAppTab(
    window: PegasusWindow,
    isFocused: Boolean,
    onClick: () -> Unit,
    onClose: () -> Unit
) {
    Row(
        modifier = Modifier
            .height(26.dp)
            .clip(RoundedCornerShape(4.dp))
            .background(
                if (isFocused) ElevatedSurface else PrimarySurface
            )
            .clickable { onClick() }
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        // App icon (small)
        val icon = when (window.appType) {
            AppType.TERMINAL -> Icons.Outlined.Code
            AppType.FILE_MANAGER -> Icons.Outlined.FolderOpen
            AppType.CODE_EDITOR -> Icons.Outlined.Edit
            AppType.BROWSER -> Icons.Outlined.Language
            AppType.MISSION_CONTROL -> Icons.Outlined.Assignment
            AppType.AGENT_MANAGER -> Icons.Outlined.Hub
            AppType.INTELLIGENCE_CENTER -> Icons.Outlined.AutoAwesome
            AppType.SETTINGS -> Icons.Outlined.Settings
            AppType.MEMORY -> Icons.Outlined.Memory
            AppType.PEGASUS_COMMAND -> Icons.Outlined.SmartToy
            AppType.SYSTEM_MONITOR -> Icons.Outlined.Monitor
            AppType.RESEARCH_WORKSPACE -> Icons.Outlined.Search
            AppType.TESTING_WORKSPACE -> Icons.Outlined.BugReport
            AppType.MARKET_WORKSPACE -> Icons.Outlined.TrendingUp
        }

        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = if (isFocused) PegasusAccent else SecondaryText,
            modifier = Modifier.size(12.dp)
        )

        Text(
            text = window.title,
            fontSize = 10.sp,
            color = if (isFocused) PrimaryText else SecondaryText,
            maxLines = 1
        )

        // Close button (visible on hover/focus)
        if (isFocused) {
            Text(
                text = "\u00D7",
                fontSize = 12.sp,
                color = TertiaryText,
                modifier = Modifier
                    .size(14.dp)
                    .clip(RoundedCornerShape(2.dp))
                    .clickable { onClose() }
                    .padding(1.dp),
                lineHeight = 14.sp
            )
        }
    }
}

private fun getTimeString(): String {
    val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
    return sdf.format(Date())
}
