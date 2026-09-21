package com.pegasus.os.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
import java.text.SimpleDateFormat
import java.util.*

/**
 * ECORAA AI Screen
 *
 * The primary AI command interface for the ECORAA Android companion.
 *
 * Interaction model:
 *   Intent → Planning → Execution → Result
 *
 * NOT a chat bubble interface. Shows:
 *   - Goal input
 *   - Agent pipeline progress (with steps)
 *   - Completed results
 *   - Connection status
 */
@Composable
fun EcoraaAiScreen(
    coreManager: PegasusCoreManager
) {
    val connectionState by coreManager.connectionState.collectAsState()
    val scope = rememberCoroutineScope()

    val conversations = remember { mutableStateListOf<AiConversation>() }
    val listState = rememberLazyListState()
    var inputText by remember { mutableStateOf("") }
    var isProcessing by remember { mutableStateOf(false) }

    // Scroll to bottom when new content appears
    LaunchedEffect(conversations.size) {
        if (conversations.isNotEmpty()) {
            delay(100)
            listState.animateScrollToItem(conversations.size - 1)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(EcoraaBackground)
    ) {
        // ── Header ──────────────────────────────────────────────────
        AiHeader(connectionState = connectionState.name)

        // ── Conversation Area ────────────────────────────────────────
        Box(modifier = Modifier.weight(1f)) {
            if (conversations.isEmpty()) {
                EmptyAiState(
                    onSuggestionClick = { suggestion ->
                        inputText = suggestion
                    }
                )
            } else {
                LazyColumn(
                    state = listState,
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(conversations) { conv ->
                        ConversationItem(conv)
                    }
                }
            }

            // Processing overlay indicator (subtle, not intrusive)
            if (isProcessing) {
                ProcessingBanner(modifier = Modifier.align(Alignment.TopCenter))
            }
        }

        // ── Input Area ───────────────────────────────────────────────
        AiInputArea(
            value = inputText,
            onValueChange = { inputText = it },
            isProcessing = isProcessing,
            onSubmit = {
                val goal = inputText.trim()
                if (goal.isNotEmpty() && !isProcessing) {
                    inputText = ""
                    isProcessing = true

                    val conv = AiConversation(
                        goal = goal,
                        timestamp = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date()),
                        steps = mutableListOf(),
                        result = null,
                        isComplete = false
                    )
                    conversations.add(conv)

                    scope.launch {
                        try {
                            // Phase 1: Planning
                            delay(400)
                            conversations[conversations.lastIndex] = conv.copy(
                                steps = mutableListOf(
                                    AgentStep("Planning", AgentStepStatus.DONE)
                                )
                            )

                            // Phase 2: Submit to backend
                            val response = coreManager.submitGoal(goal)

                            // Phase 3: Coding agent
                            delay(300)
                            conversations[conversations.lastIndex] = conversations.last().copy(
                                steps = mutableListOf(
                                    AgentStep("Planning", AgentStepStatus.DONE),
                                    AgentStep("Coding Agent", AgentStepStatus.RUNNING)
                                )
                            )
                            delay(800)

                            // Phase 4: Testing agent
                            conversations[conversations.lastIndex] = conversations.last().copy(
                                steps = mutableListOf(
                                    AgentStep("Planning", AgentStepStatus.DONE),
                                    AgentStep("Coding Agent", AgentStepStatus.DONE),
                                    AgentStep("Testing Agent", AgentStepStatus.RUNNING)
                                )
                            )
                            delay(600)

                            // Phase 5: Complete
                            conversations[conversations.lastIndex] = conversations.last().copy(
                                steps = mutableListOf(
                                    AgentStep("Planning", AgentStepStatus.DONE),
                                    AgentStep("Coding Agent", AgentStepStatus.DONE),
                                    AgentStep("Testing Agent", AgentStepStatus.DONE),
                                    AgentStep("Review Agent", AgentStepStatus.DONE)
                                ),
                                result = response ?: "Task completed successfully.",
                                isComplete = true
                            )
                        } catch (e: Exception) {
                            conversations[conversations.lastIndex] = conversations.last().copy(
                                steps = conversations.last().steps.toMutableList().also {
                                    it.add(AgentStep("Error", AgentStepStatus.FAILED))
                                },
                                result = "Error: ${e.message}",
                                isComplete = true
                            )
                        } finally {
                            isProcessing = false
                        }
                    }
                }
            }
        )
    }
}

// ── Data Models ───────────────────────────────────────────────────────────────

enum class AgentStepStatus { PENDING, RUNNING, DONE, FAILED }

data class AgentStep(val name: String, val status: AgentStepStatus = AgentStepStatus.PENDING)

data class AiConversation(
    val goal: String,
    val timestamp: String,
    val steps: List<AgentStep>,
    val result: String?,
    val isComplete: Boolean
)

// ── Header ────────────────────────────────────────────────────────────────────

@Composable
private fun AiHeader(connectionState: String) {
    val isConnected = connectionState == "CONNECTED"

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(EcoraaToolbarBg)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // ECORAA symbol (a simple geometric mark)
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(EcoraaAccent.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                "E",
                style = TextStyle(
                    color = EcoraaAccent,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            )
        }

        Spacer(Modifier.width(12.dp))

        Column {
            Text(
                "ECORAA AI",
                style = TextStyle(
                    color = EcoraaTextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold
                )
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(6.dp)
                        .clip(CircleShape)
                        .background(if (isConnected) EcoraaSuccess else EcoraaTextSecondary.copy(alpha = 0.4f))
                )
                Spacer(Modifier.width(5.dp))
                Text(
                    text = if (isConnected) "Backend connected" else "Connecting...",
                    style = TextStyle(
                        color = EcoraaTextSecondary,
                        fontSize = 11.sp
                    )
                )
            }
        }

        Spacer(Modifier.weight(1f))

        // History icon
        IconButton(onClick = {}) {
            Icon(
                Icons.Outlined.History,
                contentDescription = "History",
                tint = EcoraaTextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
    Divider(color = EcoraaToolbarBorder, thickness = 0.5.dp)
}

// ── Empty State ───────────────────────────────────────────────────────────────

private val SUGGESTIONS = listOf(
    "Write a Python function to parse JSON data",
    "Debug my authentication code",
    "Explain how WebSockets work",
    "Write tests for my API endpoints",
    "Optimize this database query"
)

@Composable
private fun EmptyAiState(onSuggestionClick: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.weight(0.3f))

        // Symbol
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(EcoraaAccent.copy(alpha = 0.10f)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                "E",
                style = TextStyle(
                    color = EcoraaAccent,
                    fontSize = 30.sp,
                    fontWeight = FontWeight.Bold
                )
            )
        }

        Spacer(Modifier.height(20.dp))

        Text(
            "What would you like to accomplish?",
            style = TextStyle(
                color = EcoraaTextPrimary,
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold
            )
        )

        Spacer(Modifier.height(8.dp))

        Text(
            "Tell ECORAA your goal. The agent pipeline handles the complexity.",
            style = TextStyle(
                color = EcoraaTextSecondary,
                fontSize = 13.sp,
                lineHeight = 20.sp
            )
        )

        Spacer(Modifier.height(32.dp))

        // Suggestions
        SUGGESTIONS.forEach { suggestion ->
            SuggestionChip(
                text = suggestion,
                onClick = { onSuggestionClick(suggestion) }
            )
            Spacer(Modifier.height(8.dp))
        }

        Spacer(Modifier.weight(0.7f))
    }
}

@Composable
private fun SuggestionChip(text: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(EcoraaToolbarBg)
            .border(0.5.dp, EcoraaToolbarBorder, RoundedCornerShape(10.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = text,
            style = TextStyle(
                color = EcoraaTextPrimary,
                fontSize = 13.sp
            ),
            modifier = Modifier.weight(1f),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        Icon(
            Icons.Outlined.ChevronRight,
            contentDescription = null,
            tint = EcoraaTextSecondary,
            modifier = Modifier.size(16.dp)
        )
    }
}

// ── Conversation Item ─────────────────────────────────────────────────────────

@Composable
private fun ConversationItem(conv: AiConversation) {
    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        // Goal row
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.Top
        ) {
            // User icon
            Box(
                modifier = Modifier
                    .size(28.dp)
                    .clip(CircleShape)
                    .background(EcoraaAccent.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Outlined.Person,
                    contentDescription = null,
                    tint = EcoraaAccent,
                    modifier = Modifier.size(16.dp)
                )
            }

            Spacer(Modifier.width(10.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    conv.goal,
                    style = TextStyle(
                        color = EcoraaTextPrimary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium,
                        lineHeight = 22.sp
                    )
                )
                Text(
                    conv.timestamp,
                    style = TextStyle(color = EcoraaTextSecondary, fontSize = 11.sp)
                )
            }
        }

        Spacer(Modifier.height(12.dp))

        // Agent pipeline steps
        if (conv.steps.isNotEmpty()) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(EcoraaToolbarBg)
                    .border(0.5.dp, EcoraaToolbarBorder, RoundedCornerShape(10.dp))
                    .padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                conv.steps.forEach { step ->
                    AgentStepRow(step)
                }
            }
        }

        // Result
        if (conv.result != null) {
            Spacer(Modifier.height(10.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(10.dp))
                    .background(EcoraaAccent.copy(alpha = 0.06f))
                    .border(0.5.dp, EcoraaAccent.copy(alpha = 0.25f), RoundedCornerShape(10.dp))
                    .padding(14.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Outlined.CheckCircle,
                        contentDescription = null,
                        tint = EcoraaSuccess,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(
                        "Result",
                        style = TextStyle(
                            color = EcoraaTextSecondary,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    )
                }
                Spacer(Modifier.height(8.dp))
                Text(
                    conv.result,
                    style = TextStyle(
                        color = EcoraaTextPrimary,
                        fontSize = 13.sp,
                        lineHeight = 20.sp
                    )
                )
            }
        }
    }
}

@Composable
private fun AgentStepRow(step: AgentStep) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        when (step.status) {
            AgentStepStatus.DONE -> Icon(
                Icons.Outlined.CheckCircle,
                contentDescription = null,
                tint = EcoraaSuccess,
                modifier = Modifier.size(14.dp)
            )
            AgentStepStatus.RUNNING -> {
                val infiniteTransition = rememberInfiniteTransition(label = "pulse")
                val alpha by infiniteTransition.animateFloat(
                    initialValue = 0.3f,
                    targetValue = 1f,
                    animationSpec = infiniteRepeatable(
                        animation = tween(700),
                        repeatMode = RepeatMode.Reverse
                    ),
                    label = "stepAlpha"
                )
                Box(
                    modifier = Modifier
                        .size(14.dp)
                        .clip(CircleShape)
                        .background(EcoraaAccent.copy(alpha = alpha))
                )
            }
            AgentStepStatus.FAILED -> Icon(
                Icons.Outlined.Cancel,
                contentDescription = null,
                tint = EcoraaError,
                modifier = Modifier.size(14.dp)
            )
            else -> Box(
                modifier = Modifier
                    .size(14.dp)
                    .clip(CircleShape)
                    .background(EcoraaTextSecondary.copy(alpha = 0.3f))
            )
        }

        Spacer(Modifier.width(8.dp))

        Text(
            step.name,
            style = TextStyle(
                color = when (step.status) {
                    AgentStepStatus.DONE -> EcoraaTextPrimary
                    AgentStepStatus.RUNNING -> EcoraaAccent
                    AgentStepStatus.FAILED -> EcoraaError
                    else -> EcoraaTextSecondary
                },
                fontSize = 13.sp,
                fontWeight = if (step.status == AgentStepStatus.RUNNING) FontWeight.Medium else FontWeight.Normal
            )
        )
    }
}

// ── Processing Banner ─────────────────────────────────────────────────────────

@Composable
private fun ProcessingBanner(modifier: Modifier = Modifier) {
    val infiniteTransition = rememberInfiniteTransition(label = "banner")
    val alpha by infiniteTransition.animateFloat(
        initialValue = 0.5f, targetValue = 1f,
        animationSpec = infiniteRepeatable(tween(800), RepeatMode.Reverse),
        label = "bannerAlpha"
    )
    Row(
        modifier = modifier
            .padding(top = 8.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(EcoraaToolbarBg.copy(alpha = 0.95f))
            .border(0.5.dp, EcoraaToolbarBorder, RoundedCornerShape(20.dp))
            .padding(horizontal = 14.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(6.dp)
                .clip(CircleShape)
                .background(EcoraaAccent.copy(alpha = alpha))
        )
        Spacer(Modifier.width(8.dp))
        Text(
            "ECORAA is working...",
            style = TextStyle(color = EcoraaTextSecondary, fontSize = 12.sp)
        )
    }
}

// ── Input Area ────────────────────────────────────────────────────────────────

@Composable
private fun AiInputArea(
    value: String,
    onValueChange: (String) -> Unit,
    isProcessing: Boolean,
    onSubmit: () -> Unit
) {
    Column {
        Divider(color = EcoraaToolbarBorder, thickness = 0.5.dp)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(EcoraaToolbarBg)
                .padding(horizontal = 12.dp, vertical = 10.dp),
            verticalAlignment = Alignment.Bottom
        ) {
            // Input field
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(12.dp))
                    .background(EcoraaEditorBg)
                    .border(0.5.dp, EcoraaToolbarBorder, RoundedCornerShape(12.dp))
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                if (value.isEmpty()) {
                    Text(
                        "Ask ECORAA...",
                        style = TextStyle(color = EcoraaTextSecondary, fontSize = 14.sp)
                    )
                }
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    textStyle = TextStyle(
                        color = EcoraaTextPrimary,
                        fontSize = 14.sp,
                        lineHeight = 22.sp
                    ),
                    cursorBrush = SolidColor(EcoraaAccent),
                    enabled = !isProcessing,
                    maxLines = 5,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            Spacer(Modifier.width(8.dp))

            // Send button
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        if (!isProcessing && value.trim().isNotEmpty()) EcoraaAccent
                        else EcoraaToolbarBorder
                    )
                    .clickable(enabled = !isProcessing && value.trim().isNotEmpty()) { onSubmit() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    if (isProcessing) Icons.Outlined.HourglassEmpty else Icons.Outlined.ArrowUpward,
                    contentDescription = "Send",
                    tint = if (!isProcessing && value.trim().isNotEmpty()) Color.White
                           else EcoraaTextSecondary,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}
