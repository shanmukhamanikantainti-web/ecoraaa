package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * Testing Workspace
 * Software testing environment with test runner, logs, and failure analysis.
 */
@Composable
fun TestingWorkspaceScreen(
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
            text = "TESTING WORKSPACE",
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = PrimaryText,
            letterSpacing = 1.sp
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Test status overview
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            TestStatCard("Total", "24", PrimaryText)
            TestStatCard("Passed", "21", SuccessColor)
            TestStatCard("Failed", "2", ErrorColor)
            TestStatCard("Skipped", "1", WarningColor)
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Test results
        Row(modifier = Modifier.weight(1f)) {
            // Test list
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(SecondaryBackground)
                    .padding(8.dp)
            ) {
                Text(
                    text = "TEST RESULTS",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TertiaryText,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))

                val tests = listOf(
                    TestResult("test_main_init", "PASSED", SuccessColor),
                    TestResult("test_config_load", "PASSED", SuccessColor),
                    TestResult("test_orchestrator_start", "PASSED", SuccessColor),
                    TestResult("test_agent_registration", "PASSED", SuccessColor),
                    TestResult("test_research_agent", "PASSED", SuccessColor),
                    TestResult("test_coding_agent", "PASSED", SuccessColor),
                    TestResult("test_terminal_tool", "FAILED", ErrorColor),
                    TestResult("test_filesystem_tool", "PASSED", SuccessColor),
                    TestResult("test_memory_store", "PASSED", SuccessColor),
                    TestResult("test_memory_retrieve", "PASSED", SuccessColor),
                    TestResult("test_web_search", "FAILED", ErrorColor),
                    TestResult("test_permission_check", "PASSED", SuccessColor),
                )

                LazyColumn {
                    items(tests) { test ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 2.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (test.status == "PASSED") "\u2713" else "\u2717",
                                fontSize = 11.sp,
                                color = test.statusColor,
                                modifier = Modifier.width(16.dp)
                            )
                            Text(
                                text = test.name,
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                color = if (test.status == "PASSED") SecondaryText else ErrorColor,
                                modifier = Modifier.weight(1f)
                            )
                            Text(
                                text = test.status,
                                fontSize = 9.sp,
                                fontFamily = FontFamily.Monospace,
                                color = test.statusColor
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.width(8.dp))

            // Failure analysis
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(SecondaryBackground)
                    .padding(8.dp)
            ) {
                Text(
                    text = "FAILURE ANALYSIS",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = TertiaryText,
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "test_terminal_tool",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Medium,
                    color = ErrorColor
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "AssertionError: Expected exit code 0, got 1\n\nThe terminal tool failed to execute the command in the sandboxed environment. Check working directory permissions.",
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    color = SecondaryText,
                    lineHeight = 16.sp
                )
            }
        }
    }
}

data class TestResult(
    val name: String,
    val status: String,
    val statusColor: androidx.compose.ui.graphics.Color
)

@Composable
fun TestStatCard(label: String, value: String, color: androidx.compose.ui.graphics.Color) {
    Surface(
        shape = RoundedCornerShape(6.dp),
        color = PrimarySurface,
        modifier = Modifier.weight(1f)
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Text(
                text = label,
                fontSize = 9.sp,
                color = TertiaryText,
                letterSpacing = 0.5.sp
            )
        }
    }
}
