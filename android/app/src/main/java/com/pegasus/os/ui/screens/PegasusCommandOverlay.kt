package com.pegasus.os.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.*
import com.pegasus.os.ui.theme.*
import kotlinx.coroutines.launch

/**
 * PEGASUS Global Command Overlay
 *
 * System-wide command overlay accessible through gesture or shortcut.
 * Feels closer to system search / command palette than a chatbot.
 *
 * "Ask PEGASUS or give a command"
 */
@Composable
fun PegasusCommandOverlay(
    coreManager: PegasusCoreManager,
    onDismiss: () -> Unit,
    onNavigateToMission: () -> Unit
) {
    var input by remember { mutableStateOf("") }
    var isProcessing by remember { mutableStateOf(false) }
    var response by remember { mutableStateOf<String?>(null) }
    val focusRequester = remember { FocusRequester() }
    val focusManager = LocalFocusManager.current
    val scope = rememberCoroutineScope()
    val connectionState by coreManager.connectionState.collectAsState()

    // Auto-focus input on show
    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepBackground.copy(alpha = 0.95f))
            .clickable { onDismiss() },
        contentAlignment = Alignment.TopCenter
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 60.dp)
                .clickable { /* Don't dismiss when clicking the command area */ },
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // PEGASUS indicator
            Text(
                text = "\u25C9",
                fontSize = 24.sp,
                color = when (connectionState) {
                    ConnectionState.CONNECTED -> PegasusAccent
                    ConnectionState.CONNECTING -> WarningColor
                    ConnectionState.ERROR -> ErrorColor
                    ConnectionState.DISCONNECTED -> DisabledText
                }
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Command input
            Surface(
                shape = RoundedCornerShape(8.dp),
                color = PrimarySurface,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    TextField(
                        value = input,
                        onValueChange = { input = it },
                        modifier = Modifier
                            .weight(1f)
                            .focusRequester(focusRequester),
                        placeholder = {
                            Text(
                                text = "Ask PEGASUS or give a command",
                                fontSize = 14.sp,
                                color = TertiaryText
                            )
                        },
                        textStyle = LocalTextStyle.current.copy(
                            fontSize = 14.sp,
                            color = PrimaryText
                        ),
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = PrimarySurface,
                            unfocusedContainerColor = PrimarySurface,
                            focusedIndicatorColor = PegasusAccent,
                            unfocusedIndicatorColor = SubtleBorder,
                            cursorColor = PegasusAccent
                        ),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                        keyboardActions = KeyboardActions(
                            onSend = {
                                if (input.isNotBlank() && !isProcessing) {
                                    isProcessing = true
                                    scope.launch {
                                        val result = coreManager.sendGoal(input)
                                        response = when (result) {
                                            is PegasusResponse.Success -> {
                                                val data = result.data
                                                val missionId = data.optString("mission_id", "")
                                                if (missionId.isNotEmpty()) {
                                                    "Mission started. Open Mission Control to track progress."
                                                } else {
                                                    data.optString("message", "Command received.")
                                                }
                                            }
                                            is PegasusResponse.Error -> "Error: ${result.message}"
                                        }
                                        isProcessing = false
                                    }
                                }
                            }
                        )
                    )

                    IconButton(
                        onClick = {
                            if (input.isNotBlank() && !isProcessing) {
                                isProcessing = true
                                scope.launch {
                                    val result = coreManager.sendGoal(input)
                                    response = when (result) {
                                        is PegasusResponse.Success -> {
                                            val data = result.data
                                            val missionId = data.optString("mission_id", "")
                                            if (missionId.isNotEmpty()) "Mission started." else data.optString("message", "Done.")
                                        }
                                        is PegasusResponse.Error -> "Error: ${result.message}"
                                    }
                                    isProcessing = false
                                }
                            }
                        },
                        enabled = input.isNotBlank() && !isProcessing
                    ) {
                        Icon(
                            Icons.Filled.Send,
                            contentDescription = "Send",
                            tint = if (input.isNotBlank()) PegasusAccent else DisabledText,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }

            // Processing indicator
            if (isProcessing) {
                Spacer(modifier = Modifier.height(16.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(
                        color = PegasusAccent,
                        strokeWidth = 2.dp,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Thinking...",
                        fontSize = 12.sp,
                        color = SecondaryText
                    )
                }
            }

            // Response
            response?.let { resp ->
                Spacer(modifier = Modifier.height(16.dp))
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = AccentBackground
                ) {
                    Text(
                        text = resp,
                        modifier = Modifier.padding(12.dp),
                        fontSize = 13.sp,
                        color = PrimaryText,
                        lineHeight = 18.sp
                    )
                }

                // If a mission was started, offer quick navigation
                if (resp.contains("Mission started")) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "\u2192 Open Mission Control",
                        fontSize = 12.sp,
                        color = PegasusAccent,
                        modifier = Modifier.clickable {
                            onDismiss()
                            onNavigateToMission()
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Quick commands
            Text(
                text = "QUICK COMMANDS",
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium,
                color = TertiaryText,
                letterSpacing = 1.sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            val quickCommands = listOf(
                "Open my engineering workspace",
                "Show system status",
                "Research battery cooling",
                "Create a new project"
            )

            quickCommands.forEach { cmd ->
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = SecondaryBackground,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 3.dp)
                        .clickable {
                            input = cmd
                        }
                ) {
                    Text(
                        text = cmd,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                        fontSize = 12.sp,
                        color = SecondaryText
                    )
                }
            }
        }
    }
}
