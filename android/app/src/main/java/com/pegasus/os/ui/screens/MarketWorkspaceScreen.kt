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
 * Market Analysis Workspace
 * Market data, trends, news, and AI-powered analysis.
 */
@Composable
fun MarketWorkspaceScreen(
    coreManager: PegasusCoreManager,
    isWindowed: Boolean = false
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
            .padding(12.dp)
    ) {
        Text(
            text = "MARKET ANALYSIS",
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = PrimaryText,
            letterSpacing = 1.sp
        )

        Spacer(modifier = Modifier.height(12.dp))

        Row(modifier = Modifier.weight(1f)) {
            // Market feed
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(SecondaryBackground)
                    .padding(8.dp)
            ) {
                Text(
                    text = "MARKET FEED",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TertiaryText,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))

                val feedItems = listOf(
                    FeedItem("AI Chip Market", "+2.4%", SuccessColor, "Growing demand for NPU-integrated processors"),
                    FeedItem("Cloud AI Services", "+1.8%", SuccessColor, "Enterprise adoption accelerating"),
                    FeedItem("Edge Computing", "+3.1%", SuccessColor, "On-device AI gaining traction"),
                    FeedItem("Smartphone Sales", "-0.5%", ErrorColor, "Market saturation in premium segment"),
                )

                feedItems.forEach { item ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = item.title,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = PrimaryText
                            )
                            Text(
                                text = item.description,
                                fontSize = 9.sp,
                                color = TertiaryText
                            )
                        }
                        Text(
                            text = item.change,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = item.changeColor
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            // AI Analysis
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(SecondaryBackground)
                    .padding(8.dp)
            ) {
                Text(
                    text = "PEGASUS ANALYSIS",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TertiaryText,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))

                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = AccentBackground
                ) {
                    Column(modifier = Modifier.padding(8.dp)) {
                        Text(
                            text = "Trend Detected",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = PegasusAccent
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Edge AI computing shows strong growth correlation with smartphone NPU adoption. PEGASUS OS is well-positioned for this trend.",
                            fontSize = 10.sp,
                            color = SecondaryText,
                            lineHeight = 15.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = PrimarySurface
                ) {
                    Column(modifier = Modifier.padding(8.dp)) {
                        Text(
                            text = "Risk Factors",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = WarningColor
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Market competition from established OS vendors. Hardware limitations on older devices may limit AI capabilities.",
                            fontSize = 10.sp,
                            color = SecondaryText,
                            lineHeight = 15.sp
                        )
                    }
                }
            }
        }
    }
}

data class FeedItem(
    val title: String,
    val change: String,
    val changeColor: androidx.compose.ui.graphics.Color,
    val description: String
)
