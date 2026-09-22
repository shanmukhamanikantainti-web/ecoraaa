"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import {
  Search,
  Terminal,
  Activity,
  Brain,
  FolderTree,
  Smartphone,
  ShieldCheck,
  Settings,
  Play,
  X,
  ArrowRight,
} from "lucide-react";

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, closeCommandPalette, executeGoal } = useApp();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: "run-goal",
      label: query ? `Execute Goal: "${query}"` : "Execute an Autonomous Goal...",
      icon: Play,
      category: "Autonomous AI",
      onSelect: () => {
        if (query) {
          executeGoal(query);
          router.push("/");
          closeCommandPalette();
        }
      },
    },
    {
      id: "nav-main",
      label: "Command Center & Assistant",
      icon: Activity,
      category: "Navigation",
      onSelect: () => {
        router.push("/");
        closeCommandPalette();
      },
    },
    {
      id: "nav-tasks",
      label: "Tasks & Agent Missions",
      icon: Play,
      category: "Navigation",
      onSelect: () => {
        router.push("/tasks");
        closeCommandPalette();
      },
    },
    {
      id: "nav-memory",
      label: "Memory & Knowledge Graph",
      icon: Brain,
      category: "Navigation",
      onSelect: () => {
        router.push("/memory");
        closeCommandPalette();
      },
    },
    {
      id: "nav-console",
      label: "Interactive Shell Console",
      icon: Terminal,
      category: "Navigation",
      onSelect: () => {
        router.push("/console");
        closeCommandPalette();
      },
    },
    {
      id: "nav-files",
      label: "Workspace & File Explorer",
      icon: FolderTree,
      category: "Navigation",
      onSelect: () => {
        router.push("/files");
        closeCommandPalette();
      },
    },
    {
      id: "nav-cases",
      label: "Test Cases & Storage Health",
      icon: ShieldCheck,
      category: "Navigation",
      onSelect: () => {
        router.push("/cases");
        closeCommandPalette();
      },
    },
    {
      id: "nav-device",
      label: "Android Device Mirror & Pairing",
      icon: Smartphone,
      category: "Navigation",
      onSelect: () => {
        router.push("/device");
        closeCommandPalette();
      },
    },
    {
      id: "nav-settings",
      label: "Settings & AI Models",
      icon: Settings,
      category: "Navigation",
      onSelect: () => {
        router.push("/settings");
        closeCommandPalette();
      },
    },
  ];

  const filteredActions = actions.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredActions[selectedIndex]) {
        filteredActions[selectedIndex].onSelect();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={closeCommandPalette}
    >
      <div
        className="w-full max-w-2xl bg-surface-elevated border border-border/80 rounded-xl shadow-2xl overflow-hidden glass-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-border/70 gap-3">
          <Search className="w-5 h-5 text-primary" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-base"
            placeholder="Type a command, goal, or search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={closeCommandPalette}
            className="p-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-surface"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/20">
          {filteredActions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No matching commands. Press Enter to execute as autonomous goal.
            </div>
          ) : (
            filteredActions.map((action, idx) => {
              const Icon = action.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={action.id}
                  onClick={action.onSelect}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-foreground hover:bg-surface/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm">{action.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-surface text-muted-foreground border border-border/40">
                      {action.category}
                    </span>
                    {isSelected && <ArrowRight className="w-3.5 h-3.5 text-primary" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-surface/50 border-t border-border/50 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>ECORAA Spotlight</span>
        </div>
      </div>
    </div>
  );
};
