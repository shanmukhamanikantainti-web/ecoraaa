package com.pegasus.os.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.pegasus.os.PegasusApplication
import com.pegasus.os.desktop.*
import com.pegasus.os.ui.screens.BootScreen
import com.pegasus.os.ui.theme.*

/**
 * PEGASUS OS Main Activity
 *
 * Acts as the system shell — replaces the Android launcher.
 * Full-screen immersive mode with edge-to-edge display.
 *
 * Desktop-first architecture:
 *   Taskbar (top)
 *   Desktop Workspace (center — floating windows)
 *   Workspace Indicator (bottom)
 */
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        hideSystemUI()

        val coreManager = (application as PegasusApplication).coreManager

        setContent {
            PegasusOSTheme {
                var showBootScreen by remember { mutableStateOf(true) }

                if (showBootScreen) {
                    BootScreen(
                        coreManager = coreManager,
                        onBootComplete = {
                            showBootScreen = false
                        }
                    )
                } else {
                    PegasusDesktopShell(coreManager = coreManager)
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        hideSystemUI()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) hideSystemUI()
    }

    private fun hideSystemUI() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.hide(WindowInsetsCompat.Type.systemBars())
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }
}

/**
 * PEGASUS Desktop Shell
 *
 * The primary PEGASUS interface — a desktop environment with:
 *   - Taskbar at top
 *   - Floating windows in the center
 *   - Workspace indicator at bottom
 *   - Start menu overlay
 *   - PEGASUS command palette overlay
 *
 * This replaces the previous navigation-based mobile UI.
 */
@Composable
fun PegasusDesktopShell(
    coreManager: com.pegasus.os.core.PegasusCoreManager
) {
    val desktopManager = remember { DesktopManager(coreManager) }

    // Connect to PEGASUS Core on mount
    LaunchedEffect(Unit) {
        coreManager.connect()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepBackground)
    ) {
        // ── Taskbar (Top) ──
        PegasusTaskbar(desktopManager = desktopManager)

        // ── Desktop Workspace (Center) ──
        DesktopWorkspace(
            desktopManager = desktopManager,
            modifier = Modifier.weight(1f)
        )

        // ── Workspace Indicator (Bottom) ──
        WorkspaceIndicator(desktopManager = desktopManager)
    }
}
