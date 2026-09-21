package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * Workspace Manager
 * Virtual workspaces: Home, Engineering, Research, Personal
 * "Workspace switching should be fast and visually simple."
 * "PEGASUS may automatically organize applications according to the user's goal."
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkspaceScreen(
    coreManager: PegasusCoreManager,
    onBack: () -> Unit
) {
    var activeWorkspace by remember { mutableIntStateOf(0) }

    val workspaces = listOf(
        WorkspaceInfo("HOME", "Default workspace", listOf()),
        WorkspaceInfo("ENGINEERING", "Development environment", listOf("Terminal", "Code Editor", "Files")),
        WorkspaceInfo("RESEARCH", "Research workspace", listOf("Browser", "Notes", "Research Agent")),
        WorkspaceInfo("PERSONAL", "Personal space", listOf("Files", "Notes"))
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        TopAppBar(
            title = {
                Text("WORKSPACES", fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
                    letterSpacing = 1.5.sp, color = PrimaryText)
            },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.Filled.ArrowBack, "Back", tint = SecondaryText, modifier = Modifier.size(20.dp))
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = DeepBackground)
        )

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            workspaces.forEachIndexed { index, workspace ->
                WorkspaceCard(
                    workspace = workspace,
                    isActive = index == activeWorkspace,
                    onClick = { activeWorkspace = index }
                )
            }

            Spacer(modifier = Modifier.weight(1f))

            // Create new workspace
            OutlinedButton(
                onClick = { },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(4.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = PegasusAccent)
            ) {
                Icon(Icons.Filled.Add, null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text("Create Workspace", fontSize = 12.sp)
            }
        }
    }
}

data class WorkspaceInfo(
    val name: String,
    val description: String,
    val apps: List<String>
)

@Composable
fun WorkspaceCard(
    workspace: WorkspaceInfo,
    isActive: Boolean,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(6.dp),
        color = if (isActive) AccentBackground else PrimarySurface,
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Active indicator
            if (isActive) {
                Box(
                    modifier = Modifier
                        .size(6.dp)
                        .background(PegasusAccent, RoundedCornerShape(3.dp))
                )
                Spacer(modifier = Modifier.width(10.dp))
            } else {
                Spacer(modifier = Modifier.width(16.dp))
            }

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = workspace.name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = if (isActive) PegasusAccent else PrimaryText,
                    letterSpacing = 1.sp
                )
                Text(
                    text = workspace.description,
                    fontSize = 11.sp,
                    color = TertiaryText
                )
                if (workspace.apps.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = workspace.apps.joinToString(" \u2022 "),
                        fontSize = 10.sp,
                        color = DisabledText
                    )
                }
            }

            if (isActive) {
                Text(
                    text = "ACTIVE",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Medium,
                    color = PegasusAccent,
                    letterSpacing = 0.5.sp
                )
            }
        }
    }
}
