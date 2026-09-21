package com.pegasus.os.desktop

import androidx.compose.runtime.*
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import com.pegasus.os.core.PegasusCoreManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * PEGASUS OS — Desktop Environment State
 *
 * Manages the entire desktop: windows, workspaces, taskbar, focus.
 * This replaces the navigation-based mobile UI with a desktop-first model.
 *
 * Architecture:
 *   DesktopEnvironment
 *   ├── Windows (floating, resizable)
 *   ├── Workspaces (virtual desktops)
 *   ├── Taskbar (running apps, system tray)
 *   └── StartMenu (application launcher)
 */

// ── Window State ──

enum class WindowState {
    NORMAL, MINIMIZED, MAXIMIZED, CLOSED
}

enum class AppType {
    TERMINAL, FILE_MANAGER, CODE_EDITOR, BROWSER,
    MISSION_CONTROL, AGENT_MANAGER, INTELLIGENCE_CENTER,
    SETTINGS, MEMORY, PEGASUS_COMMAND, SYSTEM_MONITOR,
    RESEARCH_WORKSPACE, TESTING_WORKSPACE, MARKET_WORKSPACE
}

data class PegasusWindow(
    val id: String,
    val title: String,
    val appType: AppType,
    val state: WindowState = WindowState.NORMAL,
    val position: Offset = Offset(100f, 100f),
    val size: Size = Size(600f, 400f),
    val isFocused: Boolean = false,
    val workspaceId: Int = 0
)

// ── Workspace State ──

data class DesktopWorkspace(
    val id: Int,
    val name: String,
    val description: String = "",
    val windowIds: List<String> = emptyList()
)

// ── Desktop Manager ──

@Stable
class DesktopManager(
    private val coreManager: PegasusCoreManager
) {
    private val _windows = MutableStateFlow<List<PegasusWindow>>(emptyList())
    val windows: StateFlow<List<PegasusWindow>> = _windows.asStateFlow()

    private val _workspaces = MutableStateFlow<List<DesktopWorkspace>>(
        listOf(
            DesktopWorkspace(0, "Desktop 1", "Main workspace"),
            DesktopWorkspace(1, "Desktop 2", "Research"),
            DesktopWorkspace(2, "Desktop 3", "Development"),
            DesktopWorkspace(3, "Desktop 4", "Testing")
        )
    )
    val workspaces: StateFlow<List<DesktopWorkspace>> = _workspaces.asStateFlow()

    private val _activeWorkspaceId = MutableStateFlow(0)
    val activeWorkspaceId: StateFlow<Int> = _activeWorkspaceId.asStateFlow()

    private val _focusedWindowId = MutableStateFlow<String?>(null)
    val focusedWindowId: StateFlow<String?> = _focusedWindowId.asStateFlow()

    private val _showStartMenu = MutableStateFlow(false)
    val showStartMenu: StateFlow<Boolean> = _showStartMenu.asStateFlow()

    private val _showPegasusCommand = MutableStateFlow(false)
    val showPegasusCommand: StateFlow<Boolean> = _showPegasusCommand.asStateFlow()

    private var windowCounter = 0

    // ── Window Management ──

    fun openWindow(appType: AppType, title: String? = null, workspaceId: Int? = null): String {
        val id = "window_${++windowCounter}"
        val wsId = workspaceId ?: _activeWorkspaceId.value
        val window = PegasusWindow(
            id = id,
            title = title ?: appType.name.replace("_", " "),
            appType = appType,
            workspaceId = wsId,
            isFocused = true
        )

        // Unfocus all other windows
        val updatedWindows = _windows.value.map { it.copy(isFocused = false) } + window
        _windows.value = updatedWindows
        _focusedWindowId.value = id

        // Add to workspace
        updateWorkspaceWindows(wsId) { it + id }

        return id
    }

    fun closeWindow(windowId: String) {
        val window = _windows.value.find { it.id == windowId } ?: return
        _windows.value = _windows.value.filter { it.id != windowId }
        updateWorkspaceWindows(window.workspaceId) { ids -> ids.filter { it != windowId } }

        // Focus next window if any
        if (_focusedWindowId.value == windowId) {
            val remaining = _windows.value.filter { it.workspaceId == _activeWorkspaceId.value }
            _focusedWindowId.value = remaining.lastOrNull()?.id
        }
    }

    fun minimizeWindow(windowId: String) {
        _windows.value = _windows.value.map {
            if (it.id == windowId) it.copy(state = WindowState.MINIMIZED, isFocused = false)
            else it
        }
        if (_focusedWindowId.value == windowId) {
            val visible = _windows.value.filter {
                it.workspaceId == _activeWorkspaceId.value && it.state != WindowState.MINIMIZED
            }
            _focusedWindowId.value = visible.lastOrNull()?.id
            visible.lastOrNull()?.let { focusWindow(it.id) }
        }
    }

    fun maximizeWindow(windowId: String) {
        _windows.value = _windows.value.map {
            if (it.id == windowId) {
                val newState = if (it.state == WindowState.MAXIMIZED) WindowState.NORMAL else WindowState.MAXIMIZED
                it.copy(state = newState)
            } else it
        }
    }

    fun focusWindow(windowId: String) {
        _windows.value = _windows.value.map {
            it.copy(isFocused = it.id == windowId)
        }
        _focusedWindowId.value = windowId

        // Bring to front
        val window = _windows.value.find { it.id == windowId } ?: return
        if (window.state == WindowState.MINIMIZED) {
            minimizeWindow(windowId) // Toggle back to normal
            _windows.value = _windows.value.map {
                if (it.id == windowId) it.copy(state = WindowState.NORMAL, isFocused = true)
                else it.copy(isFocused = false)
            }
        }
    }

    fun moveWindow(windowId: String, position: Offset) {
        _windows.value = _windows.value.map {
            if (it.id == windowId) it.copy(position = position)
            else it
        }
    }

    fun resizeWindow(windowId: String, size: Size) {
        _windows.value = _windows.value.map {
            if (it.id == windowId) it.copy(size = size)
            else it
        }
    }

    // ── Workspace Management ──

    fun switchWorkspace(workspaceId: Int) {
        _activeWorkspaceId.value = workspaceId
        // Focus first visible window in new workspace
        val visible = _windows.value.filter {
            it.workspaceId == workspaceId && it.state != WindowState.MINIMIZED
        }
        if (visible.isNotEmpty()) {
            focusWindow(visible.last().id)
        } else {
            _focusedWindowId.value = null
        }
    }

    fun getVisibleWindows(): List<PegasusWindow> {
        return _windows.value.filter {
            it.workspaceId == _activeWorkspaceId.value && it.state != WindowState.MINIMIZED
        }
    }

    private fun updateWorkspaceWindows(workspaceId: Int, transform: (List<String>) -> List<String>) {
        _workspaces.value = _workspaces.value.map { ws ->
            if (ws.id == workspaceId) ws.copy(windowIds = transform(ws.windowIds))
            else ws
        }
    }

    // ── Start Menu ──

    fun toggleStartMenu() {
        _showStartMenu.value = !_showStartMenu.value
    }

    fun closeStartMenu() {
        _showStartMenu.value = false
    }

    // ── PEGASUS Command ──

    fun togglePegasusCommand() {
        _showPegasusCommand.value = !_showPegasusCommand.value
    }

    fun closePegasusCommand() {
        _showPegasusCommand.value = false
    }

    // ── Getters ──

    fun getPegasusCore() = coreManager
}
