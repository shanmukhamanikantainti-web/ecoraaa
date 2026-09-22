"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { SystemStatus, Mission, MemoryData, PairingState, ChatMessage } from "./types";
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
  theme: "light" | "dark";
  showWelcome: boolean;
  authStep: "welcome" | "create-account";
  mounted: boolean;
  isCommandPaletteOpen: boolean;
  userName: string;
  userRole: string;
  setUserName: (name: string) => void;
  setUserRole: (role: string) => void;
  setShowWelcome: (show: boolean) => void;
  setAuthStep: (step: "welcome" | "create-account") => void;
  toggleTheme: () => void;
  toggleCommandPalette: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  updateLastAssistantMessage: (updater: (prev: ChatMessage) => ChatMessage) => void;
  executeGoal: (goal: string, agentMode?: string) => Promise<void>;
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [userName, setUserNameState] = useState<string>("");
  const [userRole, setUserRoleState] = useState<string>("Lead Systems Architect & AI Specialist");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

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

  useEffect(() => {
    setMounted(true);
    // Ensure document element has light class by default
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("dark");
      const storedName = localStorage.getItem("ecoraa_user_name");
      if (storedName) {
        setUserNameState(storedName);
      }
      const storedRole = localStorage.getItem("ecoraa_user_role");
      if (storedRole) {
        setUserRoleState(storedRole);
      }
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
    setChatMessages((prev) => [...prev, msg]);
    supabaseService.saveMessage(msg);
  }, []);

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
      const [status, tasks, mem, pair, supaMem, supaMsgs] = await Promise.allSettled([
        api.getStatus(),
        api.getTasks(),
        api.getMemory(),
        api.getPairStatus(),
        supabaseService.getMemory(),
        supabaseService.getMessages(),
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
      if (supaMsgs.status === "fulfilled" && supaMsgs.value.length > 0) {
        setChatMessages(supaMsgs.value);
      }

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

  const executeGoal = useCallback(
    async (goal: string, agentMode: string = "GENERAL") => {
      if (!goal.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: goal,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
      };

      setChatMessages((prev) => [...prev, userMsg, assistantMsg]);
      await supabaseService.saveMessage(userMsg);
      await supabaseService.saveMessage(assistantMsg);

      try {
        const res = await api.executeGoal(goal, agentMode);
        const finalMsg: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: res.result || "Mission executed successfully.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "completed",
          missionId: res.mission_id,
          steps: res.steps || [],
        };

        setChatMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? finalMsg : msg))
        );
        await supabaseService.saveMessage(finalMsg);
        refreshState();
      } catch (err: any) {
        const errorMsg: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          content: `Mission execution error: ${err?.message || "Failed to reach Core"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "error",
        };
        setChatMessages((prev) =>
          prev.map((msg) => (msg.id === assistantMsgId ? errorMsg : msg))
        );
        await supabaseService.saveMessage(errorMsg);
      }
    },
    [refreshState]
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
      supabaseService.saveMission(mission);
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
        theme,
        showWelcome,
        authStep,
        mounted,
        isCommandPaletteOpen,
        userName,
        userRole,
        setUserName,
        setUserRole,
        setShowWelcome,
        setAuthStep,
        toggleTheme,
        toggleCommandPalette,
        openCommandPalette,
        closeCommandPalette,
        addChatMessage,
        updateLastAssistantMessage,
        executeGoal,
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
