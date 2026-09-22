export interface WorkspaceInfo {
  path: string;
  name: string;
  valid: boolean;
}

export interface PairingState {
  paired: boolean;
  code: string;
  device_name: string | null;
  token: string | null;
  paired_at: number | null;
}

export interface SystemStatus {
  core_online: boolean;
  agents_active: number;
  uptime: number;
  version: string;
  agents: string[];
  tools: string[];
  workspace: WorkspaceInfo;
  pairing: PairingState;
}

export interface AgentInfo {
  name: string;
  role: string;
  status: "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED";
  current_task?: string;
  tools: string[];
}

export interface MissionStep {
  step_number: number;
  description: string;
  agent: string;
  tool?: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  result?: string;
  timestamp: string;
}

export interface Mission {
  id: string;
  goal: string;
  status: "PLANNING" | "EXECUTING" | "COMPLETED" | "FAILED" | "CANCELLED";
  steps: MissionStep[];
  result?: string;
  created_at: string;
  completed_at?: string;
  workspace?: string;
}

export interface MemoryData {
  user: string;
  projects: string[];
  preferences: string[];
  goals: string[];
  enabled: boolean;
  last_updated?: string;
}

export interface CaseSession {
  id: string;
  timestamp: string;
  title: string;
  status: "PASSED" | "FAILED" | "IN_PROGRESS";
  recording_path?: string;
  timeline_events: number;
}

export interface UsbStatus {
  mounted: boolean;
  path: string;
  total_bytes: number;
  used_bytes: number;
  free_bytes: number;
  format: string;
  persistent_folders: string[];
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  projectId?: string;
  userId?: string;
  missionId?: string;
  steps?: MissionStep[];
  toolsUsed?: string[];
  status?: "streaming" | "completed" | "error";
}

export interface TerminalOutput {
  command: string;
  output: string;
  exit_code: number;
  timestamp: string;
}
