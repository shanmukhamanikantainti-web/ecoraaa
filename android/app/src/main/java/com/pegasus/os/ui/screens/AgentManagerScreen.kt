package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.*
import com.pegasus.os.ui.theme.*

/**
 * Agent Manager
 * Similar to a Linux process manager.
 * Shows active agents, state, task, runtime, CPU, memory.
 * Controls: Pause, Resume, Stop, Inspect
 * "Do not turn this into a colorful analytics dashboard."
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AgentManagerScreen(
    coreManager: PegasusCoreManager,
    onBack: () -> Unit
) {
    var agents by remember { mutableStateOf<List<AgentInfo>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        agents = coreManager.fetchAgents()
        isLoading = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = "AGENTS",
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
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = DeepBackground
            )
        )

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = PegasusAccent, strokeWidth = 2.dp, modifier = Modifier.size(24.dp))
            }
        } else {
            // Column headers
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepBackground)
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("AGENT", fontSize = 10.sp, fontWeight = FontWeight.Medium, color = TertiaryText,
                    letterSpacing = 0.5.sp, modifier = Modifier.weight(1f))
                Text("STATE", fontSize = 10.sp, fontWeight = FontWeight.Medium, color = TertiaryText,
                    letterSpacing = 0.5.sp, modifier = Modifier.weight(0.5f))
                Text("TASK", fontSize = 10.sp, fontWeight = FontWeight.Medium, color = TertiaryText,
                    letterSpacing = 0.5.sp, modifier = Modifier.weight(1f))
                Text("CPU", fontSize = 10.sp, fontWeight = FontWeight.Medium, color = TertiaryText,
                    letterSpacing = 0.5.sp, modifier = Modifier.weight(0.3f))
                Text("MEM", fontSize = 10.sp, fontWeight = FontWeight.Medium, color = TertiaryText,
                    letterSpacing = 0.5.sp, modifier = Modifier.weight(0.3f))
            }

            Divider(color = SubtleBorder, thickness = 1.dp)

            LazyColumn(contentPadding = PaddingValues(vertical = 4.dp)) {
                items(agents) { agent ->
                    AgentRow(agent = agent)
                }
            }

            // Controls at bottom
            if (agents.isNotEmpty()) {
                Divider(color = SubtleBorder, thickness = 1.dp)
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(DeepBackground)
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    AgentControlButton("Pause", Icons.Filled.Pause)
                    AgentControlButton("Resume", Icons.Filled.PlayArrow)
                    AgentControlButton("Stop", Icons.Filled.Stop)
                    AgentControlButton("Inspect", Icons.Filled.Info)
                }
            }
        }
    }
}

@Composable
fun AgentRow(agent: AgentInfo) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(if (agent.state == AgentState.RUNNING) PrimarySurface else MainBackground)
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Agent name
        Text(
            text = agent.name,
            fontSize = 12.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Medium,
            color = PrimaryText,
            modifier = Modifier.weight(1f)
        )

        // State
        val stateColor = when (agent.state) {
            AgentState.RUNNING -> PegasusAccent
            AgentState.IDLE -> TertiaryText
            AgentState.FAILED -> ErrorColor
            AgentState.COMPLETED -> SuccessColor
            AgentState.PAUSED -> WarningColor
            AgentState.PLANNING -> InfoColor
            AgentState.WAITING -> SecondaryText
            AgentState.STOPPED -> DisabledText
        }
        Text(
            text = agent.state.name,
            fontSize = 10.sp,
            fontFamily = FontFamily.Monospace,
            fontWeight = FontWeight.Medium,
            color = stateColor,
            modifier = Modifier.weight(0.5f)
        )

        // Task
        Text(
            text = agent.currentTask ?: "-",
            fontSize = 11.sp,
            color = SecondaryText,
            modifier = Modifier.weight(1f),
            maxLines = 1
        )

        // CPU
        Text(
            text = "${agent.cpuUsage.toInt()}%",
            fontSize = 10.sp,
            fontFamily = FontFamily.Monospace,
            color = TertiaryText,
            modifier = Modifier.weight(0.3f)
        )

        // Memory
        Text(
            text = "${agent.memoryUsage.toInt()}%",
            fontSize = 10.sp,
            fontFamily = FontFamily.Monospace,
            color = TertiaryText,
            modifier = Modifier.weight(0.3f)
        )
    }
}

@Composable
fun AgentControlButton(label: String, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    OutlinedButton(
        onClick = { /* Agent control */ },
        shape = RoundedCornerShape(4.dp),
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = SecondaryText
        ),
        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
        modifier = Modifier.height(28.dp)
    ) {
        Icon(icon, contentDescription = label, modifier = Modifier.size(12.dp))
        Spacer(modifier = Modifier.width(4.dp))
        Text(label, fontSize = 10.sp)
    }
}
