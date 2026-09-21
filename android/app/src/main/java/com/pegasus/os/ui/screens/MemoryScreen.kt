package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.MemoryState
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * Memory UI
 * Treated as an OS capability, not a chatbot feature.
 *
 * Example:
 *   PEGASUS MEMORY
 *   USER: Engineering student
 *   PROJECTS: Battery Research, Robotics, PEGASUS OS
 *   PREFERENCES: Python, Dark UI, Technical explanations
 *   Controls: Edit, Forget, Delete, Disable Memory
 *   "The user must always have control."
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemoryScreen(
    coreManager: PegasusCoreManager,
    onBack: () -> Unit
) {
    var memory by remember { mutableStateOf(MemoryState()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        memory = coreManager.fetchMemory()
        isLoading = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        TopAppBar(
            title = {
                Text("PEGASUS MEMORY", fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
                    letterSpacing = 1.5.sp, color = PrimaryText)
            },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.Filled.ArrowBack, "Back", tint = SecondaryText, modifier = Modifier.size(20.dp))
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = DeepBackground)
        )

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = PegasusAccent, strokeWidth = 2.dp, modifier = Modifier.size(24.dp))
            }
        } else {
            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp)
            ) {
                // User profile
                MemorySectionHeader("USER")
                MemoryCard {
                    Text(
                        text = memory.user.ifEmpty { "No user profile set" },
                        fontSize = 14.sp,
                        color = PrimaryText
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Projects
                MemorySectionHeader("PROJECTS")
                if (memory.projects.isEmpty()) {
                    MemoryEmptyCard("No projects stored")
                } else {
                    memory.projects.forEach { project ->
                        MemoryItemCard(text = project)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Preferences
                MemorySectionHeader("PREFERENCES")
                if (memory.preferences.isEmpty()) {
                    MemoryEmptyCard("No preferences stored")
                } else {
                    memory.preferences.forEach { pref ->
                        MemoryItemCard(text = pref)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Goals
                MemorySectionHeader("GOALS")
                if (memory.goals.isEmpty()) {
                    MemoryEmptyCard("No goals stored")
                } else {
                    memory.goals.forEach { goal ->
                        MemoryItemCard(text = goal)
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Controls
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    MemoryControlButton("Edit", Icons.Filled.Edit, Modifier.weight(1f))
                    MemoryControlButton("Forget", Icons.Filled.Forget, Modifier.weight(1f))
                    MemoryControlButton("Delete", Icons.Filled.Delete, Modifier.weight(1f))
                }

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedButton(
                    onClick = { /* Disable memory */ },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(4.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = ErrorColor)
                ) {
                    Icon(Icons.Filled.Warning, null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Disable Memory", fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
fun MemorySectionHeader(title: String) {
    Text(
        text = title,
        fontSize = 10.sp,
        fontWeight = FontWeight.SemiBold,
        color = TertiaryText,
        letterSpacing = 1.5.sp,
        modifier = Modifier.padding(bottom = 6.dp)
    )
}

@Composable
fun MemoryCard(content: @Composable () -> Unit) {
    Surface(
        shape = RoundedCornerShape(6.dp),
        color = PrimarySurface,
        modifier = Modifier.fillMaxWidth()
    ) {
        Box(modifier = Modifier.padding(12.dp)) {
            content()
        }
    }
}

@Composable
fun MemoryItemCard(text: String) {
    Surface(
        shape = RoundedCornerShape(4.dp),
        color = PrimarySurface,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "\u2022", fontSize = 10.sp, color = PegasusAccent, modifier = Modifier.width(12.dp))
            Text(text = text, fontSize = 13.sp, color = PrimaryText, modifier = Modifier.weight(1f))
            Icon(Icons.Filled.ChevronRight, null, tint = DisabledText, modifier = Modifier.size(14.dp))
        }
    }
}

@Composable
fun MemoryEmptyCard(message: String) {
    Surface(
        shape = RoundedCornerShape(4.dp),
        color = SecondaryBackground,
        modifier = Modifier.fillMaxWidth()
    ) {
        Text(
            text = message,
            modifier = Modifier.padding(12.dp),
            fontSize = 12.sp,
            color = TertiaryText
        )
    }
}

@Composable
fun MemoryControlButton(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector, modifier: Modifier) {
    OutlinedButton(
        onClick = { },
        modifier = modifier,
        shape = RoundedCornerShape(4.dp),
        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 6.dp)
    ) {
        Icon(icon, null, modifier = Modifier.size(14.dp))
        Spacer(modifier = Modifier.width(4.dp))
        Text(label, fontSize = 11.sp)
    }
}
