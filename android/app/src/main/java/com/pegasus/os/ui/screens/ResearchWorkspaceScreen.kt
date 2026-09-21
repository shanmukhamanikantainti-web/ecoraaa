package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
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
 * Research Workspace
 * Dedicated research environment with sources, browser, and AI analysis.
 */
@Composable
fun ResearchWorkspaceScreen(
    coreManager: PegasusCoreManager,
    isWindowed: Boolean = false
) {
    var researchTopic by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(12.dp)
    ) {
        Text(
            text = "RESEARCH WORKSPACE",
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = PrimaryText,
            letterSpacing = 1.sp
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Research input
        OutlinedTextField(
            value = researchTopic,
            onValueChange = { researchTopic = it },
            modifier = Modifier.fillMaxWidth(),
            placeholder = {
                Text("What would you like to research?", fontSize = 12.sp, color = TertiaryText)
            },
            textStyle = LocalTextStyle.current.copy(fontSize = 12.sp, color = PrimaryText),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PegasusAccent,
                unfocusedBorderColor = SubtleBorder,
                cursorColor = PegasusAccent
            ),
            shape = RoundedCornerShape(6.dp),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(8.dp))

        Button(
            onClick = { /* Trigger research agent */ },
            colors = ButtonDefaults.buttonColors(
                containerColor = PegasusAccent,
                contentColor = DeepBackground
            ),
            shape = RoundedCornerShape(6.dp)
        ) {
            Text("Start Research", fontSize = 12.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Research areas
        Row(modifier = Modifier.weight(1f)) {
            // Sources panel
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(SecondaryBackground)
                    .padding(8.dp)
            ) {
                Text(
                    text = "SOURCES",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TertiaryText,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "No sources collected yet.\nStart a research task to begin.",
                    fontSize = 11.sp,
                    color = DisabledText
                )
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Analysis panel
            Column(
                modifier = Modifier
                    .weight(2f)
                    .fillMaxHeight()
                    .background(SecondaryBackground)
                    .padding(8.dp)
            ) {
                Text(
                    text = "ANALYSIS",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TertiaryText,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Research results will appear here.\nThe Research Agent will analyze sources and provide summaries.",
                    fontSize = 11.sp,
                    color = DisabledText
                )
            }
        }
    }
}
