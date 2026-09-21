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
import com.pegasus.os.ui.theme.*

/**
 * PEGASUS OS — Start Menu / Application Launcher
 *
 * Desktop-style start menu that opens from the taskbar PEGASUS button.
 * Provides search, pinned apps, categories, and PEGASUS commands.
 *
 * Layout:
 * ┌─────────────────────────────────────────┐
 * │ PEGASUS                                 │
 * │ Search applications, files, commands... │
 * ├─────────────────────────────────────────┤
 * │ Pinned                                  │
 * │ Terminal  Code  Files  Settings  Missions│
 * ├─────────────────────────────────────────┤
 * │ Categories                              │
 * │ Development  Research  Internet  System │
 * └─────────────────────────────────────────┘
 */
@Composable
fun StartMenu(
    desktopManager: DesktopManager,
    modifier: Modifier = Modifier
) {
    val isVisible by desktopManager.showStartMenu.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }

    AnimatedVisibility(
        visible = isVisible,
        enter = fadeIn(animationSpec = tween(150)) + slideInVertically(
            animationSpec = tween(200),
            initialOffsetY = { -it / 4 }
        ),
        exit = fadeOut(animationSpec = tween(100))
    ) {
        // Backdrop — click to close
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clickable { desktopManager.closeStartMenu() }
        ) {
            // Menu panel
            Surface(
                modifier = Modifier
                    .width(320.dp)
                    .padding(top = 40.dp, start = 8.dp)
                    .clickable { /* consume click */ },
                shape = RoundedCornerShape(8.dp),
                color = PrimarySurface,
                tonalElevation = 8.dp,
                shadowElevation = 8.dp
            ) {
                Column(
                    modifier = Modifier.padding(12.dp)
                ) {
                    // Search bar
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = {
                            Text(
                                "Search applications, files, commands...",
                                fontSize = 12.sp,
                                color = TertiaryText
                            )
                        },
                        leadingIcon = {
                            Icon(
                                Icons.Outlined.Search,
                                contentDescription = null,
                                tint = TertiaryText,
                                modifier = Modifier.size(16.dp)
                            )
                        },
                        textStyle = LocalTextStyle.current.copy(
                            fontSize = 12.sp,
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

                    Spacer(modifier = Modifier.height(12.dp))

                    // Pinned apps section
                    Text(
                        text = "PINNED",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TertiaryText,
                        letterSpacing = 1.sp,
                        modifier = Modifier.padding(start = 4.dp, bottom = 6.dp)
                    )

                    val pinnedApps = listOf(
                        PinnedApp("Terminal", Icons.Outlined.Code, AppType.TERMINAL),
                        PinnedApp("Code Editor", Icons.Outlined.Edit, AppType.CODE_EDITOR),
                        PinnedApp("Files", Icons.Outlined.FolderOpen, AppType.FILE_MANAGER),
                        PinnedApp("Browser", Icons.Outlined.Language, AppType.BROWSER),
                        PinnedApp("Settings", Icons.Outlined.Settings, AppType.SETTINGS),
                        PinnedApp("Missions", Icons.Outlined.Assignment, AppType.MISSION_CONTROL),
                        PinnedApp("Agents", Icons.Outlined.Hub, AppType.AGENT_MANAGER),
                        PinnedApp("Monitor", Icons.Outlined.Monitor, AppType.SYSTEM_MONITOR),
                    )

                    // Filter by search
                    val filteredApps = if (searchQuery.isNotBlank()) {
                        pinnedApps.filter { it.name.contains(searchQuery, ignoreCase = true) }
                    } else {
                        pinnedApps
                    }

                    // App grid (4 columns)
                    Column {
                        filteredApps.chunked(4).forEach { row ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(4.dp)
                            ) {
                                row.forEach { app ->
                                    StartMenuAppItem(
                                        app = app,
                                        onClick = {
                                            desktopManager.openWindow(app.appType, app.name)
                                            desktopManager.closeStartMenu()
                                        },
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                                // Fill remaining space
                                repeat(4 - row.size) {
                                    Spacer(modifier = Modifier.weight(1f))
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Divider
                    HorizontalDivider(color = SubtleBorder, thickness = 1.dp)

                    Spacer(modifier = Modifier.height(8.dp))

                    // PEGASUS Commands
                    Text(
                        text = "PEGASUS COMMANDS",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = TertiaryText,
                        letterSpacing = 1.sp,
                        modifier = Modifier.padding(start = 4.dp, bottom = 6.dp)
                    )

                    val pegasusCommands = listOf(
                        PegasusQuickCommand("Research a topic", Icons.Outlined.Search),
                        PegasusQuickCommand("Analyze project", Icons.Outlined.Analytics),
                        PegasusQuickCommand("Run tests", Icons.Outlined.BugReport),
                        PegasusQuickCommand("Open workspace", Icons.Outlined.Dashboard),
                    )

                    pegasusCommands.forEach { cmd ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(4.dp))
                                .clickable {
                                    desktopManager.closeStartMenu()
                                    desktopManager.togglePegasusCommand()
                                }
                                .padding(horizontal = 8.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Icon(
                                imageVector = cmd.icon,
                                contentDescription = null,
                                tint = PegasusAccent,
                                modifier = Modifier.size(14.dp)
                            )
                            Text(
                                text = cmd.label,
                                fontSize = 11.sp,
                                color = SecondaryText
                            )
                        }
                    }
                }
            }
        }
    }
}

data class PinnedApp(
    val name: String,
    val icon: ImageVector,
    val appType: AppType
)

data class PegasusQuickCommand(
    val label: String,
    val icon: ImageVector
)

@Composable
fun StartMenuAppItem(
    app: PinnedApp,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .clickable { onClick() }
            .padding(vertical = 8.dp, horizontal = 4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(ElevatedSurface),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = app.icon,
                contentDescription = app.name,
                tint = SecondaryText,
                modifier = Modifier.size(18.dp)
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = app.name,
            fontSize = 9.sp,
            color = SecondaryText,
            maxLines = 1
        )
    }
}
