package com.pegasus.os.ui.navigation

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.screens.*

/**
 * PEGASUS OS Navigation Graph
 * Connects all system surfaces with smooth transitions.
 */
@Composable
fun PegasusNavGraph(
    navController: NavHostController,
    coreManager: PegasusCoreManager
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route,
        enterTransition = {
            fadeIn(animationSpec = tween(200)) + slideInVertically(
                animationSpec = tween(250),
                initialOffsetY = { it / 40 }
            )
        },
        exitTransition = {
            fadeOut(animationSpec = tween(150))
        },
        popEnterTransition = {
            fadeIn(animationSpec = tween(200))
        },
        popExitTransition = {
            fadeOut(animationSpec = tween(150))
        }
    ) {
        composable(Screen.Home.route) {
            HomeScreen(
                coreManager = coreManager,
                onNavigateToLauncher = { navController.navigate(Screen.Launcher.route) },
                onNavigateToWorkspaces = { navController.navigate(Screen.Workspaces.route) },
                onNavigateToMissionControl = { navController.navigate(Screen.MissionControl.route) },
                onNavigateToAgentManager = { navController.navigate(Screen.AgentManager.route) },
                onNavigateToIntelligence = { navController.navigate(Screen.IntelligenceCenter.route) },
                onNavigateToFiles = { navController.navigate(Screen.FileManager.route) },
                onNavigateToTerminal = { navController.navigate(Screen.Terminal.route) },
                onNavigateToSettings = { navController.navigate(Screen.Settings.route) },
                onNavigateToMemory = { navController.navigate(Screen.Memory.route) },
                onOpenPegasusCommand = { navController.navigate(Screen.PegasusCommand.route) }
            )
        }

        composable(Screen.Launcher.route) {
            LauncherScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() },
                onOpenPegasusCommand = { navController.navigate(Screen.PegasusCommand.route) }
            )
        }

        composable(Screen.Workspaces.route) {
            WorkspaceScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.MissionControl.route) {
            MissionControlScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.AgentManager.route) {
            AgentManagerScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.IntelligenceCenter.route) {
            IntelligenceCenterScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.FileManager.route) {
            FileManagerScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Terminal.route) {
            TerminalScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Memory.route) {
            MemoryScreen(
                coreManager = coreManager,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Screen.PegasusCommand.route) {
            PegasusCommandOverlay(
                coreManager = coreManager,
                onDismiss = { navController.popBackStack() },
                onNavigateToMission = { navController.navigate(Screen.MissionControl.route) }
            )
        }
    }
}
