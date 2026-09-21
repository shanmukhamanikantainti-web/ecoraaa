package com.pegasus.os.ui.navigation

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.pegasus.os.core.PegasusCoreManager
import com.pegasus.os.ui.screens.EcoraaAiScreen
import com.pegasus.os.ui.screens.IdeScreen

/**
 * ECORAA Android Companion — Navigation Graph
 *
 * Two destinations:
 *   ide  → Full coding environment (file tree, editor, terminal)
 *   ai   → ECORAA AI command interface (Intent → Execution → Result)
 *
 * Transitions: horizontal slide to feel native and directional.
 */
@Composable
fun EcoraaNavGraph(
    navController: NavHostController,
    coreManager: PegasusCoreManager
) {
    NavHost(
        navController = navController,
        startDestination = EcoraaScreen.Ai.route,
        enterTransition = {
            slideInHorizontally(
                animationSpec = tween(250),
                initialOffsetX = { it / 2 }
            ) + fadeIn(tween(200))
        },
        exitTransition = {
            slideOutHorizontally(
                animationSpec = tween(200),
                targetOffsetX = { -it / 3 }
            ) + fadeOut(tween(150))
        },
        popEnterTransition = {
            slideInHorizontally(
                animationSpec = tween(250),
                initialOffsetX = { -it / 2 }
            ) + fadeIn(tween(200))
        },
        popExitTransition = {
            slideOutHorizontally(
                animationSpec = tween(200),
                targetOffsetX = { it / 2 }
            ) + fadeOut(tween(150))
        }
    ) {
        composable(EcoraaScreen.Ai.route) {
            EcoraaAiScreen(coreManager = coreManager)
        }
        composable(EcoraaScreen.Ide.route) {
            IdeScreen(coreManager = coreManager)
        }
    }
}
