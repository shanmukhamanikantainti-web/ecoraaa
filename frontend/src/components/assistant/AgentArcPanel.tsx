"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Code2,
  Search,
  Feather,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  RotateCw,
} from "lucide-react";

export interface AgentOption {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  color: string;
}

interface AgentArcPanelProps {
  activeAgentId?: string;
  onSelectAgent?: (id: string) => void;
  className?: string;
}

const AGENTS: AgentOption[] = [
  {
    id: "general",
    name: "General Agent",
    subtitle: "Chat, help, answer",
    icon: Sparkles,
    color: "from-blue-600 to-sky-400",
  },
  {
    id: "coding",
    name: "Coding Agent",
    subtitle: "Write, debug, build",
    icon: Code2,
    color: "from-indigo-600 to-blue-500",
  },
  {
    id: "research",
    name: "Research Agent",
    subtitle: "Find, analyze, summarize",
    icon: Search,
    color: "from-cyan-600 to-teal-400",
  },
  {
    id: "creative",
    name: "Creative Agent",
    subtitle: "Design, write, brainstorm",
    icon: Feather,
    color: "from-violet-600 to-purple-400",
  },
];

export const AgentArcPanel: React.FC<AgentArcPanelProps> = ({
  activeAgentId = "general",
  onSelectAgent,
  className = "",
}) => {
  const initialIndex = AGENTS.findIndex((a) => a.id === activeAgentId);
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const [rotationAngle, setRotationAngle] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef(0);

  useEffect(() => {
    const idx = AGENTS.findIndex((a) => a.id === activeAgentId);
    if (idx >= 0 && idx !== selectedIndex) {
      setSelectedIndex(idx);
    }
  }, [activeAgentId, selectedIndex]);

  const selectAgentByIndex = useCallback(
    (newIndex: number) => {
      const normalized = (newIndex + AGENTS.length) % AGENTS.length;
      setSelectedIndex(normalized);
      setRotationAngle((prev) => prev + (newIndex - selectedIndex) * 18);
      onSelectAgent?.(AGENTS[normalized].id);
    },
    [selectedIndex, onSelectAgent]
  );

  // Mouse wheel listener to spin the half wheel
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    // Throttle wheel events so a gentle flick advances by one step smoothly
    if (now - lastWheelTime.current < 200) return;
    lastWheelTime.current = now;

    if (e.deltaY > 15) {
      // Scroll down -> next agent
      selectAgentByIndex(selectedIndex + 1);
    } else if (e.deltaY < -15) {
      // Scroll up -> previous agent
      selectAgentByIndex(selectedIndex - 1);
    }
  };

  const currentAgent = AGENTS[selectedIndex];

  return (
    <div
      ref={panelRef}
      onWheel={handleWheel}
      className={`relative select-none flex flex-col justify-center py-2 ${className}`}
      title="Scroll mouse wheel or click to rotate agents"
    >
      {/* ── Background Half-Wheel Orbital Arc SVG ── */}
      <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-[340px] h-[520px] pointer-events-none overflow-visible">
        <svg
          viewBox="0 0 340 520"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wheelTrackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.08" />
              <stop offset="35%" stopColor="#3B82F6" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="glowDial" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
            </linearGradient>

            <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer soft ambient halo */}
          <path
            d="M 280,20 C 130,120 110,380 280,500"
            stroke="url(#wheelTrackGrad)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeOpacity="0.15"
            filter="url(#arcGlow)"
          />

          {/* Main sleek orbital track line */}
          <path
            d="M 280,30 C 140,130 120,370 280,490"
            stroke="url(#wheelTrackGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Subtle tick markers along the wheel */}
          {[60, 150, 260, 370, 460].map((y, idx) => (
            <circle
              key={idx}
              cx={idx === 2 ? 150 : idx === 1 || idx === 3 ? 175 : 240}
              cy={y}
              r="2.5"
              fill="#60A5FA"
              fillOpacity={idx === 2 ? "0.9" : "0.35"}
            />
          ))}

          {/* Active Wheel Position Glowing Diamond / Bead */}
          <g
            className="transition-transform duration-500 ease-out"
            style={{
              transform: `translateY(${
                (selectedIndex - 1.5) * 88
              }px)`,
            }}
          >
            <circle cx="150" cy="260" r="7" fill="#3B82F6" filter="url(#arcGlow)" />
            <circle cx="150" cy="260" r="3.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      {/* ── Main Container: Header + Half Wheel Cards ── */}
      <div className="relative z-10 w-full max-w-[310px] space-y-4 pl-6">
        {/* Header with Title and Up/Down Wheel Controls */}
        <div className="flex items-center justify-between pr-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-bold text-foreground tracking-tight">
                AI Agents
              </h3>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <RotateCw className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: "9s" }} />
                Wheel
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose an agent for your task
            </p>
          </div>

          {/* Quick wheel cycle arrows */}
          <div className="flex items-center gap-1 bg-surface-subtle/80 backdrop-blur-md rounded-xl p-0.5 border border-border/60">
            <button
              onClick={() => selectAgentByIndex(selectedIndex - 1)}
              className="p-1 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-all"
              title="Previous Agent (Wheel Up)"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => selectAgentByIndex(selectedIndex + 1)}
              className="p-1 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-all"
              title="Next Agent (Wheel Down)"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ── Half-Wheel Curved Stack of Agent Cards ── */}
        <div className="relative py-1 space-y-3">
          {AGENTS.map((agent, idx) => {
            const Icon = agent.icon;
            const isActive = selectedIndex === idx;

            // Compute curved arc offsets based on position relative to center
            // Items in the middle curve further to the left to follow the wheel perimeter
            const delta = idx - 1.5; // distance from middle
            const arcCurveOffset = Math.cos((delta / 2) * Math.PI * 0.45) * 18;
            const extraActiveShift = isActive ? -8 : 0;
            const totalTranslateX = -arcCurveOffset + extraActiveShift;

            return (
              <div
                key={agent.id}
                onClick={() => selectAgentByIndex(idx)}
                style={{
                  transform: `translateX(${totalTranslateX}px)`,
                }}
                className={`relative flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ease-out group ${
                  isActive
                    ? "liquid-glass bg-white/95 dark:bg-slate-900/95 border-blue-500/70 shadow-[0_12px_32px_-6px_rgba(37,99,235,0.28)] ring-1 ring-blue-400/40"
                    : "liquid-glass-card hover:bg-white/70 dark:hover:bg-slate-800/70 opacity-80 hover:opacity-100"
                }`}
              >
                {/* Active Left Indicator Pip */}
                {isActive && (
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-gradient-to-b from-blue-500 to-sky-400 shadow-sm shadow-blue-500/50" />
                )}

                <div className="flex items-center gap-3">
                  {/* Icon Circle */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-tr ${agent.color} text-white shadow-md shadow-blue-500/35 scale-105`
                        : "bg-surface-subtle/85 text-muted-foreground border border-border/80 group-hover:border-blue-400/50 group-hover:text-blue-600 group-hover:scale-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Text Details */}
                  <div className="space-y-0.5">
                    <h4
                      className={`text-xs font-bold leading-tight transition-colors ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-foreground group-hover:text-foreground-heading"
                      }`}
                    >
                      {agent.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {agent.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Arrow Chevron */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground/60 group-hover:text-muted-foreground group-hover:translate-x-0.5"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Wheel Interaction Helper Footer */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground/75 px-2 pt-1">
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active: <strong className="text-foreground font-semibold">{currentAgent.name}</strong>
          </span>
          <span className="italic">Scroll wheel to rotate</span>
        </div>
      </div>
    </div>
  );
};
