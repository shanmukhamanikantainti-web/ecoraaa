package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.core.SystemStatus
import com.pegasus.os.ui.components.SystemBar
import com.pegasus.os.ui.theme.*

/**
 * PEGASUS OS Home Screen
 *
 * "The home screen should be mostly empty."
 * "The user should feel: 'This is my operating environment.'"
 * Not an AI dashboard.
 *
 * Contains: wallpaper, system info, workspace indicator,
 * active applications, subtle PEGASUS entry point.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    coreManager: PegasusCoreManager,
    onNavigateToLauncher: () -> Unit,
    onNavigateToWorkspaces: () -> Unit,
    onNavigateToMissionControl: () -> Unit,
    onNavigateToAgentManager: () -> Unit,
    onNavigateToIntelligence: () -> Unit,
    onNavigateToFiles: () -> Unit,
    onNavigateToTerminal: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToMemory: () -> Unit,
    onOpenPegasusCommand: () -> Unit
) {
    val systemStatus by coreManager.systemStatus.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // System Bar
            SystemBar(coreManager = coreManager)

            // Main content — mostly empty
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    // PEGASUS indicator — small, not dominant
                    Text(
                        text = "\u25C9",
                        fontSize = 32.sp,
                        color = PegasusAccent.copy(alpha = 0.6f)
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = "PEGASUS",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        color = TertiaryText,
                        letterSpacing = 4.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Core status
                    Text(
                        text = if (systemStatus.coreOnline) "CORE ONLINE" else "CONNECTING",
                        fontSize = 10.sp,
                        color = if (systemStatus.coreOnline) SuccessColor else WarningColor,
                        letterSpacing = 1.sp
                    )
                }
            }

            // Bottom navigation dock
            HomeDock(
                onNavigateToLauncher = onNavigateToLauncher,
                onNavigateToWorkspaces = onNavigateToWorkspaces,
                onNavigateToMissionControl = onNavigateToMissionControl,
                onNavigateToAgentManager = onNavigateToAgentManager,
                onNavigateToFiles = onNavigateToFiles,
                onNavigateToTerminal = onNavigateToTerminal,
                onNavigateToSettings = onNavigateToSettings,
                onOpenPegasusCommand = onOpenPegasusCommand
            )
        }
    }
}

/**
 * Bottom dock — minimal navigation to core OS surfaces.
 * Touch-friendly, compact.
 */
@Composable
fun HomeDock(
    onNavigateToLauncher: () -> Unit,
    onNavigateToWorkspaces: () -> Unit,
    onNavigateToMissionControl: () -> Unit,
    onNavigateToAgentManager: () -> Unit,
    onNavigateToFiles: () -> Unit,
    onNavigateToTerminal: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onOpenPegasusCommand: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(DeepBackground.copy(alpha = 0.9f))
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        DockItem(
            icon = Icons.Outlined.Apps,
            label = "Apps",
            onClick = onNavigateToLauncher
        )
        DockItem(
            icon = Icons.Outlined.Dashboard,
            label = "Workspaces",
            onClick = onNavigateToWorkspaces
        )
        DockItem(
            icon = Icons.Outlined.Assignment,
            label = "Missions",
            onClick = onNavigateToMissionControl
        )
        DockItem(
            icon = Icons.Outlined.Memory,
            label = "Agents",
            onClick = onNavigateToAgentManager
        )
        DockItem(
            icon = Icons.Outlined.FolderOpen,
            label = "Files",
            onClick = onNavigateToFiles
        )
        DockItem(
            icon = Icons.Outlined.Code,
            label = "Terminal",
            onClick = onNavigateToTerminal
        )
        DockItem(
            icon = Icons.Outlined.Settings,
            label = "Settings",
            onClick = onNavigateToSettings
        )

        // PEGASUS command button — accent colored
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(AccentBackground)
                .clickable { onOpenPegasusCommand() },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "\u25C9",
                fontSize = 16.sp,
                color = PegasusAccent
            )
        }
    }
}

@Composable
fun DockItem(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable { onClick() }
            .padding(horizontal = 6.dp, vertical = 4.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = SecondaryText,
            modifier = Modifier.size(22.dp)
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = label,
            fontSize = 9.sp,
            color = TertiaryText,
            letterSpacing = 0.3.sp
        )
    }
}
