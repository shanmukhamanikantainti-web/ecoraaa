"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Sparkles,
  Code2,
  Search,
  Feather,
  BarChart3,
  Terminal,
  ChevronUp,
  ChevronDown,
  RotateCw,
  CheckCircle2,
} from "lucide-react";

export interface AgentOption {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const AGENTS: AgentOption[] = [
  {
    id: "general",
    name: "General Agent",
    subtitle: "Chat & assist",
    badge: "General",
    icon: Sparkles,
    color: "from-blue-600 to-sky-400",
  },
  {
    id: "coding",
    name: "Coding Agent",
    subtitle: "Write & debug",
    badge: "Code",
    icon: Code2,
    color: "from-indigo-600 to-blue-500",
  },
  {
    id: "research",
    name: "Research Agent",
    subtitle: "Search & summarize",
    badge: "Research",
    icon: Search,
    color: "from-cyan-600 to-teal-400",
  },
  {
    id: "creative",
    name: "Creative Agent",
    subtitle: "Design & write",
    badge: "Studio",
    icon: Feather,
    color: "from-violet-600 to-purple-400",
  },
  {
    id: "analyst",
    name: "Data Analyst",
    subtitle: "Data & metrics",
    badge: "Data",
    icon: BarChart3,
    color: "from-amber-600 to-orange-400",
  },
  {
    id: "system",
    name: "System Agent",
    subtitle: "Terminal & ops",
    badge: "DevOps",
    icon: Terminal,
    color: "from-emerald-600 to-teal-400",
  },
];

interface AgentArcPanelProps {
  activeAgentId?: string;
  onSelectAgent?: (id: string) => void;
  className?: string;
}

// Compact Wheel geometry scaled to fit precisely inside the user's red box boundary
const WHEEL_RADIUS = 135; // Track radius
const WHEEL_OUTER_RADIUS = 148; // Outer concentric rail
const WHEEL_INNER_RADIUS = 122; // Inner concentric rail
const CENTER_X = 230; // Center anchored near right edge
const CENTER_Y = 210; // Vertical center of wheel
const ANGLE_STEP = 38; // Degrees between each agent

export const AgentArcPanel: React.FC<AgentArcPanelProps> = ({
  activeAgentId = "general",
  onSelectAgent,
  className = "",
}) => {
  const initialIndex = AGENTS.findIndex((a) => a.id === activeAgentId);
  const [selectedIndex, setSelectedIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const [wheelAngle, setWheelAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef(0);
  const dragStartY = useRef(0);
  const startAngle = useRef(0);

  useEffect(() => {
    const idx = AGENTS.findIndex((a) => a.id === activeAgentId);
    if (idx >= 0 && idx !== selectedIndex) {
      setSelectedIndex(idx);
      setWheelAngle(idx * ANGLE_STEP);
    }
  }, [activeAgentId, selectedIndex]);

  const rotateToAgent = useCallback(
    (targetIndex: number) => {
      const normalized = (targetIndex + AGENTS.length) % AGENTS.length;
      setSelectedIndex(normalized);
      setWheelAngle(targetIndex * ANGLE_STEP);
      setIsRotating(true);
      setTimeout(() => setIsRotating(false), 350);
      onSelectAgent?.(AGENTS[normalized].id);
    },
    [onSelectAgent]
  );

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 160) return;
    lastWheelTime.current = now;

    if (e.deltaY > 10) {
      rotateToAgent(selectedIndex + 1);
    } else if (e.deltaY < -10) {
      rotateToAgent(selectedIndex - 1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    startAngle.current = wheelAngle;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;
    const angleDelta = (deltaY / 220) * 70;
    const currentVirtualAngle = startAngle.current - angleDelta;
    setWheelAngle(currentVirtualAngle);

    const computedIndex = Math.round(currentVirtualAngle / ANGLE_STEP);
    const normalized =
      ((computedIndex % AGENTS.length) + AGENTS.length) % AGENTS.length;
    if (normalized !== selectedIndex) {
      setSelectedIndex(normalized);
      onSelectAgent?.(AGENTS[normalized].id);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    const closestIndex = Math.round(wheelAngle / ANGLE_STEP);
    rotateToAgent(closestIndex);
  };

  const currentAgent = AGENTS[selectedIndex];
  const CurrentIcon = currentAgent.icon;

  // Tick marks along the compact arc
  const numTicks = 26;
  const tickAngles = Array.from(
    { length: numTicks },
    (_, i) => -75 + i * (150 / (numTicks - 1))
  );

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative select-none flex flex-col justify-center items-end w-[250px] xl:w-[265px] h-[430px] overflow-visible cursor-grab active:cursor-grabbing ${className}`}
      title="Scroll mouse wheel or drag to rotate agents"
    >
      {/* ── Compact Header: Title & Step Steppers ── */}
      <div className="absolute top-1 right-2 z-30 flex items-center justify-between w-[240px] px-2.5 py-1 rounded-xl bg-white/75 dark:bg-slate-900/75 backdrop-blur-md border border-blue-500/20 shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-bold text-foreground tracking-tight">
            AI Agents
          </span>
          <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1 py-0.2 rounded font-semibold">
            0{selectedIndex + 1}/0{AGENTS.length}
          </span>
        </div>

        {/* Up/Down Micro Steppers */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateToAgent(selectedIndex - 1);
            }}
            className="p-0.5 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-600 transition-colors"
            title="Rotate Up"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateToAgent(selectedIndex + 1);
            }}
            className="p-0.5 rounded hover:bg-blue-500/10 text-muted-foreground hover:text-blue-600 transition-colors"
            title="Rotate Down"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── SVG Dual-Arc Half Wheel Track ── */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <svg
          viewBox="0 0 260 430"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cOuterRail" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="cInnerRail" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#60A5FA" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="65%" stopColor="#60A5FA" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
            </linearGradient>

            <filter id="cGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Ambient Glow behind track */}
          <path
            d={`M ${CENTER_X + WHEEL_RADIUS * Math.cos((-72 * Math.PI) / 180)},${
              CENTER_Y + WHEEL_RADIUS * Math.sin((-72 * Math.PI) / 180)
            } A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 0 ${
              CENTER_X + WHEEL_RADIUS * Math.cos((72 * Math.PI) / 180)
            },${CENTER_Y + WHEEL_RADIUS * Math.sin((72 * Math.PI) / 180)}`}
            stroke="url(#cOuterRail)"
            strokeWidth="20"
            strokeLinecap="round"
            filter="url(#cGlow)"
            opacity="0.22"
          />

          {/* 2. Outer Concentric Arc */}
          <path
            d={`M ${CENTER_X + WHEEL_OUTER_RADIUS * Math.cos((-74 * Math.PI) / 180)},${
              CENTER_Y + WHEEL_OUTER_RADIUS * Math.sin((-74 * Math.PI) / 180)
            } A ${WHEEL_OUTER_RADIUS} ${WHEEL_OUTER_RADIUS} 0 0 0 ${
              CENTER_X + WHEEL_OUTER_RADIUS * Math.cos((74 * Math.PI) / 180)
            },${CENTER_Y + WHEEL_OUTER_RADIUS * Math.sin((74 * Math.PI) / 180)}`}
            stroke="url(#cOuterRail)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* 3. Inner Concentric Arc */}
          <path
            d={`M ${CENTER_X + WHEEL_INNER_RADIUS * Math.cos((-74 * Math.PI) / 180)},${
              CENTER_Y + WHEEL_INNER_RADIUS * Math.sin((-74 * Math.PI) / 180)
            } A ${WHEEL_INNER_RADIUS} ${WHEEL_INNER_RADIUS} 0 0 0 ${
              CENTER_X + WHEEL_INNER_RADIUS * Math.cos((74 * Math.PI) / 180)
            },${CENTER_Y + WHEEL_INNER_RADIUS * Math.sin((74 * Math.PI) / 180)}`}
            stroke="url(#cInnerRail)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* 4. Ticks along the compact track */}
          {tickAngles.map((angleDeg, i) => {
            const dynamicAngleDeg = 180 + angleDeg + (wheelAngle % 360);
            const normalizedDeg = ((dynamicAngleDeg % 360) + 360) % 360;
            if (normalizedDeg < 105 || normalizedDeg > 255) return null;

            const rad = (dynamicAngleDeg * Math.PI) / 180;
            const x1 = CENTER_X + (WHEEL_INNER_RADIUS + 2) * Math.cos(rad);
            const y1 = CENTER_Y + (WHEEL_INNER_RADIUS + 2) * Math.sin(rad);
            const x2 = CENTER_X + (WHEEL_OUTER_RADIUS - 2) * Math.cos(rad);
            const y2 = CENTER_Y + (WHEEL_OUTER_RADIUS - 2) * Math.sin(rad);

            const isApex = Math.abs(normalizedDeg - 180) < 5;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isApex ? "#2563EB" : "#93C5FD"}
                strokeWidth={isApex ? 2 : 1}
                strokeOpacity={isApex ? 0.95 : 0.4}
              />
            );
          })}
        </svg>
      </div>

      {/* ── Orbiting Inactive Agent Nodes on the Rim ── */}
      <div className="absolute inset-0 pointer-events-auto">
        {AGENTS.map((agent, index) => {
          const stepDiff = index - selectedIndex;
          let delta = stepDiff;
          if (delta > AGENTS.length / 2) delta -= AGENTS.length;
          if (delta < -AGENTS.length / 2) delta += AGENTS.length;

          const angleDeg = 180 + delta * ANGLE_STEP;
          const rad = (angleDeg * Math.PI) / 180;

          const x = CENTER_X + WHEEL_RADIUS * Math.cos(rad);
          const y = CENTER_Y + WHEEL_RADIUS * Math.sin(rad);

          if (angleDeg < 100 || angleDeg > 260) return null;

          const isActive = index === selectedIndex;
          const NodeIcon = agent.icon;

          // Active agent is displayed inside the apex card
          if (isActive) return null;

          return (
            <div
              key={agent.id}
              onClick={(e) => {
                e.stopPropagation();
                rotateToAgent(index);
              }}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%)`,
              }}
              className="absolute z-20 group/node cursor-pointer transition-transform duration-200 hover:scale-115"
            >
              <div className="relative flex items-center">
                <div className="w-7 h-7 rounded-full liquid-glass bg-white/90 dark:bg-slate-900/90 border border-blue-400/40 shadow-xs flex items-center justify-center text-muted-foreground group-hover/node:text-blue-600 group-hover/node:border-blue-500 transition-colors">
                  <NodeIcon className="w-3.5 h-3.5" />
                </div>

                {/* Floating mini tooltip */}
                <div className="hidden group-hover/node:flex absolute right-8 whitespace-nowrap items-center gap-1 px-2 py-0.5 rounded-lg liquid-glass bg-white/95 dark:bg-slate-900/95 border border-blue-400/40 shadow-md text-[10px] font-semibold text-foreground">
                  <span>{agent.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Active Agent Card at the Apex (The Blue Box from Layout) ── */}
      {/* Sized compactly to match the user's red box boundary */}
      <div
        style={{
          top: `${CENTER_Y}px`,
          transform: `translateY(-50%)`,
        }}
        className="absolute left-1 z-20 w-[182px] transition-all duration-300"
      >
        <div
          className={`relative liquid-glass rounded-xl p-2.5 cursor-pointer transition-all duration-300 ${
            isRotating
              ? "scale-[1.02] border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              : "border-2 border-blue-500 dark:border-blue-400 shadow-[0_0_18px_rgba(37,99,235,0.28)] ring-1 ring-blue-400/30"
          }`}
        >
          {/* Active Left Pip */}
          <div className="absolute -left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-sky-400 shadow-[0_0_8px_rgba(59,130,246,0.7)]" />

          {/* Mini Header: Tag & Apex indicator */}
          <div className="flex items-center justify-between mb-1.5 pl-0.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-blue-500 text-white shadow-xs">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              Active
            </span>

            <span className="text-[9px] font-semibold text-blue-600 dark:text-blue-400">
              {currentAgent.badge}
            </span>
          </div>

          {/* Agent Icon + Title */}
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr ${currentAgent.color} text-white shadow-sm shadow-blue-500/30 shrink-0`}
            >
              <CurrentIcon className="w-4 h-4" />
            </div>

            <div className="space-y-0.5 overflow-hidden">
              <h4 className="text-[11.5px] font-extrabold text-foreground tracking-tight truncate flex items-center gap-1">
                {currentAgent.name}
                <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
              </h4>
              <p className="text-[9.5px] text-muted-foreground truncate leading-tight">
                {currentAgent.subtitle}
              </p>
            </div>
          </div>

          {/* Wheel Docking Connector on right rim */}
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 shadow-xs flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white animate-ping" />
          </div>
        </div>
      </div>

      {/* ── Compact Bottom Hint ── */}
      <div className="absolute bottom-1 right-2 z-30 flex items-center gap-1 text-[9.5px] text-muted-foreground/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-border/50">
        <RotateCw className="w-2.5 h-2.5 text-blue-500 animate-spin" style={{ animationDuration: "12s" }} />
        <span>Scroll or drag wheel</span>
      </div>
    </div>
  );
};
