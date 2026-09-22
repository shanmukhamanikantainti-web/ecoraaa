import {
  SystemStatus,
  WorkspaceInfo,
  PairingState,
  Mission,
  MemoryData,
  CaseSession,
  UsbStatus,
} from "./types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8420";

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] Failed to fetch ${url}:`, err);
    throw err;
  }
}

export const api = {
  // System Status
  getStatus: () => fetchJson<SystemStatus>("/api/status"),

  // Workspace
  getWorkspace: () => fetchJson<WorkspaceInfo>("/api/workspace"),
  setWorkspace: (path: string) =>
    fetchJson<{ status: string; workspace: WorkspaceInfo }>("/api/workspace", {
      method: "POST",
      body: JSON.stringify({ path }),
    }),

  // Pairing & Companion
  getPairStatus: () => fetchJson<PairingState>("/api/pair/status"),
  pairDevice: (code: string) =>
    fetchJson<{ status: string; device_id: string; session_token: string; workspace: WorkspaceInfo }>(
      "/api/pair",
      {
        method: "POST",
        body: JSON.stringify({ code }),
      }
    ),

  // Goal & Mission Execution
  executeGoal: (goal: string, workspace?: string) =>
    fetchJson<{
      mission_id: string;
      status: string;
      result?: string;
      steps?: any[];
      workspace?: string;
    }>("/api/execute", {
      method: "POST",
      body: JSON.stringify({ goal, workspace: workspace || "" }),
    }),

  getTasks: () =>
    fetchJson<{ active: Mission[]; completed: Mission[] }>("/api/tasks"),

  getTaskById: (taskId: string) => fetchJson<Mission>(`/api/tasks/${taskId}`),

  cancelTask: (taskId: string) =>
    fetchJson<{ status: string; task_id: string }>(`/api/tasks/${taskId}/cancel`, {
      method: "POST",
    }),

  // Agents
  getAgents: () => fetchJson<Record<string, any>>("/api/agents"),

  // Memory
  getMemory: () => fetchJson<MemoryData>("/api/memory"),
  updateMemory: (action: string, value: string = "", category: string = "") =>
    fetchJson<MemoryData>("/api/memory", {
      method: "POST",
      body: JSON.stringify({ action, value, category }),
    }),

  // Terminal
  runTerminal: (command: string) =>
    fetchJson<{ output: string; exit_code: number }>("/api/terminal", {
      method: "POST",
      body: JSON.stringify({ command }),
    }),

  // USB & Cases
  getUsbStatus: () => fetchJson<UsbStatus>("/api/usb-status"),
  listCases: () => fetchJson<CaseSession[]>("/api/cases"),
};
