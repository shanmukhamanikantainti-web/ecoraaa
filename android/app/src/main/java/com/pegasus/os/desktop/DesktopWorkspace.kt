package com.pegasus.os.desktop

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.sp
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.theme.*
import com.pegasus.os.ui.screens.*

/**
 * PEGASUS OS — Desktop Workspace
 *
 * The main desktop area between the taskbar (top) and workspace indicator (bottom).
 * Contains floating windows managed by the Window Manager.
 *
 * Layout:
 * ┌─────────────────────────────────────────────────────────────┐
 * │ TASKBAR                                                      │
 * ├─────────────────────────────────────────────────────────────┤
 * │                                                              │
 * │                    DESKTOP WORKSPACE                          │
 * │         [Window 1]  [Window 2]  [Window 3]                  │
 * │                                                              │
 * ├─────────────────────────────────────────────────────────────┤
 * │ Desktop 1 │ Desktop 2 │ Desktop 3 │ Desktop 4                │
 * └─────────────────────────────────────────────────────────────┘
 */
@Composable
fun DesktopWorkspace(
    desktopManager: DesktopManager,
    modifier: Modifier = Modifier
) {
    val windows by desktopManager.windows.collectAsState()
    val activeWorkspaceId by desktopManager.activeWorkspaceId.collectAsState()
    val showStartMenu by desktopManager.showStartMenu.collectAsState()
    val showPegasusCommand by desktopManager.showPegasusCommand.collectAsState()
    val coreManager = desktopManager.getPegasusCore()

    val visibleWindows = windows.filter {
        it.workspaceId == activeWorkspaceId && it.state != WindowState.MINIMIZED
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(MainBackground)
            // Click on desktop to close start menu / unfocus
            .clickable {
                desktopManager.closeStartMenu()
                desktopManager.closePegasusCommand()
            }
    ) {
        // ── Floating Windows ──
        visibleWindows.forEach { window ->
            WindowFrame(
                window = window,
                desktopManager = desktopManager
            ) {
                WindowContent(
                    window = window,
                    coreManager = coreManager,
                    desktopManager = desktopManager
                )
            }
        }

        // ── Empty Desktop Message ──
        if (visibleWindows.isEmpty() && !showStartMenu && !showPegasusCommand) {
            Column(
                modifier = Modifier.align(Alignment.Center),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "\u25C9",
                    fontSize = 28.sp,
                    color = PegasusAccent.copy(alpha = 0.4f)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "PEGASUS",
                    fontSize = 12.sp,
                    color = TertiaryText,
                    letterSpacing = 3.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Click PEGASUS to open applications",
                    fontSize = 10.sp,
                    color = DisabledText
                )
            }
        }

        // ── Start Menu Overlay ──
        StartMenu(desktopManager = desktopManager)

        // ── PEGASUS Command Overlay ──
        if (showPegasusCommand) {
            PegasusCommandPalette(
                desktopManager = desktopManager,
                coreManager = coreManager
            )
        }
    }
}

/**
 * Routes window content based on AppType.
 * Each window type renders its specific application UI.
 */
@Composable
fun WindowContent(
    window: PegasusWindow,
    coreManager: PegasusCoreManager,
    desktopManager: DesktopManager
) {
    when (window.appType) {
        AppType.TERMINAL -> TerminalWindowContent(coreManager)
        AppType.FILE_MANAGER -> FileManagerWindowContent(coreManager)
        AppType.CODE_EDITOR -> CodeEditorWindowContent(coreManager)
        AppType.BROWSER -> BrowserWindowContent(coreManager)
        AppType.MISSION_CONTROL -> MissionControlWindowContent(coreManager)
        AppType.AGENT_MANAGER -> AgentManagerWindowContent(coreManager)
        AppType.INTELLIGENCE_CENTER -> IntelligenceCenterWindowContent(coreManager)
        AppType.SETTINGS -> SettingsWindowContent(coreManager)
        AppType.MEMORY -> MemoryWindowContent(coreManager)
        AppType.PEGASUS_COMMAND -> { /* Overlay, not a window */ }
        AppType.SYSTEM_MONITOR -> SystemMonitorWindowContent(coreManager)
        AppType.RESEARCH_WORKSPACE -> ResearchWorkspaceContent(coreManager)
        AppType.TESTING_WORKSPACE -> TestingWorkspaceContent(coreManager)
        AppType.MARKET_WORKSPACE -> MarketWorkspaceContent(coreManager)
    }
}

// ── Window Content Stubs ──
// These will be replaced with real implementations

@Composable
fun TerminalWindowContent(coreManager: PegasusCoreManager) {
    TerminalScreen(coreManager = coreManager, isWindowed = true)
}

@Composable
fun FileManagerWindowContent(coreManager: PegasusCoreManager) {
    FileManagerScreen(coreManager = coreManager, isWindowed = true)
}

@Composable
fun CodeEditorWindowContent(coreManager: PegasusCoreManager) {
    CodeEditorScreen(coreManager = coreManager)
}

@Composable
fun BrowserWindowContent(coreManager: PegasusCoreManager) {
    BrowserScreen(coreManager = coreManager)
}

@Composable
fun MissionControlWindowContent(coreManager: PegasusCoreManager) {
    MissionControlScreen(coreManager = coreManager, isWindowed = true)
}

@Composable
fun AgentManagerWindowContent(coreManager: PegasusCoreManager) {
    AgentManagerScreen(coreManager = coreManager, isWindowed = true)
}

@Composable
fun IntelligenceCenterWindowContent(coreManager: PegasusCoreManager) {
    IntelligenceCenterScreen(coreManager = coreManager, isWindowed = true)
}

@Composable
fun SettingsWindowContent(coreManager: PegasusCoreManager) {
    SettingsScreen(coreManager = coreManager, isWindowed = true)
}

@Composable
fun MemoryWindowContent(coreManager: PegasusCoreManager) {
    MemoryScreen(coreManager = coreManager, isWindowed = true)
}

@Composable
fun SystemMonitorWindowContent(coreManager: PegasusCoreManager) {
    SystemMonitorScreen(coreManager = coreManager)
}

@Composable
fun ResearchWorkspaceContent(coreManager: PegasusCoreManager) {
    ResearchWorkspaceScreen(coreManager = coreManager)
}

@Composable
fun TestingWorkspaceContent(coreManager: PegasusCoreManager) {
    TestingWorkspaceScreen(coreManager = coreManager)
}

@Composable
fun MarketWorkspaceContent(coreManager: PegasusCoreManager) {
    MarketWorkspaceScreen(coreManager = coreManager)
}
