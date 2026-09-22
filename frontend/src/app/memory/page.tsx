"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { supabaseService } from "@/lib/supabase";
import {
  Brain,
  Plus,
  Trash2,
  UserCheck,
  FolderGit2,
  SlidersHorizontal,
  Target,
  Database,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function MemoryPage() {
  const { memory, refreshState } = useApp();
  const [newVal, setNewVal] = useState("");
  const [activeCategory, setActiveCategory] = useState<"projects" | "preferences" | "goals" | "user">(
    "projects"
  );
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddMemory = async () => {
    if (!newVal.trim()) return;
    setLoading(true);
    try {
      // Sync with both Backend Core and Supabase Database
      if (activeCategory === "user") {
        await Promise.allSettled([
          api.updateMemory("set_user", newVal),
          supabaseService.addMemoryItem("user", newVal),
        ]);
      } else if (activeCategory === "projects") {
        await Promise.allSettled([
          api.updateMemory("add_project", newVal),
          supabaseService.addMemoryItem("projects", newVal),
        ]);
      } else if (activeCategory === "preferences") {
        await Promise.allSettled([
          api.updateMemory("add_preference", newVal),
          supabaseService.addMemoryItem("preferences", newVal),
        ]);
      } else if (activeCategory === "goals") {
        await Promise.allSettled([
          api.updateMemory("add_goal", newVal),
          supabaseService.addMemoryItem("goals", newVal),
        ]);
      }
      setNewVal("");
      setIsAdding(false);
      await refreshState();
    } catch (err) {
      console.error("Failed to update memory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMemory = async (category: "projects" | "preferences" | "goals", value: string) => {
    try {
      if (category === "projects") {
        await Promise.allSettled([
          api.updateMemory("remove_project", value),
          supabaseService.removeMemoryItem("projects", value),
        ]);
      } else if (category === "preferences") {
        await Promise.allSettled([
          api.updateMemory("remove_preference", value),
          supabaseService.removeMemoryItem("preferences", value),
        ]);
      } else if (category === "goals") {
        await Promise.allSettled([
          api.updateMemory("remove_goal", value),
          supabaseService.removeMemoryItem("goals", value),
        ]);
      }
      await refreshState();
    } catch (err) {
      console.error("Failed to remove memory item:", err);
    }
  };

  const handleToggleMemory = async () => {
    try {
      const action = memory?.enabled ? "disable" : "enable";
      await api.updateMemory(action);
      await refreshState();
    } catch (err) {
      console.error("Failed to toggle memory:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-md shadow-blue-500/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Semantic Memory & Supabase Context</h1>
            <p className="text-xs text-muted-foreground">
              Persistent cross-session knowledge synchronized with Postgres DB & vector store
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-card text-xs font-mono">
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span>Supabase Sync Active</span>
          </div>
          <Button
            variant={memory?.enabled ? "secondary" : "danger"}
            size="sm"
            onClick={handleToggleMemory}
          >
            {memory?.enabled ? "Memory Enabled" : "Memory Disabled"}
          </Button>
        </div>
      </div>

      {/* Add Memory Modal / Bar */}
      {isAdding && (
        <GlassCard className="p-4 border-blue-400/50 bg-white/90 dark:bg-slate-900/90 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono text-blue-600 dark:text-blue-400">
              Add Context to {activeCategory.toUpperCase()} (Syncs to Supabase)
            </span>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Cancel
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder={`Enter new ${activeCategory} information...`}
              className="flex-1 px-3 py-2 text-sm bg-surface border border-border/70 rounded-lg outline-none focus:border-blue-500 text-foreground placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddMemory();
              }}
            />
            <Button size="sm" variant="primary" onClick={handleAddMemory} disabled={loading}>
              Save to Supabase
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Memory Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Identity Profile */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold text-foreground">User Identity Profile</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveCategory("user");
                setIsAdding(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="p-3.5 rounded-2xl liquid-glass-card text-xs font-mono text-foreground leading-relaxed">
            {memory?.user || "Sai Chandra Kiran (AI & Data Science Specialist)"}
          </div>
        </GlassCard>

        {/* Projects Context */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-cyan-600" />
              <h2 className="text-sm font-bold text-foreground">Active Projects ({memory?.projects?.length || 0})</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveCategory("projects");
                setIsAdding(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {memory?.projects && memory.projects.length > 0 ? (
              memory.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass-card text-xs text-foreground group"
                >
                  <span className="font-mono">{proj}</span>
                  <button
                    onClick={() => handleRemoveMemory("projects", proj)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">No active project memories stored.</div>
            )}
          </div>
        </GlassCard>

        {/* System & Coding Preferences */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-foreground">Preferences ({memory?.preferences?.length || 0})</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveCategory("preferences");
                setIsAdding(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {memory?.preferences && memory.preferences.length > 0 ? (
              memory.preferences.map((pref, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass-card text-xs text-foreground group"
                >
                  <span>{pref}</span>
                  <button
                    onClick={() => handleRemoveMemory("preferences", pref)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">No user preferences defined.</div>
            )}
          </div>
        </GlassCard>

        {/* Long-term Strategic Goals */}
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-bold text-foreground">Strategic Goals ({memory?.goals?.length || 0})</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveCategory("goals");
                setIsAdding(true);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {memory?.goals && memory.goals.length > 0 ? (
              memory.goals.map((goal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-2xl liquid-glass-card text-xs text-foreground group"
                >
                  <span>{goal}</span>
                  <button
                    onClick={() => handleRemoveMemory("goals", goal)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">No long-term goals registered.</div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
