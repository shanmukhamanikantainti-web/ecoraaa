package com.pegasus.os.desktop

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.ui.theme.*
import kotlin.math.roundToInt

/**
 * PEGASUS OS — Window Frame
 *
 * Wraps application content in a standard desktop window with:
 * - Title bar with app name and window controls
 * - Minimize, maximize, close buttons
 * - Draggable title bar
 * - Focus indication
 *
 * Layout:
 * ┌───────────────────────────────────────────────┐
 * │ Browser                              — □ ×    │
 * ├───────────────────────────────────────────────┤
 * │                                               │
 * │              [Application Content]            │
 * │                                               │
 * └───────────────────────────────────────────────┘
 */
@Composable
fun WindowFrame(
    window: PegasusWindow,
    desktopManager: DesktopManager,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    val density = LocalDensity.current
    val isFocused = window.isFocused

    Box(
        modifier = modifier
            .offset {
                IntOffset(
                    x = window.position.x.roundToInt(),
                    y = window.position.y.roundToInt()
                )
            }
            .then(
                if (window.state == WindowState.MAXIMIZED) {
                    Modifier.fillMaxSize()
                } else {
                    Modifier.size(
                        width = with(density) { window.size.width.toDp() },
                        height = with(density) { window.size.height.toDp() }
                    )
                }
            )
            .clip(RoundedCornerShape(6.dp))
            .background(MainBackground)
            .border(
                width = 1.dp,
                color = if (isFocused) PegasusAccent.copy(alpha = 0.3f) else SubtleBorder,
                shape = RoundedCornerShape(6.dp)
            )
            .pointerInput(window.id) {
                detectDragGestures { change, dragAmount ->
                    change.consume()
                    val newX = window.position.x + dragAmount.x
                    val newY = window.position.y + dragAmount.y
                    desktopManager.moveWindow(
                        window.id,
                        androidx.compose.ui.geometry.Offset(newX, newY)
                    )
                }
            }
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            // ── Title Bar ──
            WindowTitleBar(
                window = window,
                onMinimize = { desktopManager.minimizeWindow(window.id) },
                onMaximize = { desktopManager.maximizeWindow(window.id) },
                onClose = { desktopManager.closeWindow(window.id) },
                onFocus = { desktopManager.focusWindow(window.id) }
            )

            // ── Content Area ──
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(MainBackground)
            ) {
                content()
            }
        }
    }
}

@Composable
fun WindowTitleBar(
    window: PegasusWindow,
    onMinimize: () -> Unit,
    onMaximize: () -> Unit,
    onClose: () -> Unit,
    onFocus: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .height(32.dp)
            .background(
                if (window.isFocused) ElevatedSurface else PrimarySurface
            )
            .clickable { onFocus() },
        verticalAlignment = Alignment.CenterVertically
    ) {
        // App icon
        val icon = when (window.appType) {
            AppType.TERMINAL -> Icons.Filled.Code
            AppType.FILE_MANAGER -> Icons.Filled.FolderOpen
            AppType.CODE_EDITOR -> Icons.Filled.Edit
            AppType.BROWSER -> Icons.Filled.Language
            AppType.MISSION_CONTROL -> Icons.Filled.Assignment
            AppType.AGENT_MANAGER -> Icons.Filled.Hub
            AppType.INTELLIGENCE_CENTER -> Icons.Filled.AutoAwesome
            AppType.SETTINGS -> Icons.Filled.Settings
            AppType.MEMORY -> Icons.Filled.Memory
            AppType.PEGASUS_COMMAND -> Icons.Filled.SmartToy
            AppType.SYSTEM_MONITOR -> Icons.Filled.Monitor
            AppType.RESEARCH_WORKSPACE -> Icons.Filled.Search
            AppType.TESTING_WORKSPACE -> Icons.Filled.BugReport
            AppType.MARKET_WORKSPACE -> Icons.Filled.TrendingUp
        }

        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = if (window.isFocused) PegasusAccent else TertiaryText,
            modifier = Modifier
                .padding(start = 10.dp)
                .size(14.dp)
        )

        // Title
        Text(
            text = window.title,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium,
            color = if (window.isFocused) PrimaryText else SecondaryText,
            modifier = Modifier
                .padding(start = 8.dp)
                .weight(1f)
        )

        // Window controls
        Row(
            modifier = Modifier.padding(end = 6.dp),
            horizontalArrangement = Arrangement.spacedBy(2.dp)
        ) {
            // Minimize
            WindowControlButton(
                onClick = onMinimize,
                icon = "\u2014",
                color = TertiaryText
            )

            // Maximize
            WindowControlButton(
                onClick = onMaximize,
                icon = if (window.state == WindowState.MAXIMIZED) "\u25A3" else "\u25A1",
                color = TertiaryText
            )

            // Close
            WindowControlButton(
                onClick = onClose,
                icon = "\u00D7",
                color = ErrorColor,
                hoverColor = ErrorColor
            )
        }
    }
}

@Composable
fun WindowControlButton(
    onClick: () -> Unit,
    icon: String,
    color: androidx.compose.ui.graphics.Color,
    hoverColor: androidx.compose.ui.graphics.Color = color
) {
    var isHovered by remember { mutableStateOf(false) }

    Box(
        modifier = Modifier
            .size(22.dp)
            .clip(RoundedCornerShape(3.dp))
            .background(
                if (isHovered) color.copy(alpha = 0.15f)
                else androidx.compose.ui.graphics.Color.Transparent
            )
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = icon,
            fontSize = 14.sp,
            color = if (isHovered) hoverColor else color,
            lineHeight = 22.sp
        )
    }
}
