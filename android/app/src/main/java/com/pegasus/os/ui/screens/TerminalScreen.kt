package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.input.key.*
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * Terminal
 * Must look authentic. Dark background #090C10, monospace font,
 * subtle text, teal prompt, red errors.
 * "Do not make it look like a movie hacker terminal."
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TerminalScreen(
    coreManager: PegasusCoreManager,
    onBack: (() -> Unit)? = null,
    isWindowed: Boolean = false
) {
    var commandHistory by remember { mutableStateOf(
        listOf<TerminalLine>(
            TerminalLine("PEGASUS OS Terminal v0.1.0", LineType.SYSTEM),
            TerminalLine("Type 'help' for available commands.", LineType.SYSTEM),
            TerminalLine("", LineType.EMPTY)
        )
    ) }
    var currentInput by remember { mutableStateOf("") }
    val scrollState = rememberScrollState()
    val focusManager = LocalFocusManager.current

    // Auto-scroll to bottom
    LaunchedEffect(commandHistory.size) {
        scrollState.animateScrollTo(scrollState.maxValue)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepBackground)
    ) {
        if (!isWindowed) {
            // Header (only in full-screen mode)
            TopAppBar(
                title = {
                    Text(
                        text = "TERMINAL",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        letterSpacing = 1.5.sp,
                        color = PrimaryText
                    )
                },
                navigationIcon = {
                    onBack?.let { back ->
                        IconButton(onClick = back) {
                            Icon(Icons.Filled.ArrowBack, "Back", tint = SecondaryText, modifier = Modifier.size(20.dp))
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = DeepBackground)
            )
            Divider(color = SubtleBorder, thickness = 1.dp)
        }

        // Terminal content
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(scrollState)
                .padding(12.dp)
        ) {
            commandHistory.forEach { line ->
                TerminalLineDisplay(line = line)
            }

            // Current input line
            Row {
                Text(
                    text = "pegasus@device",
                    fontSize = 13.sp,
                    fontFamily = FontFamily.Monospace,
                    color = PegasusAccent
                )
                Text(
                    text = ":~$ ",
                    fontSize = 13.sp,
                    fontFamily = FontFamily.Monospace,
                    color = PegasusAccent
                )
                BasicTextField(
                    value = currentInput,
                    onValueChange = { currentInput = it },
                    modifier = Modifier
                        .weight(1f)
                        .onPreviewKeyEvent { event ->
                            if (event.type == KeyEventType.KeyDown && event.key == Key.Enter) {
                                if (currentInput.isNotBlank()) {
                                    val cmd = currentInput
                                    commandHistory = commandHistory + TerminalLine(
                                        "pegasus@device:~$ $cmd",
                                        LineType.COMMAND
                                    )
                                    // Process command
                                    val output = processTerminalCommand(cmd, coreManager)
                                    commandHistory = commandHistory + output
                                    currentInput = ""
                                }
                                true
                            } else false
                        },
                    textStyle = TextStyle(
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace,
                        color = PrimaryText
                    ),
                    cursorBrush = SolidColor(PegasusAccent),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.None)
                )
            }
        }
    }
}

data class TerminalLine(
    val text: String,
    val type: LineType
)

enum class LineType {
    SYSTEM, COMMAND, OUTPUT, ERROR, SUCCESS, WARNING, EMPTY
}

@Composable
fun TerminalLineDisplay(line: TerminalLine) {
    val color = when (line.type) {
        LineType.SYSTEM -> TertiaryText
        LineType.COMMAND -> PrimaryText
        LineType.OUTPUT -> SecondaryText
        LineType.ERROR -> ErrorColor
        LineType.SUCCESS -> SuccessColor
        LineType.WARNING -> WarningColor
        LineType.EMPTY -> PrimaryText
    }

    Text(
        text = line.text,
        fontSize = 13.sp,
        fontFamily = FontFamily.Monospace,
        color = color,
        lineHeight = 18.sp,
        modifier = Modifier.padding(vertical = 1.dp)
    )
}

private fun processTerminalCommand(cmd: String, coreManager: PegasusCoreManager): List<TerminalLine> {
    return when {
        cmd == "help" -> listOf(
            TerminalLine("Available commands:", LineType.SYSTEM),
            TerminalLine("  help          Show this help", LineType.OUTPUT),
            TerminalLine("  status        Show PEGASUS status", LineType.OUTPUT),
            TerminalLine("  agents        List active agents", LineType.OUTPUT),
            TerminalLine("  missions      List active missions", LineType.OUTPUT),
            TerminalLine("  memory        Show PEGASUS memory", LineType.OUTPUT),
            TerminalLine("  clear         Clear terminal", LineType.OUTPUT),
            TerminalLine("  run <file>    Execute a file", LineType.OUTPUT),
            TerminalLine("", LineType.EMPTY)
        )
        cmd == "status" -> listOf(
            TerminalLine("Checking PEGASUS status...", LineType.SYSTEM),
            TerminalLine("PEGASUS Core: Responding", LineType.SUCCESS),
            TerminalLine("", LineType.EMPTY)
        )
        cmd == "agents" -> listOf(
            TerminalLine("Querying agents...", LineType.SYSTEM),
            TerminalLine("Use Agent Manager for detailed view", LineType.OUTPUT),
            TerminalLine("", LineType.EMPTY)
        )
        cmd == "missions" -> listOf(
            TerminalLine("Querying missions...", LineType.SYSTEM),
            TerminalLine("Use Mission Control for detailed view", LineType.OUTPUT),
            TerminalLine("", LineType.EMPTY)
        )
        cmd == "memory" -> listOf(
            TerminalLine("Querying PEGASUS memory...", LineType.SYSTEM),
            TerminalLine("Use Memory UI for management", LineType.OUTPUT),
            TerminalLine("", LineType.EMPTY)
        )
        cmd == "clear" -> listOf(
            TerminalLine("", LineType.EMPTY)
        )
        cmd.startsWith("run ") -> listOf(
            TerminalLine("Executing: ${cmd.removePrefix("run ")}...", LineType.SYSTEM),
            TerminalLine("Execution delegated to Coding Agent", LineType.OUTPUT),
            TerminalLine("", LineType.EMPTY)
        )
        else -> listOf(
            TerminalLine("bash: $cmd: command not found", LineType.ERROR),
            TerminalLine("", LineType.EMPTY)
        )
    }
}
