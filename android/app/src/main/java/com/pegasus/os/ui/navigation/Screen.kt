package com.pegasus.os.ui.navigation

/**
 * PEGASUS OS Screen Routes
 * System-level navigation destinations.
 */
sealed class Screen(val route: String) {
    data object Home : Screen("home")
    data object Launcher : Screen("launcher")
    data object Workspaces : Screen("workspaces")
    data object MissionControl : Screen("mission_control")
    data object AgentManager : Screen("agent_manager")
    data object IntelligenceCenter : Screen("intelligence_center")
    data object FileManager : Screen("file_manager")
    data object Terminal : Screen("terminal")
    data object Settings : Screen("settings")
    data object Memory : Screen("memory")
    data object PegasusCommand : Screen("pegasus_command")
}
