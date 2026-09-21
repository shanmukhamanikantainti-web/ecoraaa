package com.pegasus.os.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * ECORAA IDE Screen
 *
 * A full mobile coding environment consisting of:
 *  - File tree sidebar (collapsible)
 *  - Code/text editor with syntax highlighting colours
 *  - Integrated terminal panel (collapsible)
 *
 * Connects to the ECORAA backend for executing terminal commands.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IdeScreen(
    coreManager: PegasusCoreManager
) {
    val connectionState by coreManager.connectionState.collectAsState()
    val scope = rememberCoroutineScope()

    // ── State ──────────────────────────────────────────────────────────
    var showFileTree by remember { mutableStateOf(true) }
    var showTerminal by remember { mutableStateOf(true) }
    var selectedFile by remember { mutableStateOf("main.py") }
    var editorContent by remember { mutableStateOf(STARTER_CODE) }
    var terminalInput by remember { mutableStateOf("") }
    val terminalLines = remember { mutableStateListOf<TerminalLine>() }
    val terminalListState = rememberLazyListState()
    val terminalFocusRequester = remember { FocusRequester() }

    // Seed with a welcome line
    LaunchedEffect(Unit) {
        terminalLines.add(TerminalLine("ECORAA IDE terminal ready. Backend: ${connectionState.name}", isSystem = true))
    }

    // ── Root Layout ────────────────────────────────────────────────────
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(EcoraaBackground)
    ) {
        // ── Toolbar ──────────────────────────────────────────────────
        IdeToolbar(
            fileName = selectedFile,
            showFileTree = showFileTree,
            onToggleFileTree = { showFileTree = !showFileTree },
            showTerminal = showTerminal,
            onToggleTerminal = { showTerminal = !showTerminal },
            onRun = {
                scope.launch {
                    terminalLines.add(TerminalLine("▶ Running $selectedFile...", isSystem = true))
                    delay(300)
                    try {
                        val result = coreManager.executeCommand("python -c \"${editorContent.take(200)}\"")
                        terminalLines.add(TerminalLine(result ?: "[No output]"))
                    } catch (e: Exception) {
                        terminalLines.add(TerminalLine("[Error] ${e.message}", isError = true))
                    }
                    terminalListState.animateScrollToItem(terminalLines.size - 1)
                }
            }
        )

        // ── Main Content ─────────────────────────────────────────────
        Row(modifier = Modifier.weight(1f)) {

            // File Tree
            AnimatedVisibility(
                visible = showFileTree,
                enter = expandHorizontally(tween(200)),
                exit = shrinkHorizontally(tween(200))
            ) {
                FileTreePanel(
                    selectedFile = selectedFile,
                    onSelectFile = { selectedFile = it }
                )
            }

            // Editor
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(EcoraaEditorBg)
            ) {
                CodeEditor(
                    content = editorContent,
                    onContentChange = { editorContent = it }
                )
            }
        }

        // ── Terminal ─────────────────────────────────────────────────
        AnimatedVisibility(
            visible = showTerminal,
            enter = expandVertically(tween(220), expandFrom = Alignment.Top),
            exit = shrinkVertically(tween(200), shrinkTowards = Alignment.Top)
        ) {
            TerminalPanel(
                lines = terminalLines,
                input = terminalInput,
                listState = terminalListState,
                focusRequester = terminalFocusRequester,
                onInputChange = { terminalInput = it },
                onSubmit = {
                    val cmd = terminalInput.trim()
                    if (cmd.isNotEmpty()) {
                        terminalLines.add(TerminalLine("$ $cmd", isCommand = true))
                        terminalInput = ""
                        scope.launch {
                            try {
                                val result = coreManager.executeCommand(cmd)
                                terminalLines.add(TerminalLine(result ?: ""))
                            } catch (e: Exception) {
                                terminalLines.add(TerminalLine("[Error] ${e.message}", isError = true))
                            }
                            terminalListState.animateScrollToItem(terminalLines.size - 1)
                        }
                    }
                }
            )
        }
    }
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

@Composable
private fun IdeToolbar(
    fileName: String,
    showFileTree: Boolean,
    onToggleFileTree: () -> Unit,
    showTerminal: Boolean,
    onToggleTerminal: () -> Unit,
    onRun: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(EcoraaToolbarBg)
            .padding(horizontal = 12.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // File tree toggle
        IconButton(onClick = onToggleFileTree) {
            Icon(
                Icons.Outlined.FolderOpen,
                contentDescription = "Toggle file tree",
                tint = if (showFileTree) EcoraaAccent else EcoraaTextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }

        Spacer(Modifier.width(4.dp))

        // Active file tab
        Box(
            modifier = Modifier
                .background(EcoraaEditorBg, RoundedCornerShape(6.dp))
                .padding(horizontal = 12.dp, vertical = 6.dp)
        ) {
            Text(
                text = fileName,
                style = TextStyle(
                    color = EcoraaTextPrimary,
                    fontFamily = FontFamily.Monospace,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
            )
        }

        Spacer(Modifier.weight(1f))

        // Run button
        IconButton(
            onClick = onRun,
            modifier = Modifier
                .background(EcoraaAccent.copy(alpha = 0.12f), RoundedCornerShape(6.dp))
        ) {
            Icon(
                Icons.Outlined.PlayArrow,
                contentDescription = "Run",
                tint = EcoraaAccent,
                modifier = Modifier.size(20.dp)
            )
        }

        Spacer(Modifier.width(4.dp))

        // Terminal toggle
        IconButton(onClick = onToggleTerminal) {
            Icon(
                Icons.Outlined.Terminal,
                contentDescription = "Toggle terminal",
                tint = if (showTerminal) EcoraaAccent else EcoraaTextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
    Divider(color = EcoraaToolbarBorder, thickness = 0.5.dp)
}

// ── File Tree ─────────────────────────────────────────────────────────────────

private val DEMO_FILES = listOf(
    FileNode("main.py", isDir = false, depth = 0),
    FileNode("src/", isDir = true, depth = 0),
    FileNode("app.py", isDir = false, depth = 1),
    FileNode("models.py", isDir = false, depth = 1),
    FileNode("utils.py", isDir = false, depth = 1),
    FileNode("tests/", isDir = true, depth = 0),
    FileNode("test_main.py", isDir = false, depth = 1),
    FileNode("requirements.txt", isDir = false, depth = 0),
    FileNode("README.md", isDir = false, depth = 0),
)

data class FileNode(val name: String, val isDir: Boolean, val depth: Int)

@Composable
private fun FileTreePanel(
    selectedFile: String,
    onSelectFile: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .width(200.dp)
            .fillMaxHeight()
            .background(EcoraaFileTreeBg)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Outlined.FolderOpen,
                contentDescription = null,
                tint = EcoraaAccent,
                modifier = Modifier.size(16.dp)
            )
            Spacer(Modifier.width(6.dp))
            Text(
                "WORKSPACE",
                style = TextStyle(
                    color = EcoraaTextSecondary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 1.sp
                )
            )
        }
        Divider(color = EcoraaToolbarBorder.copy(alpha = 0.5f), thickness = 0.5.dp)

        // File nodes
        DEMO_FILES.forEach { node ->
            val isSelected = !node.isDir && node.name == selectedFile
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(if (isSelected) EcoraaAccent.copy(alpha = 0.12f) else Color.Transparent)
                    .clickable(enabled = !node.isDir) { onSelectFile(node.name) }
                    .padding(
                        start = (12 + node.depth * 14).dp,
                        end = 8.dp,
                        top = 5.dp,
                        bottom = 5.dp
                    ),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = when {
                        node.isDir -> Icons.Outlined.Folder
                        node.name.endsWith(".py") -> Icons.Outlined.Code
                        node.name.endsWith(".md") -> Icons.Outlined.Description
                        else -> Icons.Outlined.InsertDriveFile
                    },
                    contentDescription = null,
                    tint = when {
                        node.isDir -> EcoraaAccent.copy(alpha = 0.8f)
                        isSelected -> EcoraaAccent
                        else -> EcoraaTextSecondary
                    },
                    modifier = Modifier.size(14.dp)
                )
                Spacer(Modifier.width(6.dp))
                Text(
                    text = node.name,
                    style = TextStyle(
                        color = if (isSelected) EcoraaAccent else EcoraaTextPrimary,
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = if (isSelected) FontWeight.Medium else FontWeight.Normal
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

// ── Code Editor ───────────────────────────────────────────────────────────────

@Composable
private fun CodeEditor(
    content: String,
    onContentChange: (String) -> Unit
) {
    val scrollState = rememberScrollState()
    val lines = content.split("\n")

    Row(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
    ) {
        // Line numbers
        Column(
            modifier = Modifier
                .background(EcoraaEditorBg)
                .padding(horizontal = 10.dp, vertical = 16.dp),
            horizontalAlignment = Alignment.End
        ) {
            lines.forEachIndexed { idx, _ ->
                Text(
                    text = "${idx + 1}",
                    style = TextStyle(
                        color = EcoraaTextSecondary.copy(alpha = 0.5f),
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Monospace,
                        lineHeight = 20.sp
                    )
                )
            }
        }

        // Divider
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .width(0.5.dp)
                .background(EcoraaToolbarBorder.copy(alpha = 0.4f))
        )

        // Editable content
        BasicTextField(
            value = content,
            onValueChange = onContentChange,
            textStyle = TextStyle(
                color = EcoraaTextPrimary,
                fontSize = 13.sp,
                fontFamily = FontFamily.Monospace,
                lineHeight = 20.sp
            ),
            cursorBrush = SolidColor(EcoraaAccent),
            modifier = Modifier
                .weight(1f)
                .padding(start = 12.dp, end = 8.dp, top = 16.dp, bottom = 16.dp)
        )
    }
}

// ── Terminal ──────────────────────────────────────────────────────────────────

data class TerminalLine(
    val text: String,
    val isCommand: Boolean = false,
    val isError: Boolean = false,
    val isSystem: Boolean = false
)

@Composable
private fun TerminalPanel(
    lines: List<TerminalLine>,
    input: String,
    listState: androidx.compose.foundation.lazy.LazyListState,
    focusRequester: FocusRequester,
    onInputChange: (String) -> Unit,
    onSubmit: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .height(200.dp)
            .background(EcoraaTerminalBg)
    ) {
        // Terminal header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Outlined.Terminal,
                contentDescription = null,
                tint = EcoraaAccent,
                modifier = Modifier.size(14.dp)
            )
            Spacer(Modifier.width(6.dp))
            Text(
                "TERMINAL",
                style = TextStyle(
                    color = EcoraaTextSecondary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 1.sp
                )
            )
        }
        Divider(color = EcoraaToolbarBorder.copy(alpha = 0.5f), thickness = 0.5.dp)

        // Output lines
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalArrangement = Arrangement.spacedBy(1.dp)
        ) {
            items(lines) { line ->
                Text(
                    text = line.text,
                    style = TextStyle(
                        color = when {
                            line.isError -> EcoraaError
                            line.isCommand -> EcoraaAccent
                            line.isSystem -> EcoraaTextSecondary
                            else -> EcoraaTextPrimary
                        },
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Monospace,
                        lineHeight = 18.sp
                    )
                )
            }
        }

        // Input row
        Divider(color = EcoraaToolbarBorder.copy(alpha = 0.5f), thickness = 0.5.dp)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "$",
                style = TextStyle(color = EcoraaAccent, fontSize = 13.sp, fontFamily = FontFamily.Monospace)
            )
            Spacer(Modifier.width(8.dp))
            BasicTextField(
                value = input,
                onValueChange = onInputChange,
                textStyle = TextStyle(
                    color = EcoraaTextPrimary,
                    fontSize = 13.sp,
                    fontFamily = FontFamily.Monospace
                ),
                cursorBrush = SolidColor(EcoraaAccent),
                singleLine = true,
                modifier = Modifier
                    .weight(1f)
                    .focusRequester(focusRequester)
            )
            IconButton(onClick = onSubmit, modifier = Modifier.size(28.dp)) {
                Icon(
                    Icons.Outlined.Send,
                    contentDescription = "Run command",
                    tint = EcoraaAccent,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

// ── Starter code ──────────────────────────────────────────────────────────────

private val STARTER_CODE = """# ECORAA — IDE Workspace
# Connected via ECORAA backend

def hello_ecoraa():
    \"\"\"
    ECORAA intelligent development environment.
    Use the ECORAA AI tab to generate, review, and test code.
    \"\"\"
    return "Hello from ECORAA"

if __name__ == "__main__":
    result = hello_ecoraa()
    print(result)
""".trimIndent()
