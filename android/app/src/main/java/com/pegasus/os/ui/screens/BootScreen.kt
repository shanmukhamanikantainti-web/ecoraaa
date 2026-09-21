package com.pegasus.os.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.ConnectionState
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*
import kotlinx.coroutines.delay

/**
 * Boot Screen
 * Minimal, professional boot sequence.
 * Background: #090C10, Text: #E6EDF3, Accent: #3FB8A5
 * No cinematic logo animation. No glowing effects.
 */
@Composable
fun BootScreen(
    coreManager: PegasusCoreManager,
    onBootComplete: () -> Unit
) {
    val bootLines = listOf(
        "SYSTEM" to "OK",
        "KERNEL" to "OK",
        "HARDWARE" to "OK",
        "NETWORK" to "OK",
        "STORAGE" to "OK",
        "PEGASUS CORE" to "ONLINE"
    )

    var currentLine by remember { mutableIntStateOf(0) }
    var allComplete by remember { mutableStateOf(false) }

    // Pulse animation for the accent dot
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val dotAlpha by infiniteTransition.animateFloat(
        initialValue = 0.4f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(800, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "dotAlpha"
    )

    // Sequential boot line reveal
    LaunchedEffect(Unit) {
        for (i in bootLines.indices) {
            currentLine = i
            delay(300L)
        }
        delay(400L)
        allComplete = true
        delay(600L)
        onBootComplete()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepBackground),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(48.dp),
            verticalArrangement = Arrangement.Center
        ) {
            // Title
            Text(
                text = "PEGASUS OS",
                fontSize = 28.sp,
                fontWeight = FontWeight.SemiBold,
                fontFamily = FontFamily.Default,
                color = PrimaryText,
                letterSpacing = 2.sp
            )

            Spacer(modifier = Modifier.height(4.dp))

            // Version
            Text(
                text = "v0.1.0",
                fontSize = 11.sp,
                color = TertiaryText,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Boot lines
            bootLines.forEachIndexed { index, (label, status) ->
                val visible = index <= currentLine
                val isComplete = index < currentLine || (index == currentLine && visible)

                if (visible) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.padding(vertical = 2.dp)
                    ) {
                        // Status dot
                        if (index == currentLine && !allComplete) {
                            Text(
                                text = "\u25CF",
                                fontSize = 8.sp,
                                color = PegasusAccent.copy(alpha = dotAlpha),
                                modifier = Modifier.width(12.dp)
                            )
                        } else if (isComplete) {
                            Text(
                                text = "\u2713",
                                fontSize = 10.sp,
                                color = PegasusAccent,
                                modifier = Modifier.width(12.dp)
                            )
                        }

                        Spacer(modifier = Modifier.width(8.dp))

                        // Label with dots
                        Text(
                            text = buildString {
                                append(label)
                                append(" ")
                                append(". ".repeat(maxOf(1, 20 - label.length)))
                            },
                            fontSize = 13.sp,
                            fontFamily = FontFamily.Monospace,
                            color = SecondaryText,
                            letterSpacing = 0.5.sp
                        )

                        Spacer(modifier = Modifier.width(4.dp))

                        // Status
                        val statusColor = if (label == "PEGASUS CORE") {
                            PegasusAccent
                        } else {
                            SuccessColor
                        }
                        Text(
                            text = if (label == "PEGASUS CORE" && index == currentLine && !allComplete) {
                                "STARTING"
                            } else status,
                            fontSize = 13.sp,
                            fontFamily = FontFamily.Monospace,
                            color = if (isComplete || allComplete) statusColor else DisabledText,
                            fontWeight = if (label == "PEGASUS CORE") FontWeight.Medium else FontWeight.Normal,
                            letterSpacing = 0.5.sp
                        )
                    }
                }
            }

            // Final message
            if (allComplete) {
                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "SYSTEM READY",
                    fontSize = 12.sp,
                    fontFamily = FontFamily.Monospace,
                    color = PegasusAccent,
                    letterSpacing = 2.sp
                )
            }
        }
    }
}
