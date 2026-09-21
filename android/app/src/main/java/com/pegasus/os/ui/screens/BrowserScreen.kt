package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
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
 * Browser Window Content
 * Web browsing and research workspace.
 */
@Composable
fun BrowserScreen(
    coreManager: PegasusCoreManager,
    isWindowed: Boolean = false
) {
    var url by remember { mutableStateOf("https://") }
    var isLoading by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize()) {
        // URL bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(PrimarySurface)
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            // Navigation buttons
            Icon(
                Icons.Outlined.ArrowBack,
                contentDescription = "Back",
                tint = TertiaryText,
                modifier = Modifier.size(16.dp)
            )
            Icon(
                Icons.Outlined.ArrowForward,
                contentDescription = "Forward",
                tint = TertiaryText,
                modifier = Modifier.size(16.dp)
            )
            Icon(
                Icons.Outlined.Refresh,
                contentDescription = "Refresh",
                tint = TertiaryText,
                modifier = Modifier.size(16.dp)
            )

            // URL field
            OutlinedTextField(
                value = url,
                onValueChange = { url = it },
                modifier = Modifier.weight(1f),
                textStyle = LocalTextStyle.current.copy(
                    fontSize = 11.sp,
                    color = PrimaryText
                ),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PegasusAccent,
                    unfocusedBorderColor = SubtleBorder,
                    cursorColor = PegasusAccent
                ),
                singleLine = true,
                shape = RoundedCornerShape(4.dp),
                placeholder = {
                    Text("Enter URL or search...", fontSize = 11.sp, color = TertiaryText)
                }
            )
        }

        HorizontalDivider(color = SubtleBorder, thickness = 1.dp)

        // Content area
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(MainBackground),
            contentAlignment = Alignment.Center
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    color = PegasusAccent,
                    strokeWidth = 2.dp,
                    modifier = Modifier.size(24.dp)
                )
            } else {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "\u25C9",
                        fontSize = 24.sp,
                        color = PegasusAccent.copy(alpha = 0.4f)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Browser",
                        fontSize = 12.sp,
                        color = TertiaryText
                    )
                    Text(
                        text = "Enter a URL or use PEGASUS to research",
                        fontSize = 10.sp,
                        color = DisabledText
                    )
                }
            }
        }
    }
}
