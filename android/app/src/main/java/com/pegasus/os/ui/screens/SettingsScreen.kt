package com.pegasus.os.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*

/**
 * Settings
 * Categories: SYSTEM (Display, Network, Sound, Power, Storage),
 * SECURITY (Privacy, Permissions, Applications),
 * PEGASUS (AI Models, Agents, Memory, Context, Automation)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    coreManager: PegasusCoreManager,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MainBackground)
    ) {
        TopAppBar(
            title = {
                Text("SETTINGS", fontSize = 14.sp, fontWeight = FontWeight.SemiBold,
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
                .padding(vertical = 8.dp)
        ) {
            // System section
            SettingsSectionHeader("SYSTEM")
            SettingsItem(Icons.Outlined.Brightness6, "Display", "Brightness, theme, font size")
            SettingsItem(Icons.Outlined.Wifi, "Network", "Wi-Fi, mobile data, proxy")
            SettingsItem(Icons.Outlined.VolumeUp, "Sound", "Volume, notifications, alerts")
            SettingsItem(Icons.Outlined.BatteryStd, "Power", "Battery usage, power saving")
            SettingsItem(Icons.Outlined.Storage, "Storage", "78.2 GB / 128 GB used")

            Spacer(modifier = Modifier.height(12.dp))

            // Security section
            SettingsSectionHeader("SECURITY")
            SettingsItem(Icons.Outlined.Security, "Privacy", "Data protection, permissions")
            SettingsItem(Icons.Outlined.AdminPanelSettings, "Permissions", "App and agent permissions")
            SettingsItem(Icons.Outlined.Apps, "Applications", "Installed applications")

            Spacer(modifier = Modifier.height(12.dp))

            // PEGASUS section
            SettingsSectionHeader("PEGASUS")
            SettingsItem(Icons.Outlined.SmartToy, "AI Models", "Local and remote model configuration")
            SettingsItem(Icons.Outlined.Hub, "Agents", "Agent permissions and configuration")
            SettingsItem(Icons.Outlined.Memory, "Memory", "View and manage PEGASUS memory")
            SettingsItem(Icons.Outlined.AccountTree, "Context", "Context management settings")
            SettingsItem(Icons.Outlined.AutoMode, "Automation", "Task automation preferences")
        }
    }
}

@Composable
fun SettingsSectionHeader(title: String) {
    Text(
        text = title,
        fontSize = 10.sp,
        fontWeight = FontWeight.SemiBold,
        color = TertiaryText,
        letterSpacing = 1.5.sp,
        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
    )
}

@Composable
fun SettingsItem(
    icon: ImageVector,
    title: String,
    subtitle: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { }
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = SecondaryText,
            modifier = Modifier.size(18.dp)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, fontSize = 14.sp, color = PrimaryText)
            Text(text = subtitle, fontSize = 11.sp, color = TertiaryText)
        }
        Icon(
            Icons.Filled.ChevronRight,
            contentDescription = "Open",
            tint = DisabledText,
            modifier = Modifier.size(16.dp)
        )
    }
}
