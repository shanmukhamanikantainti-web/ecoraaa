package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
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
 * Mission Control
 * Shows active PEGASUS goals and their execution state.
 * Feels like a system task manager, not project-management SaaS.
 *
 * Example:
 *   MISSION CONTROL
 *   Battery Research
 *   Planning    ✓
 *   Research    ✓
 *   Analysis    ●
 *   Coding      ○
 *   Testing     ○
 *   Report      ○
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MissionControlScreen(
    coreManager: PegasusCoreManager,
    onBack: () -> Unit
) {
    var missions by remember { mutableStateOf<List<Mission>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        missions = coreManager.fetchMissions()
        isLoading = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        // Header
        TopAppBar(
            title = {
                Text(
                    text = "MISSION CONTROL",
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
                containerColor = DeepBackground,
                titleContentColor = PrimaryText
            )
        )

        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    color = PegasusAccent,
                    strokeWidth = 2.dp,
                    modifier = Modifier.size(24.dp)
                )
            }
        } else if (missions.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "No active missions",
                        fontSize = 14.sp,
                        color = TertiaryText
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Give PEGASUS a goal to get started",
                        fontSize = 12.sp,
                        color = DisabledText
                    )
                }
            }
        } else {
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(missions) { mission ->
                    MissionCard(mission = mission)
                }
            }
        }
    }
}

@Composable
fun MissionCard(mission: Mission) {
    Surface(
        shape = RoundedCornerShape(6.dp),
        color = PrimarySurface,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Mission goal
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = mission.goal,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    color = PrimaryText,
                    modifier = Modifier.weight(1f)
                )
                MissionStatusBadge(status = mission.status)
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Steps
            mission.steps.forEach { step ->
                MissionStepRow(step = step)
                Spacer(modifier = Modifier.height(4.dp))
            }
        }
    }
}

@Composable
fun MissionStepRow(step: MissionStep) {
    Row(
        modifier = Modifier.padding(vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        val (symbol, color) = when (step.status) {
            StepStatus.COMPLETED -> "\u2713" to SuccessColor
            StepStatus.RUNNING -> "\u25CF" to PegasusAccent
            StepStatus.FAILED -> "\u2717" to ErrorColor
            StepStatus.PENDING -> "\u25CB" to DisabledText
        }

        Text(
            text = symbol,
            fontSize = 12.sp,
            color = color,
            modifier = Modifier.width(16.dp)
        )

        Text(
            text = step.name,
            fontSize = 12.sp,
            fontFamily = FontFamily.Monospace,
            color = when (step.status) {
                StepStatus.COMPLETED -> SecondaryText
                StepStatus.RUNNING -> PrimaryText
                StepStatus.FAILED -> ErrorColor
                StepStatus.PENDING -> DisabledText
            },
            modifier = Modifier.weight(1f)
        )

        step.agent?.let { agent ->
            Text(
                text = agent,
                fontSize = 10.sp,
                color = TertiaryText
            )
        }
    }
}

@Composable
fun MissionStatusBadge(status: MissionStatus) {
    val (text, color) = when (status) {
        MissionStatus.PLANNING -> "PLANNING" to InfoColor
        MissionStatus.RUNNING -> "RUNNING" to PegasusAccent
        MissionStatus.COMPLETED -> "DONE" to SuccessColor
        MissionStatus.FAILED -> "FAILED" to ErrorColor
        MissionStatus.PAUSED -> "PAUSED" to WarningColor
    }

    Surface(
        shape = RoundedCornerShape(4.dp),
        color = color.copy(alpha = 0.15f)
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
            fontSize = 9.sp,
            fontWeight = FontWeight.Medium,
            color = color,
            letterSpacing = 0.5.sp
        )
    }
}
