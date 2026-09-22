"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import {
  ListTodo,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  RefreshCw,
  Layers,
  ChevronRight,
  Terminal,
  Globe,
  FileCode,
} from "lucide-react";

export default function TasksPage() {
  const { activeMissions, completedMissions, refreshState, executeGoal } = useApp();
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const allMissions = [...activeMissions, ...completedMissions];
  const displayedMissions =
    filter === "active"
      ? activeMissions
      : filter === "completed"
      ? completedMissions
      : allMissions;

  const selectedMission =
    allMissions.find((m) => m.id === selectedMissionId) || activeMissions[0] || completedMissions[0];

  const handleCancelTask = async (taskId: string) => {
    setCancellingId(taskId);
    try {
      await api.cancelTask(taskId);
      await refreshState();
    } catch (e) {
      console.error("Failed to cancel task:", e);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Tasks & Agent Missions</h1>
            <p className="text-xs text-muted-foreground">
              Monitor active multi-agent execution, step pipelines, and execution results
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex p-1 bg-surface-elevated border border-border/60 rounded-lg text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-md transition-all ${
                filter === "all"
                  ? "bg-primary text-white font-medium shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({allMissions.length})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded-md transition-all ${
                filter === "active"
                  ? "bg-primary text-white font-medium shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Active ({activeMissions.length})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-md transition-all ${
                filter === "completed"
                  ? "bg-primary text-white font-medium shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed ({completedMissions.length})
            </button>
          </div>

          <Button variant="ghost" size="icon" onClick={() => refreshState()} title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Grid: Mission List & Mission Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission Cards */}
        <div className="lg:col-span-5 space-y-3">
          {displayedMissions.length === 0 ? (
            <GlassCard className="p-8 text-center text-muted-foreground text-sm">
              No missions found in this category. Dispatch a goal from the Command Center!
            </GlassCard>
          ) : (
            displayedMissions.map((mission) => {
              const isSelected = selectedMission?.id === mission.id;
              const isRunning = mission.status === "EXECUTING" || mission.status === "PLANNING";

              return (
                <div
                  key={mission.id}
                  onClick={() => setSelectedMissionId(mission.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-surface-elevated border-primary shadow-glow"
                      : "bg-surface/60 border-border/60 hover:border-primary/40 hover:bg-surface-elevated/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {mission.id}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        mission.status === "COMPLETED"
                          ? "success"
                          : isRunning
                          ? "primary"
                          : mission.status === "CANCELLED"
                          ? "muted"
                          : "danger"
                      }
                      dot={isRunning}
                    >
                      {mission.status}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">
                    {mission.goal}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>{mission.steps?.length || 0} Steps</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(mission.created_at || Date.now()).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Mission Inspection & Step Execution */}
        <div className="lg:col-span-7">
          {selectedMission ? (
            <GlassCard className="p-6 space-y-6">
              {/* Mission Header */}
              <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs text-muted-foreground">
                      ID: {selectedMission.id}
                    </span>
                    <Badge
                      variant={
                        selectedMission.status === "COMPLETED"
                          ? "success"
                          : selectedMission.status === "EXECUTING"
                          ? "primary"
                          : "muted"
                      }
                    >
                      {selectedMission.status}
                    </Badge>
                  </div>
                  <h2 className="text-lg font-bold text-foreground leading-snug">
                    {selectedMission.goal}
                  </h2>
                </div>

                {selectedMission.status === "EXECUTING" && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleCancelTask(selectedMission.id)}
                    disabled={cancellingId === selectedMission.id}
                    className="gap-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </Button>
                )}
              </div>

              {/* Execution Result (if finished) */}
              {selectedMission.result && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mission Outcome</span>
                  </div>
                  <p className="text-xs text-foreground/90 font-mono leading-relaxed whitespace-pre-wrap">
                    {selectedMission.result}
                  </p>
                </div>
              )}

              {/* Steps Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground">
                  Step-by-Step Agent Pipeline
                </h3>

                {selectedMission.steps && selectedMission.steps.length > 0 ? (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                    {selectedMission.steps.map((step, idx) => (
                      <div key={idx} className="relative group">
                        {/* Step Node Marker */}
                        <div
                          className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-surface flex items-center justify-center text-[10px] font-mono font-bold ${
                            step.status === "COMPLETED"
                              ? "border-success text-success"
                              : step.status === "RUNNING"
                              ? "border-primary text-primary animate-pulse"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        {/* Step Details Box */}
                        <div className="p-3.5 rounded-lg bg-surface/60 border border-border/50 space-y-1.5 hover:border-primary/40 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-foreground">
                              {step.agent}
                            </span>
                            <Badge
                              size="sm"
                              variant={step.status === "COMPLETED" ? "success" : "primary"}
                            >
                              {step.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                          {step.result && (
                            <div className="mt-2 p-2.5 rounded bg-surface-elevated border border-border/40 font-mono text-[11px] text-foreground/90 overflow-x-auto">
                              {step.result}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground bg-surface/40 rounded-lg border border-border/40">
                    No steps generated yet for this mission.
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-12 text-center text-muted-foreground">
              Select a mission from the list to view its real-time agent execution pipeline.
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
