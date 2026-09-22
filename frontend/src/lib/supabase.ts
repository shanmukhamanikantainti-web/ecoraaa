import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { ChatMessage, Mission, MemoryData, Project } from "./types";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dcnxsnsisbpxzwreyskw.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjbnhzbnNpc2JweHp3cmV5c2t3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTkyNzcsImV4cCI6MjEwNTU3NTI3N30.dmo_cfe4-_kKkeuEWUQgO5Gx6rLw4IzOy1T6xiL1L1Q";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const supabaseService = {
  // ── Projects ──
  async getProjects(userId: string): Promise<Project[]> {
    try {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Project[];
    } catch (err) {
      console.warn("[Supabase] Failed to fetch projects:", err);
      return [];
    }
  },

  async createProject(project: {
    id?: string;
    name: string;
    description?: string;
    user_id: string;
  }): Promise<Project | null> {
    try {
      const projId = project.id || `proj-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const { data, error } = await supabase
        .from("projects")
        .insert({
          id: projId,
          name: project.name,
          description: project.description || null,
          user_id: project.user_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    } catch (err) {
      console.error("[Supabase] Failed to create project:", err);
      throw err;
    }
  },

  async deleteProject(projectId: string): Promise<void> {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      if (error) throw error;
    } catch (err) {
      console.error("[Supabase] Failed to delete project:", err);
      throw err;
    }
  },

  // ── Chat Messages ──
  async getMessages(projectId?: string): Promise<ChatMessage[]> {
    try {
      let query = supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return [];

      return data.map((row) => ({
        id: row.id,
        role: row.role as "user" | "assistant" | "system",
        content: row.content,
        timestamp: row.timestamp,
        projectId: row.project_id || undefined,
        userId: row.user_id || undefined,
        missionId: row.mission_id || undefined,
        steps: row.steps ? (row.steps as any) : undefined,
        toolsUsed: row.tools_used || undefined,
        status: (row.status as any) || undefined,
      }));
    } catch (err) {
      console.warn("[Supabase] Failed to fetch chat messages:", err);
      return [];
    }
  },

  async saveMessage(msg: ChatMessage): Promise<void> {
    try {
      const { error } = await supabase.from("chat_messages").upsert({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        project_id: msg.projectId || null,
        user_id: msg.userId || null,
        mission_id: msg.missionId || null,
        steps: msg.steps ? (msg.steps as any) : null,
        tools_used: msg.toolsUsed || null,
        status: msg.status || null,
      });

      if (error) throw error;
    } catch (err) {
      console.warn("[Supabase] Failed to save chat message:", err);
    }
  },

  // ── Memory Items ──
  async getMemory(): Promise<MemoryData | null> {
    try {
      const { data, error } = await supabase.from("memory_items").select("*");
      if (error) throw error;
      if (!data) return null;

      const userRow = data.find((d) => d.category === "user");
      const projects = data.filter((d) => d.category === "projects").map((d) => d.value);
      const preferences = data.filter((d) => d.category === "preferences").map((d) => d.value);
      const goals = data.filter((d) => d.category === "goals").map((d) => d.value);

      const storedName = typeof window !== "undefined" ? localStorage.getItem("ecoraa_user_name") : null;

      return {
        user: userRow ? userRow.value : (storedName || "User"),
        projects,
        preferences,
        goals,
        enabled: true,
      };
    } catch (err) {
      console.warn("[Supabase] Failed to fetch memory items:", err);
      return null;
    }
  },

  async addMemoryItem(category: "user" | "projects" | "preferences" | "goals", value: string, userId?: string) {
    try {
      const uid =
        userId ||
        (typeof window !== "undefined" ? localStorage.getItem("ecoraa_user_id") : null) ||
        "2a322f60-33a0-49fe-9d74-ac9899031752";

      if (category === "user") {
        // Remove existing user profile and insert new one
        await supabase.from("memory_items").delete().eq("category", "user");
      }
      const { error } = await supabase.from("memory_items").insert({
        category,
        value,
        user_id: uid,
      });
      if (error) throw error;
    } catch (err) {
      console.warn("[Supabase] Failed to add memory item:", err);
    }
  },

  async removeMemoryItem(category: "user" | "projects" | "preferences" | "goals", value: string) {
    try {
      const { error } = await supabase
        .from("memory_items")
        .delete()
        .eq("category", category)
        .eq("value", value);
      if (error) throw error;
    } catch (err) {
      console.warn("[Supabase] Failed to remove memory item:", err);
    }
  },

  // ── Missions ──
  async saveMission(mission: Mission, projectId?: string, userId?: string): Promise<void> {
    try {
      const uid =
        userId ||
        (typeof window !== "undefined" ? localStorage.getItem("ecoraa_user_id") : null) ||
        "2a322f60-33a0-49fe-9d74-ac9899031752";
      const pid =
        projectId ||
        (typeof window !== "undefined" ? localStorage.getItem("ecoraa_active_project_id") : null) ||
        "proj-default-sai";

      const { error } = await supabase.from("missions").upsert({
        id: mission.id,
        goal: mission.goal,
        status: mission.status,
        steps: mission.steps ? (mission.steps as any) : null,
        result: mission.result || null,
        workspace: mission.workspace || null,
        created_at: mission.created_at || new Date().toISOString(),
        completed_at: mission.completed_at || null,
        user_id: uid,
        project_id: pid,
      });
      if (error) throw error;
    } catch (err) {
      console.warn("[Supabase] Failed to save mission:", err);
    }
  },

  // ── Authentication ──
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || "",
          name: fullName || "",
        },
      },
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signInWithOAuth(provider: "google" | "github") {
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard`
        : undefined;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) return null;
      return user;
    } catch {
      return null;
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) return null;
      return session;
    } catch {
      return null;
    }
  },
};

