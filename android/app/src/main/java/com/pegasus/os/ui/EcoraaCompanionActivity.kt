package com.pegasus.os.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Code
import androidx.compose.material.icons.outlined.SmartToy
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.view.WindowCompat
import androidx.navigation.NavHostController
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.pegasus.os.PegasusApplication
import com.pegasus.os.ui.navigation.EcoraaNavGraph
import com.pegasus.os.ui.navigation.EcoraaScreen
import com.pegasus.os.ui.screens.BootScreen
import com.pegasus.os.ui.theme.*

/**
 * ECORAA Android Companion — MainActivity
 *
 * Entry point for the ECORAA Android companion application.
 * Presents a two-tab interface:
 *   1. ECORAA AI  — AI command & agent interface
 *   2. IDE        — Full coding environment
 *
 * Architecture:
 *   MainActivity → EcoraaCompanionShell → EcoraaNavGraph
 *                                        ├─ EcoraaAiScreen
 *                                        └─ IdeScreen
 *
 * The app communicates with the ECORAA backend via PegasusCoreManager
 * (HTTP + WebSocket to the Python FastAPI backend).
 */
class EcoraaCompanionActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Edge-to-edge with dark status bar
        WindowCompat.setDecorFitsSystemWindows(window, false)

        val coreManager = (application as PegasusApplication).coreManager

        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    background = EcoraaBackground,
                    surface = EcoraaToolbarBg,
                    primary = EcoraaAccent,
                    onBackground = EcoraaTextPrimary,
                    onSurface = EcoraaTextPrimary
                )
            ) {
                var showBoot by remember { mutableStateOf(true) }

                if (showBoot) {
                    BootScreen(
                        coreManager = coreManager,
                        onBootComplete = { showBoot = false }
                    )
                } else {
                    EcoraaCompanionShell(coreManager = coreManager)
                }
            }
        }
    }
}

// ── ECORAA Companion Shell ────────────────────────────────────────────────────

data class EcoraaTab(
    val screen: EcoraaScreen,
    val label: String,
    val icon: ImageVector
)

private val ECORAA_TABS = listOf(
    EcoraaTab(EcoraaScreen.Ai, "ECORAA AI", Icons.Outlined.SmartToy),
    EcoraaTab(EcoraaScreen.Ide, "IDE", Icons.Outlined.Code),
)

@Composable
fun EcoraaCompanionShell(
    coreManager: com.pegasus.os.core.PegasusCoreManager
) {
    val navController = rememberNavController()

    Scaffold(
        containerColor = EcoraaBackground,
        bottomBar = {
            EcoraaBottomNav(navController = navController)
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            EcoraaNavGraph(
                navController = navController,
                coreManager = coreManager
            )
        }
    }
}

// ── Bottom Navigation ─────────────────────────────────────────────────────────

@Composable
private fun EcoraaBottomNav(navController: NavHostController) {
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    Column {
        Divider(
            color = EcoraaToolbarBorder,
            thickness = 0.5.dp
        )

        NavigationBar(
            containerColor = EcoraaToolbarBg,
            tonalElevation = 0.dp,
            modifier = Modifier.height(60.dp)
        ) {
            ECORAA_TABS.forEach { tab ->
                val isSelected = currentRoute == tab.screen.route

                NavigationBarItem(
                    selected = isSelected,
                    onClick = {
                        if (!isSelected) {
                            navController.navigate(tab.screen.route) {
                                popUpTo(navController.graph.startDestinationId) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    },
                    icon = {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                imageVector = tab.icon,
                                contentDescription = tab.label,
                                modifier = Modifier.size(20.dp),
                                tint = if (isSelected) EcoraaAccent else EcoraaTextSecondary
                            )
                            Spacer(Modifier.height(2.dp))
                            Text(
                                text = tab.label,
                                style = TextStyle(
                                    color = if (isSelected) EcoraaAccent else EcoraaTextSecondary,
                                    fontSize = 10.sp,
                                    fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                                )
                            )
                        }
                    },
                    label = null, // We render our own label inside icon composable
                    colors = NavigationBarItemDefaults.colors(
                        indicatorColor = EcoraaAccent.copy(alpha = 0.12f),
                        selectedIconColor = EcoraaAccent,
                        unselectedIconColor = EcoraaTextSecondary
                    )
                )
            }
        }
    }
}
