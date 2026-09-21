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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*
import kotlinx.coroutines.launch

/**
 * PEGASUS OS — Command Palette
 *
 * System-wide command overlay accessible via Ctrl+Shift+P or taskbar.
 * Feels like VS Code's command palette / Spotlight, not a chatbot.
 *
 * Layout:
 * ┌──────────────────────────────────────────────┐
 * │ PEGASUS                                      │
 * │ > Analyze the current project                │
 * │                                              │
 * │ Suggested                                    │
 * │ Run tests                                    │
 * │ Open engineering workspace                   │
 * │ Research this page                           │
 * └──────────────────────────────────────────────┘
 */
@Composable
fun PegasusCommandPalette(
    desktopManager: DesktopManager,
    coreManager: PegasusCoreManager
) {
    var command by remember { mutableStateOf("") }
    var isExecuting by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    val suggestedCommands = listOf(
        SuggestedCommand("Run tests", Icons.Outlined.BugReport) {
            desktopManager.openWindow(AppType.TESTING_WORKSPACE, "Testing")
        },
        SuggestedCommand("Research a topic", Icons.Outlined.Search) {
            desktopManager.openWindow(AppType.RESEARCH_WORKSPACE, "Research")
        },
        SuggestedCommand("Open terminal", Icons.Outlined.Code) {
            desktopManager.openWindow(AppType.TERMINAL, "Terminal")
        },
        SuggestedCommand("Open files", Icons.Outlined.FolderOpen) {
            desktopManager.openWindow(AppType.FILE_MANAGER, "Files")
        },
        SuggestedCommand("Analyze project", Icons.Outlined.Analytics) {
            desktopManager.openWindow(AppType.MISSION_CONTROL, "Mission Control")
        },
        SuggestedCommand("Open code editor", Icons.Outlined.Edit) {
            desktopManager.openWindow(AppType.CODE_EDITOR, "Code Editor")
        },
        SuggestedCommand("System monitor", Icons.Outlined.Monitor) {
            desktopManager.openWindow(AppType.SYSTEM_MONITOR, "System Monitor")
        },
        SuggestedCommand("Agent manager", Icons.Outlined.Hub) {
            desktopManager.openWindow(AppType.AGENT_MANAGER, "Agents")
        },
    )

    // Backdrop
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepBackground.copy(alpha = 0.6f))
            .clickable { desktopManager.closePegasusCommand() }
    ) {
        // Command palette panel
        Surface(
            modifier = Modifier
                .width(420.dp)
                .padding(top = 80.dp)
                .align(Alignment.TopCenter)
                .clickable { /* consume */ },
            shape = RoundedCornerShape(8.dp),
            color = PrimarySurface,
            tonalElevation = 12.dp,
            shadowElevation = 12.dp
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                // Command input
                OutlinedTextField(
                    value = command,
                    onValueChange = { command = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = {
                        Text(
                            "Give PEGASUS a command...",
                            fontSize = 13.sp,
                            color = TertiaryText
                        )
                    },
                    leadingIcon = {
                        Text(
                            text = "\u25C9",
                            fontSize = 14.sp,
                            color = PegasusAccent,
                            modifier = Modifier.padding(start = 4.dp)
                        )
                    },
                    textStyle = LocalTextStyle.current.copy(
                        fontSize = 13.sp,
                        color = PrimaryText
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PegasusAccent,
                        unfocusedBorderColor = SubtleBorder,
                        cursorColor = PegasusAccent
                    ),
                    singleLine = true,
                    shape = RoundedCornerShape(6.dp)
                )

                // Execute button
                if (command.isNotBlank()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        onClick = {
                            if (command.isNotBlank() && !isExecuting) {
                                isExecuting = true
                                scope.launch {
                                    val result = coreManager.sendGoal(command)
                                    isExecuting = false
                                    desktopManager.closePegasusCommand()
                                    desktopManager.openWindow(
                                        AppType.MISSION_CONTROL,
                                        "Mission Control"
                                    )
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = PegasusAccent,
                            contentColor = DeepBackground
                        ),
                        shape = RoundedCornerShape(6.dp),
                        enabled = !isExecuting
                    ) {
                        if (isExecuting) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(14.dp),
                                strokeWidth = 2.dp,
                                color = DeepBackground
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                        }
                        Text(
                            text = if (isExecuting) "Executing..." else "Execute",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Suggested commands
                Text(
                    text = "SUGGESTED",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TertiaryText,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(start = 4.dp, bottom = 6.dp)
                )

                suggestedCommands.forEach { cmd ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(4.dp))
                            .clickable {
                                cmd.action()
                                desktopManager.closePegasusCommand()
                            }
                            .padding(horizontal = 8.dp, vertical = 7.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Icon(
                            imageVector = cmd.icon,
                            contentDescription = null,
                            tint = PegasusAccent,
                            modifier = Modifier.size(14.dp)
                        )
                        Text(
                            text = cmd.label,
                            fontSize = 12.sp,
                            color = SecondaryText
                        )
                    }
                }
            }
        }
    }
}

data class SuggestedCommand(
    val label: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val action: () -> Unit
)
