package com.pegasus.os.desktop

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.ui.theme.*

/**
 * PEGASUS OS — Workspace Indicator
 *
 * Compact bar at the bottom of the screen showing available workspaces.
 * Click to switch between workspaces.
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Desktop 1 │ Desktop 2 │ Desktop 3 │ Desktop 4                │
 * └─────────────────────────────────────────────────────────────┘
 */
@Composable
fun WorkspaceIndicator(
    desktopManager: DesktopManager,
    modifier: Modifier = Modifier
) {
    val workspaces by desktopManager.workspaces.collectAsState()
    val activeWorkspaceId by desktopManager.activeWorkspaceId.collectAsState()
    val windows by desktopManager.windows.collectAsState()

    Row(
        modifier = modifier
            .fillMaxWidth()
            .height(28.dp)
            .background(DeepBackground)
            .padding(horizontal = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {
        workspaces.forEach { workspace ->
            val isActive = workspace.id == activeWorkspaceId
            val windowCount = windows.count { it.workspaceId == workspace.id }

            Row(
                modifier = Modifier
                    .height(22.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(
                        if (isActive) AccentBackground else PrimarySurface
                    )
                    .clickable { desktopManager.switchWorkspace(workspace.id) }
                    .padding(horizontal = 12.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                // Active indicator dot
                if (isActive) {
                    Box(
                        modifier = Modifier
                            .size(5.dp)
                            .clip(RoundedCornerShape(2.5.dp))
                            .background(PegasusAccent)
                    )
                }

                Text(
                    text = workspace.name,
                    fontSize = 10.sp,
                    fontWeight = if (isActive) FontWeight.Medium else FontWeight.Normal,
                    color = if (isActive) PegasusAccent else SecondaryText,
                    letterSpacing = 0.3.sp
                )

                // Window count badge
                if (windowCount > 0) {
                    Text(
                        text = "$windowCount",
                        fontSize = 8.sp,
                        color = if (isActive) PegasusAccent else TertiaryText
                    )
                }
            }

            Spacer(modifier = Modifier.width(4.dp))
        }
    }
}
