package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import com.pegasus.os.ui.theme.*

/**
 * Application Launcher
 * Categories: System, Development, Internet, Research, Files, Utilities, Settings
 * Simple icons, professional layout.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LauncherScreen(
    coreManager: PegasusCoreManager,
    onBack: () -> Unit,
    onOpenPegasusCommand: () -> Unit
) {
    var selectedCategory by remember { mutableStateOf("System") }
    val categories = listOf("System", "Development", "Internet", "Research", "Files", "Utilities", "Settings")

    val apps = mapOf(
        "System" to listOf(
            AppInfo("Terminal", Icons.Outlined.Code, "Terminal"),
            AppInfo("Files", Icons.Outlined.FolderOpen, "File Manager"),
            AppInfo("Settings", Icons.Outlined.Settings, "System Settings"),
            AppInfo("Memory", Icons.Outlined.Memory, "PEGASUS Memory"),
            AppInfo("Missions", Icons.Outlined.Assignment, "Mission Control"),
            AppInfo("Agents", Icons.Outlined.Hub, "Agent Manager")
        ),
        "Development" to listOf(
            AppInfo("Code Editor", Icons.Outlined.Edit, "Code Editor"),
            AppInfo("Git", Icons.Outlined.Commit, "Version Control"),
            AppInfo("Python", Icons.Outlined.Code, "Python Runtime"),
            AppInfo("ADB", Icons.Outlined.PhoneAndroid, "Android Debug Bridge")
        ),
        "Internet" to listOf(
            AppInfo("Browser", Icons.Outlined.Language, "Web Browser"),
            AppInfo("Research", Icons.Outlined.Search, "Research Tool"),
            AppInfo("Downloads", Icons.Outlined.FileDownload, "Downloads")
        ),
        "Research" to listOf(
            AppInfo("Research Agent", Icons.Outlined.Psychology, "Research Agent"),
            AppInfo("Intelligence", Icons.Outlined.AutoAwesome, "Intelligence Center"),
            AppInfo("Bookmarks", Icons.Outlined.Bookmark, "Research Bookmarks")
        ),
        "Files" to listOf(
            AppInfo("File Manager", Icons.Outlined.FolderOpen, "File Manager"),
            AppInfo("Documents", Icons.Outlined.Description, "Documents"),
            AppInfo("Projects", Icons.Outlined.Work, "Projects"),
            AppInfo("Downloads", Icons.Outlined.FileDownload, "Downloads")
        ),
        "Utilities" to listOf(
            AppInfo("Calculator", Icons.Outlined.Calculate, "Calculator"),
            AppInfo("Clock", Icons.Outlined.Schedule, "Clock"),
            AppInfo("Notes", Icons.Outlined.Notes, "Notes"),
            AppInfo("Monitor", Icons.Outlined.Monitor, "System Monitor")
        ),
        "Settings" to listOf(
            AppInfo("System", Icons.Outlined.Settings, "System Settings"),
            AppInfo("Network", Icons.Outlined.Wifi, "Network"),
            AppInfo("Display", Icons.Outlined.Brightness6, "Display"),
            AppInfo("Power", Icons.Outlined.BatteryStd, "Power"),
            AppInfo("Privacy", Icons.Outlined.Security, "Privacy"),
            AppInfo("PEGASUS", Icons.Outlined.SmartToy, "AI Settings")
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "APPLICATIONS",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = PrimaryText,
                letterSpacing = 1.5.sp
            )
            Text(
                text = "\u2190",
                fontSize = 18.sp,
                color = SecondaryText,
                modifier = Modifier.clickable { onBack() }
            )
        }

        // Category tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            categories.forEach { category ->
                val isSelected = category == selectedCategory
                Surface(
                    onClick = { selectedCategory = category },
                    shape = RoundedCornerShape(4.dp),
                    color = if (isSelected) AccentBackground else PrimarySurface,
                    modifier = Modifier.height(28.dp)
                ) {
                    Text(
                        text = category,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                        fontSize = 11.sp,
                        color = if (isSelected) PegasusAccent else SecondaryText,
                        fontWeight = if (isSelected) FontWeight.Medium else FontWeight.Normal,
                        letterSpacing = 0.3.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // App grid
        val currentApps = apps[selectedCategory] ?: emptyList()
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(currentApps) { app ->
                LauncherAppItem(app = app)
            }
        }
    }
}

data class AppInfo(
    val name: String,
    val icon: ImageVector,
    val description: String
)

@Composable
fun LauncherAppItem(app: AppInfo) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(6.dp))
            .clickable { /* Launch app */ }
            .padding(vertical = 8.dp)
    ) {
        Box(
            modifier = Modifier
                .size(44.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(PrimarySurface),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = app.icon,
                contentDescription = app.name,
                tint = SecondaryText,
                modifier = Modifier.size(22.dp)
            )
        }
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = app.name,
            fontSize = 10.sp,
            color = SecondaryText,
            maxLines = 1
        )
    }
}
