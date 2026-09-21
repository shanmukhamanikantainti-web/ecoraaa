package com.pegasus.os.ui.navigation

/**
 * ECORAA Android Companion — Screen Routes
 *
 * Two primary screens as per the ECORAA product spec:
 *   1. IDE     — Full coding environment (terminal, editor, file tree)
 *   2. AI      — ECORAA AI command + agent interface
 */
sealed class EcoraaScreen(val route: String) {
    data object Ide : EcoraaScreen("ide")
    data object Ai  : EcoraaScreen("ai")
}
