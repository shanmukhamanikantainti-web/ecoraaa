package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * File Manager
 * Professional Linux-style file management.
 * Structure: Home, Documents, Downloads, Projects, Devices, Network
 * Include: Path, Search, File list, Metadata, Storage info
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FileManagerScreen(
    coreManager: PegasusCoreManager,
    onBack: () -> Unit
) {
    var currentPath by remember { mutableStateOf("/storage/emulated/0") }

    val files = listOf(
        FileEntry("Documents", "Folder", "12 items", Icons.Outlined.Folder, true),
        FileEntry("Downloads", "Folder", "5 items", Icons.Outlined.Folder, true),
        FileEntry("Projects", "Folder", "3 items", Icons.Outlined.Folder, true),
        FileEntry("Pictures", "Folder", "24 items", Icons.Outlined.Folder, true),
        FileEntry("pegasus-core", "Folder", "Agent system", Icons.Outlined.Folder, true),
        FileEntry("research-battery.py", "Python", "14.2 KB", Icons.Outlined.Description, false),
        FileEntry("simulation.py", "Python", "8.7 KB", Icons.Outlined.Description, false),
        FileEntry("notes.md", "Markdown", "2.1 KB", Icons.Outlined.Description, false),
        FileEntry("config.json", "JSON", "0.4 KB", Icons.Outlined.Settings, false),
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = "FILES",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 1.5.sp,
                    color = PrimaryText
                )
            },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.Filled.ArrowBack, "Back", tint = SecondaryText, modifier = Modifier.size(20.dp))
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = DeepBackground)
        )

        // Path bar
        Surface(
            color = SecondaryBackground,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Outlined.Home, "Home", tint = TertiaryText, modifier = Modifier.size(14.dp))
                Text(
                    text = currentPath,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace,
                    color = SecondaryText,
                    modifier = Modifier.padding(start = 6.dp)
                )
            }
        }

        // File list
        LazyColumn(
            contentPadding = PaddingValues(vertical = 4.dp)
        ) {
            items(files) { file ->
                FileRow(file = file)
            }
        }

        // Storage info
        Divider(color = SubtleBorder, thickness = 1.dp)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(DeepBackground)
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Storage: 78.2 GB / 128 GB", fontSize = 10.sp, color = TertiaryText)
            Text("60% used", fontSize = 10.sp, color = TertiaryText)
        }
    }
}

data class FileEntry(
    val name: String,
    val type: String,
    val size: String,
    val icon: ImageVector,
    val isDirectory: Boolean
)

@Composable
fun FileRow(file: FileEntry) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { }
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = file.icon,
            contentDescription = file.name,
            tint = if (file.isDirectory) WarningColor else SecondaryText,
            modifier = Modifier.size(18.dp)
        )

        Spacer(modifier = Modifier.width(12.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = file.name,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = PrimaryText
            )
            Text(
                text = "${file.type} \u2022 ${file.size}",
                fontSize = 10.sp,
                color = TertiaryText
            )
        }
    }
}
