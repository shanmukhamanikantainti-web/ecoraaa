package com.pegasus.os.core

import android.content.Context
import android.util.Log
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.TimeUnit

/**
 * PEGASUS Core Manager
 * Manages connection to the Python PEGASUS Core backend via HTTP/WebSocket.
 *
 * Architecture:
 *   Android UI ←→ PegasusCoreManager ←→ WebSocket/HTTP ←→ Python Backend
 */
class PegasusCoreManager(private val context: Context) {

    companion object {
        private const val TAG = "PegasusCore"
        private const val DEFAULT_HOST = "127.0.0.1"
        private const val DEFAULT_PORT = 8420
        private const val HTTP_TIMEOUT_SECONDS = 30L
    }

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(HTTP_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .readTimeout(HTTP_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .writeTimeout(HTTP_TIMEOUT_SECONDS, TimeUnit.SECONDS)
        .build()

    private var webSocket: WebSocket? = null

    private val _connectionState = MutableStateFlow(ConnectionState.DISCONNECTED)
    val connectionState: StateFlow<ConnectionState> = _connectionState.asStateFlow()

    private val _systemStatus = MutableStateFlow(SystemStatus())
    val systemStatus: StateFlow<SystemStatus> = _systemStatus.asStateFlow()

    private val host = DEFAULT_HOST
    private val port = DEFAULT_PORT

    private val baseUrl: String get() = "http://$host:$port"
    private val wsUrl: String get() = "ws://$host:$port/ws"

    // ── Connection Management ──

    fun connect() {
        scope.launch {
            _connectionState.value = ConnectionState.CONNECTING
            try {
                connectWebSocket()
                fetchSystemStatus()
                _connectionState.value = ConnectionState.CONNECTED
            } catch (e: Exception) {
                Log.e(TAG, "Connection failed", e)
                _connectionState.value = ConnectionState.ERROR
            }
        }
    }

    fun disconnect() {
        webSocket?.close(1000, "Client disconnect")
        webSocket = null
        _connectionState.value = ConnectionState.DISCONNECTED
    }

    private fun connectWebSocket() {
        val request = Request.Builder()
            .url(wsUrl)
            .build()

        webSocket = httpClient.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                Log.i(TAG, "WebSocket connected")
                _connectionState.value = ConnectionState.CONNECTED
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                handleWebSocketMessage(text)
            }

            override fun onClosing(webSocket: WebSocket, code: Int, reason: String) {
                webSocket.close(code, reason)
                _connectionState.value = ConnectionState.DISCONNECTED
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                Log.e(TAG, "WebSocket failure", t)
                _connectionState.value = ConnectionState.ERROR
                scheduleReconnect()
            }
        })
    }

    private fun scheduleReconnect() {
        scope.launch {
            delay(3000)
            if (_connectionState.value == ConnectionState.ERROR) {
                connect()
            }
        }
    }

    private fun handleWebSocketMessage(text: String) {
        try {
            val json = JSONObject(text)
            val type = json.optString("type", "")
            when (type) {
                "system_status" -> handleSystemStatus(json)
                "agent_update" -> handleAgentUpdate(json)
                "mission_update" -> handleMissionUpdate(json)
                "notification" -> handleNotification(json)
                "memory_update" -> handleMemoryUpdate(json)
                else -> Log.d(TAG, "Unknown message type: $type")
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to parse WebSocket message", e)
        }
    }

    // ── HTTP API ──

    suspend fun sendCommand(command: String, params: JSONObject = JSONObject()): PegasusResponse {
        return withContext(Dispatchers.IO) {
            try {
                val body = JSONObject().apply {
                    put("command", command)
                    put("params", params)
                }

                val request = Request.Builder()
                    .url("$baseUrl/api/command")
                    .post(body.toString().toRequestBody("application/json".toMediaType()))
                    .build()

                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string() ?: "{}"
                PegasusResponse.Success(JSONObject(responseBody))
            } catch (e: Exception) {
                Log.e(TAG, "Command failed: $command", e)
                PegasusResponse.Error(e.message ?: "Unknown error")
            }
        }
    }

    suspend fun sendGoal(goal: String): PegasusResponse {
        val params = JSONObject().apply {
            put("goal", goal)
        }
        return sendCommand("execute_goal", params)
    }

    suspend fun fetchSystemStatus(): SystemStatus {
        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url("$baseUrl/api/status")
                    .get()
                    .build()

                val response = httpClient.newCall(request).execute()
                val body = response.body?.string() ?: "{}"
                val json = JSONObject(body)
                val status = SystemStatus(
                    coreOnline = json.optBoolean("core_online", false),
                    agentsActive = json.optInt("agents_active", 0),
                    uptime = json.optLong("uptime", 0),
                    version = json.optString("version", "0.1.0")
                )
                _systemStatus.value = status
                status
            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch status", e)
                SystemStatus()
            }
        }
    }

    suspend fun fetchMissions(): List<Mission> {
        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url("$baseUrl/api/missions")
                    .get()
                    .build()

                val response = httpClient.newCall(request).execute()
                val body = response.body?.string() ?: "[]"
                val array = org.json.JSONArray(body)
                val missions = mutableListOf<Mission>()
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    missions.add(Mission.fromJson(obj))
                }
                missions
            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch missions", e)
                emptyList()
            }
        }
    }

    suspend fun fetchAgents(): List<AgentInfo> {
        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url("$baseUrl/api/agents")
                    .get()
                    .build()

                val response = httpClient.newCall(request).execute()
                val body = response.body?.string() ?: "[]"
                val array = org.json.JSONArray(body)
                val agents = mutableListOf<AgentInfo>()
                for (i in 0 until array.length()) {
                    val obj = array.getJSONObject(i)
                    agents.add(AgentInfo.fromJson(obj))
                }
                agents
            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch agents", e)
                emptyList()
            }
        }
    }

    suspend fun fetchMemory(): MemoryState {
        return withContext(Dispatchers.IO) {
            try {
                val request = Request.Builder()
                    .url("$baseUrl/api/memory")
                    .get()
                    .build()

                val response = httpClient.newCall(request).execute()
                val body = response.body?.string() ?: "{}"
                val json = JSONObject(body)
                MemoryState.fromJson(json)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to fetch memory", e)
                MemoryState()
            }
        }
    }

    // ── WebSocket Message Handlers ──

    private fun handleSystemStatus(json: JSONObject) {
        val status = SystemStatus(
            coreOnline = json.optBoolean("core_online", false),
            agentsActive = json.optInt("agents_active", 0),
            uptime = json.optLong("uptime", 0),
            version = json.optString("version", "0.1.0")
        )
        _systemStatus.value = status
    }

    private fun handleAgentUpdate(json: JSONObject) {
        // Agent state changed — triggers recomposition via StateFlow
        Log.d(TAG, "Agent update: ${json.toString()}")
    }

    private fun handleMissionUpdate(json: JSONObject) {
        Log.d(TAG, "Mission update: ${json.toString()}")
    }

    private fun handleNotification(json: JSONObject) {
        Log.d(TAG, "Notification: ${json.toString()}")
    }

    private fun handleMemoryUpdate(json: JSONObject) {
        Log.d(TAG, "Memory update: ${json.toString()}")
    }

    fun destroy() {
        disconnect()
        scope.cancel()
    }
}

// ── Data Models ──

enum class ConnectionState {
    DISCONNECTED, CONNECTING, CONNECTED, ERROR
}

data class SystemStatus(
    val coreOnline: Boolean = false,
    val agentsActive: Int = 0,
    val uptime: Long = 0,
    val version: String = "0.1.0"
)

data class Mission(
    val id: String = "",
    val goal: String = "",
    val status: MissionStatus = MissionStatus.PLANNING,
    val steps: List<MissionStep> = emptyList(),
    val createdAt: Long = System.currentTimeMillis()
) {
    companion object {
        fun fromJson(json: JSONObject): Mission {
            val stepsArray = json.optJSONArray("steps") ?: org.json.JSONArray()
            val steps = mutableListOf<MissionStep>()
            for (i in 0 until stepsArray.length()) {
                steps.add(MissionStep.fromJson(stepsArray.getJSONObject(i)))
            }
            return Mission(
                id = json.optString("id", ""),
                goal = json.optString("goal", ""),
                status = MissionStatus.valueOf(json.optString("status", "PLANNING")),
                steps = steps,
                createdAt = json.optLong("created_at", System.currentTimeMillis())
            )
        }
    }
}

data class MissionStep(
    val name: String = "",
    val status: StepStatus = StepStatus.PENDING,
    val agent: String? = null
) {
    companion object {
        fun fromJson(json: JSONObject): MissionStep {
            return MissionStep(
                name = json.optString("name", ""),
                status = StepStatus.valueOf(json.optString("status", "PENDING")),
                agent = json.optString("agent", null)
            )
        }
    }
}

enum class MissionStatus { PLANNING, RUNNING, COMPLETED, FAILED, PAUSED }
enum class StepStatus { PENDING, RUNNING, COMPLETED, FAILED }

data class AgentInfo(
    val name: String = "",
    val type: String = "",
    val state: AgentState = AgentState.IDLE,
    val currentTask: String? = null,
    val runtime: Long = 0,
    val cpuUsage: Float = 0f,
    val memoryUsage: Float = 0f
) {
    companion object {
        fun fromJson(json: JSONObject): AgentInfo {
            return AgentInfo(
                name = json.optString("name", ""),
                type = json.optString("type", ""),
                state = AgentState.valueOf(json.optString("state", "IDLE")),
                currentTask = json.optString("current_task", null),
                runtime = json.optLong("runtime", 0),
                cpuUsage = json.optDouble("cpu_usage", 0.0).toFloat(),
                memoryUsage = json.optDouble("memory_usage", 0.0).toFloat()
            )
        }
    }
}

enum class AgentState { IDLE, PLANNING, RUNNING, WAITING, COMPLETED, FAILED, PAUSED, STOPPED }

data class MemoryState(
    val user: String = "",
    val projects: List<String> = emptyList(),
    val preferences: List<String> = emptyList(),
    val goals: List<String> = emptyList()
) {
    companion object {
        fun fromJson(json: JSONObject): MemoryState {
            val user = json.optString("user", "")
            val projects = json.optJSONArray("projects")?.let { arr ->
                (0 until arr.length()).map { arr.getString(it) }
            } ?: emptyList()
            val preferences = json.optJSONArray("preferences")?.let { arr ->
                (0 until arr.length()).map { arr.getString(it) }
            } ?: emptyList()
            val goals = json.optJSONArray("goals")?.let { arr ->
                (0 until arr.length()).map { arr.getString(it) }
            } ?: emptyList()
            return MemoryState(user, projects, preferences, goals)
        }
    }
}

sealed class PegasusResponse {
    data class Success(val data: JSONObject) : PegasusResponse()
    data class Error(val message: String) : PegasusResponse()
}

// ── ECORAA Companion Helpers ─────────────────────────────────────────────────

/**
 * Submit a natural-language goal to the ECORAA backend.
 * Used by EcoraaAiScreen to trigger the multi-agent pipeline.
 *
 * @return Extracted result string from the backend response, or null.
 */
suspend fun submitGoal(goal: String): String? {
    return withContext(kotlinx.coroutines.Dispatchers.IO) {
        try {
            val body = JSONObject().apply { put("goal", goal) }
            val request = Request.Builder()
                .url("$baseUrl/api/goals")
                .post(body.toString().toRequestBody("application/json".toMediaType()))
                .build()
            val response = httpClient.newCall(request).execute()
            val responseText = response.body?.string() ?: "{}"
            val json = JSONObject(responseText)
            json.optString("result").ifEmpty { json.optString("message", "Task submitted.") }
        } catch (e: Exception) {
            Log.e(TAG, "submitGoal failed", e)
            null
        }
    }
}

/**
 * Execute a shell/terminal command via the ECORAA backend.
 * Used by IdeScreen terminal panel.
 *
 * @return Output string from the backend, or null on error.
 */
suspend fun executeCommand(command: String): String? {
    return withContext(kotlinx.coroutines.Dispatchers.IO) {
        try {
            val body = JSONObject().apply { put("command", command) }
            val request = Request.Builder()
                .url("$baseUrl/api/terminal")
                .post(body.toString().toRequestBody("application/json".toMediaType()))
                .build()
            val response = httpClient.newCall(request).execute()
            val responseText = response.body?.string() ?: "{}"
            val json = JSONObject(responseText)
            json.optString("output").ifEmpty { "[Command sent]" }
        } catch (e: Exception) {
            Log.e(TAG, "executeCommand failed: $command", e)
            "[Error] Could not reach ECORAA backend: ${e.message}"
        }
    }
}

