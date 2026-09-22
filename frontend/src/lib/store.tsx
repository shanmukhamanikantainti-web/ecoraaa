"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";
import { SystemStatus, Mission, MemoryData, PairingState, ChatMessage, Project } from "./types";
import { api } from "./api";
import { wsManager } from "./websocket";
import { supabaseService } from "./supabase";

interface AppContextType {
  isConnected: boolean;
  isSupabaseConnected: boolean;
  systemStatus: SystemStatus | null;
  activeMissions: Mission[];
  completedMissions: Mission[];
  memory: MemoryData | null;
  pairing: PairingState | null;
  chatMessages: ChatMessage[];
  projects: Project[];
  activeProject: Project | null;
  userId: string;
  theme: "light" | "dark";
  showWelcome: boolean;
  authStep: "welcome" | "create-account";
  mounted: boolean;
  isCommandPaletteOpen: boolean;
  userName: string;
  userRole: string;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean, rememberDevice?: boolean) => void;
  logout: () => Promise<void>;
  setUserName: (name: string) => void;
  setUserRole: (role: string) => void;
  setShowWelcome: (show: boolean) => void;
  setAuthStep: (step: "welcome" | "create-account") => void;
  toggleTheme: () => void;
  toggleCommandPalette: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setActiveProject: (project: Project | null) => void;
  createProject: (name: string, description?: string) => Promise<Project | null>;
  deleteProject: (projectId: string) => Promise<void>;
  refreshProjects: (targetUserId?: string) => Promise<void>;
  addChatMessage: (msg: ChatMessage) => void;
  updateLastAssistantMessage: (updater: (prev: ChatMessage) => ChatMessage) => void;
  executeGoal: (goal: string, agentMode?: string) => Promise<void>;
  isExecuting: boolean;
  stopExecution: () => Promise<void>;
  refreshState: () => Promise<void>;
}

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [completedMissions, setCompletedMissions] = useState<Mission[]>([]);
  const [memory, setMemory] = useState<MemoryData | null>(null);
  const [pairing, setPairing] = useState<PairingState | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [showWelcome, setShowWelcomeState] = useState<boolean>(true);
  const [authStep, setAuthStep] = useState<"welcome" | "create-account">("welcome");
  const [isAuthenticated, setIsAuthenticatedState] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [userName, setUserNameState] = useState<string>("");
  const [userRole, setUserRoleState] = useState<string>("Lead Systems Architect & AI Specialist");
  const [userId, setUserId] = useState<string>("2a322f60-33a0-49fe-9d74-ac9899031752");
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProjectState] = useState<Project | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentAssistantMsgIdRef = useRef<string | null>(null);

  const setUserName = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setUserNameState(trimmed);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecoraa_user_name", trimmed);
    }
    supabaseService.addMemoryItem("user", trimmed).catch(() => {});
    api.updateMemory("set_user", trimmed).catch(() => {});
  }, []);

  const setUserRole = useCallback((role: string) => {
    const trimmed = role.trim();
    if (!trimmed) return;
    setUserRoleState(trimmed);
    if (typeof window !== "undefined") {
      localStorage.setItem("ecoraa_user_role", trimmed);
    }
  }, []);

  const setActiveProject = useCallback((project: Project | null) => {
    setActiveProjectState(project);
    if (typeof window !== "undefined") {
      if (project?.id) {
        localStorage.setItem("ecoraa_active_project_id", project.id);
      } else {
        localStorage.removeItem("ecoraa_active_project_id");
      }
    }
    if (project?.id) {
      supabaseService.getMessages(project.id).then((msgs) => {
        setChatMessages(msgs);
      }).catch((err) => {
        console.warn("[Store] Failed to load messages for project:", err);
      });
    } else {
      setChatMessages([]);
    }
  }, []);

  const refreshProjects = useCallback(async (targetUserId?: string) => {
    const uid =
      targetUserId ||
      (typeof window !== "undefined" ? localStorage.getItem("ecoraa_user_id") : null) ||
      userId ||
      "2a322f60-33a0-49fe-9d74-ac9899031752";

    try {
      const userProjects = await supabaseService.getProjects(uid);
      setProjects(userProjects);

      const savedProjectId = typeof window !== "undefined" ? localStorage.getItem("ecoraa_active_project_id") : null;
      let matched = userProjects.find((p) => p.id === savedProjectId);
      if (!matched && userProjects.length > 0) {
        matched = userProjects[0];
      }

      if (matched) {
        setActiveProjectState(matched);
        if (typeof window !== "undefined") {
          localStorage.setItem("ecoraa_active_project_id", matched.id);
        }
        const msgs = await supabaseService.getMessages(matched.id);
        setChatMessages(msgs);
      } else if (userProjects.length === 0) {
        // Automatically scaffold an initial workspace project for this user
        const defaultProj = await supabaseService.createProject({
          name: "General AI Workspace",
          description: "Default workspace project",
          user_id: uid,
        });
        if (defaultProj) {
          setProjects([defaultProj]);
          setActiveProjectState(defaultProj);
          if (typeof window !== "undefined") {
            localStorage.setItem("ecoraa_active_project_id", defaultProj.id);
          }
        }
      }
    } catch (err) {
      console.warn("[Store] Failed to refresh projects:", err);
    }
  }, [userId]);

  const createProject = useCallback(async (name: string, description?: string): Promise<Project | null> => {
    const uid =
      (typeof window !== "undefined" ? localStorage.getItem("ecoraa_user_id") : null) ||
      userId ||
      "2a322f60-33a0-49fe-9d74-ac9899031752";

    try {
      const newProj = await supabaseService.createProject({
        name: name.trim(),
        description: description?.trim() || undefined,
        user_id: uid,
      });

      if (newProj) {
        setProjects((prev) => [newProj, ...prev]);
        setActiveProject(newProj);
        setChatMessages([]);
        return newProj;
      }
      return null;
    } catch (err) {
      console.error("[Store] Create project error:", err);
      throw err;
    }
  }, [userId, setActiveProject]);

  const deleteProject = useCallback(async (projectId: string) => {
    try {
      await supabaseService.deleteProject(projectId);
      setProjects((prev) => {
        const updated = prev.filter((p) => p.id !== projectId);
        if (activeProject?.id === projectId) {
          const nextActive = updated[0] || null;
          setActiveProject(nextActive);
        }
        return updated;
      });
    } catch (err) {
      console.error("[Store] Delete project error:", err);
      throw err;
    }
  }, [activeProject, setActiveProject]);

  useEffect(() => {
    setMounted(true);
    // Ensure document element has light class by default
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("dark");

      const isDeviceSaved =
        localStorage.getItem("ecoraa_device_saved") === "true" ||
        localStorage.getItem("ecoraa_authenticated") === "true";
      const storedName = localStorage.getItem("ecoraa_user_name");
      const storedRole = localStorage.getItem("ecoraa_user_role");
      const storedUserId = localStorage.getItem("ecoraa_user_id");

      if (storedName) {
        setUserNameState(storedName);
      }
      if (storedRole) {
        setUserRoleState(storedRole);
      }
      if (storedUserId) {
        setUserId(storedUserId);
      }

      // If user was previously authenticated on this device, restore immediately!
      if (isDeviceSaved || storedName) {
        setIsAuthenticatedState(true);
        setShowWelcomeState(false);
      }

      // Check active Supabase auth session
      supabaseService.getSession().then((session) => {
        if (session?.user) {
          setIsAuthenticatedState(true);
          setShowWelcomeState(false);
          localStorage.setItem("ecoraa_authenticated", "true");
          localStorage.setItem("ecoraa_device_saved", "true");
          setUserId(session.user.id);
          localStorage.setItem("ecoraa_user_id", session.user.id);
          const authUser = session.user;
          const metaName = authUser.user_metadata?.full_name || authUser.user_metadata?.name;
          if (metaName) {
            setUserNameState(metaName);
            localStorage.setItem("ecoraa_user_name", metaName);
          }
          refreshProjects(session.user.id);
        } else {
          refreshProjects(storedUserId || "2a322f60-33a0-49fe-9d74-ac9899031752");
        }
      }).catch(() => {
        refreshProjects(storedUserId || "2a322f60-33a0-49fe-9d74-ac9899031752");
      });
    }
  }, [refreshProjects]);

  const setIsAuthenticated = useCallback((auth: boolean, rememberDevice: boolean = true) => {
    setIsAuthenticatedState(auth);
    if (auth) {
      setShowWelcomeState(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("ecoraa_authenticated", "true");
        if (rememberDevice) {
          localStorage.setItem("ecoraa_device_saved", "true");
        }
        localStorage.setItem("ecoraa_visited", "true");
      }
      refreshProjects();
    } else {
      setShowWelcomeState(true);
      if (typeof window !== "undefined") {
        localStorage.removeItem("ecoraa_authenticated");
        localStorage.removeItem("ecoraa_device_saved");
      }
    }
  }, [refreshProjects]);

  const logout = useCallback(async () => {
    setIsAuthenticatedState(false);
    setShowWelcomeState(true);
    setAuthStep("welcome");
    if (typeof window !== "undefined") {
      localStorage.removeItem("ecoraa_authenticated");
      localStorage.removeItem("ecoraa_device_saved");
    }
    try {
      await supabaseService.signOut();
    } catch {
      // ignore
    }
  }, []);

  const setShowWelcome = useCallback((show: boolean) => {
    setShowWelcomeState(show);
    if (typeof window !== "undefined") {
      if (!show) {
        localStorage.setItem("ecoraa_visited", "true");
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        if (next === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  }, []);

  const toggleCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen((prev) => !prev);
  }, []);

  const openCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(true);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setIsCommandPaletteOpen(false);
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    const enrichedMsg: ChatMessage = {
      ...msg,
      projectId: msg.projectId || activeProject?.id,
      userId: msg.userId || userId,
    };
    setChatMessages((prev) => [...prev, enrichedMsg]);
    supabaseService.saveMessage(enrichedMsg);
  }, [activeProject, userId]);

  const updateLastAssistantMessage = useCallback((updater: (prev: ChatMessage) => ChatMessage) => {
    setChatMessages((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.role !== "assistant") return prev;
      const updated = updater(last);
      supabaseService.saveMessage(updated);
      return [...prev.slice(0, -1), updated];
    });
  }, []);

  const refreshState = useCallback(async () => {
    try {
      const [status, tasks, mem, pair, supaMem] = await Promise.allSettled([
        api.getStatus(),
        api.getTasks(),
        api.getMemory(),
        api.getPairStatus(),
        supabaseService.getMemory(),
      ]);

      if (status.status === "fulfilled") setSystemStatus(status.value);
      if (tasks.status === "fulfilled") {
        setActiveMissions(tasks.value.active || []);
        setCompletedMissions(tasks.value.completed || []);
      }
      if (mem.status === "fulfilled") {
        setMemory(mem.value);
        if (mem.value?.user && !mem.value.user.toLowerCase().includes("engineering student")) {
          setUserNameState((curr) => curr || mem.value.user);
        }
      }
      if (supaMem.status === "fulfilled" && supaMem.value) {
        if (!mem || mem.status !== "fulfilled") {
          setMemory(supaMem.value);
        }
        const supaUser = supaMem.value.user;
        if (supaUser && supaUser !== "User") {
          setUserNameState((curr) => {
            const next = curr || supaUser;
            if (typeof window !== "undefined" && !localStorage.getItem("ecoraa_user_name")) {
              localStorage.setItem("ecoraa_user_name", next);
            }
            return next;
          });
        }
      }
      if (pair.status === "fulfilled") setPairing(pair.value);

      // Check active Supabase Auth user
      supabaseService.getUser().then((authUser) => {
        if (authUser) {
          const authName = authUser.user_metadata?.full_name || authUser.user_metadata?.name;
          if (authName) {
            setUserNameState(authName);
            if (typeof window !== "undefined") {
              localStorage.setItem("ecoraa_user_name", authName);
            }
          }
        }
      }).catch(() => {});

      setIsConnected(true);
      setIsSupabaseConnected(true);
    } catch {
      setIsConnected(false);
    }
  }, []);

  const stopExecution = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    try {
      await api.stopAll();
    } catch (e) {
      console.warn("Error calling stopAll:", e);
    }
    const currentAssistantMsgId = currentAssistantMsgIdRef.current;
    if (currentAssistantMsgId) {
      const stoppedMsg: ChatMessage = {
        id: currentAssistantMsgId,
        role: "assistant",
        content: "Response stopped by user.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "completed",
        projectId: activeProject?.id,
        userId: userId,
      };
      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === currentAssistantMsgId ? stoppedMsg : msg))
      );
      await supabaseService.saveMessage(stoppedMsg);
    }
    setIsExecuting(false);
    refreshState();
  }, [activeProject, userId, refreshState]);

  const executeGoal = useCallback(
    async (goal: string, agentMode: string = "GENERAL") => {
      if (!goal.trim()) return;

      const currentProjectId = activeProject?.id;
      const currentUserId =
        (typeof window !== "undefined" ? localStorage.getItem("ecoraa_user_id") : null) ||
        userId ||
        "2a322f60-33a0-49fe-9d74-ac9899031752";

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: goal,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        projectId: currentProjectId,
        userId: currentUserId,
      };

      const assistantMsgId = `asst-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: "assistant",
        content: "Dispatching agents and executing plan...",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "streaming",
        steps: [],
        toolsUsed: [],
        projectId: currentProjectId,
        userId: currentUserId,
      };

      const controller = new AbortController();
      abortControllerRef.current = controller;
      currentAssistantMsgIdRef.current = assistantMsgId;
      setIsExecuting(true);

      setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
      await supabaseService.saveMessage(userMsg);
      await supabaseService.saveMessage(assistantMsg);

      try {
        const res = await api.executeGoal(goal, agentMode, undefined, controller.signal);
        const finalMsg: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: res.result || "Mission executed successfully.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "completed",
          missionId: res.mission_id,
          steps: res.steps || [],
          projectId: currentProjectId,
          userId: currentUserId,
        };

        setChatMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? finalMsg : msg))
        );
        await supabaseService.saveMessage(finalMsg);
        refreshState();
      } catch (err: any) {
        if (err?.name === "AbortError" || controller.signal.aborted) {
          const stoppedMsg: ChatMessage = {
            id: assistantMsgId,
            role: "assistant",
            content: "Response stopped by user.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: "completed",
            projectId: currentProjectId,
            userId: currentUserId,
          };
          setChatMessages((prev) =>
            prev.map((msg) => (msg.id === assistantMsgId ? stoppedMsg : msg))
          );
          await supabaseService.saveMessage(stoppedMsg);
        } else {
          const errorMsg: ChatMessage = {
            id: assistantMsgId,
            role: "assistant",
            content: `Mission execution error: ${err?.message || "Failed to reach Core"}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            status: "error",
            projectId: currentProjectId,
            userId: currentUserId,
          };
          setChatMessages((prev) =>
            prev.map((msg) => (msg.id === assistantMsgId ? errorMsg : msg))
          );
          await supabaseService.saveMessage(errorMsg);
        }
      } finally {
        setIsExecuting(false);
        abortControllerRef.current = null;
        currentAssistantMsgIdRef.current = null;
      }
    },
    [activeProject, userId, refreshState]
  );

  useEffect(() => {
    // Init websocket and state sync
    wsManager.connect();

    const unsubConn = wsManager.on("connection_status", (data) => {
      setIsConnected(data.connected);
      if (data.connected) refreshState();
    });

    const unsubMission = wsManager.on("mission_update", (mission: Mission) => {
      setActiveMissions((prev) => {
        const idx = prev.findIndex((m) => m.id === mission.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = mission;
          return updated;
        }
        return [...prev, mission];
      });
      supabaseService.saveMission(mission, activeProject?.id, userId);
      refreshState();
    });

    const unsubAgentEvent = wsManager.on("agent_event", (data) => {
      console.log("[WS] Agent Event:", data);
      refreshState();
    });

    const unsubPairing = wsManager.on("pairing_changed", (data) => {
      setPairing(data);
    });

    const unsubMemory = wsManager.on("memory_update", (data) => {
      setMemory(data);
    });

    refreshState();

    // Keybindings: Ctrl+K, Ctrl+Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === " " || e.code === "Space")) {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === "Escape") {
        closeCommandPalette();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      unsubConn();
      unsubMission();
      unsubAgentEvent();
      unsubPairing();
      unsubMemory();
      window.removeEventListener("keydown", handleKeyDown);
      wsManager.disconnect();
    };
  }, [refreshState, toggleCommandPalette, closeCommandPalette]);

  return (
    <AppContext.Provider
      value={{
        isConnected,
        isSupabaseConnected,
        systemStatus,
        activeMissions,
        completedMissions,
        memory,
        pairing,
        chatMessages,
        projects,
        activeProject,
        userId,
        theme,
        showWelcome,
        authStep,
        mounted,
        isCommandPaletteOpen,
        userName,
        userRole,
        isAuthenticated,
        setIsAuthenticated,
        logout,
        setUserName,
        setUserRole,
        setShowWelcome,
        setAuthStep,
        toggleTheme,
        toggleCommandPalette,
        openCommandPalette,
        closeCommandPalette,
        setActiveProject,
        createProject,
        deleteProject,
        refreshProjects,
        addChatMessage,
        updateLastAssistantMessage,
        executeGoal,
        isExecuting,
        stopExecution,
        refreshState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
