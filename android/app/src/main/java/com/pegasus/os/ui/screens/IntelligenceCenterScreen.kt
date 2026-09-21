package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
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
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * Intelligence Center
 * Surfaces information that matters to the user.
 * Compact typography, clear hierarchy, minimal cards.
 * No social-media-style feed.
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IntelligenceCenterScreen(
    coreManager: PegasusCoreManager,
    onBack: () -> Unit
) {
    val intelligenceItems = listOf(
        IntelligenceItem(
            title = "Battery cooling paper detected",
            relevance = "HIGH",
            reason = "Related to your current battery project.",
            isNew = true
        ),
        IntelligenceItem(
            title = "New Python 3.13 features relevant to your simulation",
            relevance = "MEDIUM",
            reason = "You use Python for simulation projects.",
            isNew = true
        ),
        IntelligenceItem(
            title = "PEGASUS OS development update",
            relevance = "LOW",
            reason = "System development tracking.",
            isNew = false
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        TopAppBar(
            title = {
                Text("INTELLIGENCE", fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
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
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            intelligenceItems.forEach { item ->
                IntelligenceCard(item = item)
            }
        }
    }
}

data class IntelligenceItem(
    val title: String,
    val relevance: String,
    val reason: String,
    val isNew: Boolean
)

@Composable
fun IntelligenceCard(item: IntelligenceItem) {
    Surface(
        shape = RoundedCornerShape(6.dp),
        color = PrimarySurface,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (item.isNew) {
                    Surface(
                        shape = RoundedCornerShape(3.dp),
                        color = PegasusAccent.copy(alpha = 0.15f)
                    ) {
                        Text(
                            text = "NEW",
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 1.dp),
                            fontSize = 8.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = PegasusAccent,
                            letterSpacing = 0.5.sp
                        )
                    }
                } else {
                    Spacer(modifier = Modifier.height(1.dp))
                }

                val relevanceColor = when (item.relevance) {
                    "HIGH" -> SuccessColor
                    "MEDIUM" -> WarningColor
                    "LOW" -> TertiaryText
                    else -> TertiaryText
                }
                Text(
                    text = "Relevance: ${item.relevance}",
                    fontSize = 9.sp,
                    color = relevanceColor,
                    letterSpacing = 0.3.sp
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = item.title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = PrimaryText,
                lineHeight = 18.sp
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Why it matters",
                fontSize = 9.sp,
                fontWeight = FontWeight.SemiBold,
                color = TertiaryText,
                letterSpacing = 0.5.sp
            )
            Text(
                text = item.reason,
                fontSize = 12.sp,
                color = SecondaryText,
                lineHeight = 16.sp
            )
        }
    }
}
