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
    subtitle: "Chat & assistant",
    badge: "General",
    icon: Sparkles,
    color: "from-blue-600 to-sky-400",
  },
  {
    id: "coding",
    name: "Coding Agent",
    subtitle: "Write, debug & build",
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
    subtitle: "Design & brainstorm",
    badge: "Studio",
    icon: Feather,
    color: "from-violet-600 to-purple-400",
  },
  {
    id: "analyst",
    name: "Data Analyst",
    subtitle: "Data & visual charts",
    badge: "Data",
    icon: BarChart3,
    color: "from-amber-600 to-orange-400",
  },
  {
    id: "system",
    name: "System Agent",
    subtitle: "Terminal & workflows",
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
const WHEEL_RADIUS = 135;
const WHEEL_OUTER_RADIUS = 150;
const WHEEL_INNER_RADIUS = 120;
const CENTER_X = 240;
const CENTER_Y = 215;
const ANGLE_STEP = 36; // Degrees between each agent along the circle

export const AgentArcPanel: React.FC<AgentArcPanelProps> = ({
  activeAgentId = "general",
  onSelectAgent,
  className = "",
}) => {
  // Single reliable source of truth for the active agent index
  const [internalAgentId, setInternalAgentId] = useState(activeAgentId);
  const [visualRotation, setVisualRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastScrollTime = useRef(0);
  const dragStartY = useRef(0);
  const isDragging = useRef(false);

  // Derive current active index directly from activeAgentId (or internal state)
  const currentId = activeAgentId || internalAgentId;
  const foundIndex = AGENTS.findIndex((a) => a.id === currentId);
  const currentIndex = foundIndex >= 0 ? foundIndex : 0;

  // Sync internal state if prop changes
  useEffect(() => {
    if (activeAgentId && activeAgentId !== internalAgentId) {
      setInternalAgentId(activeAgentId);
    }
  }, [activeAgentId, internalAgentId]);

  // Master step function that updates agent and spins the wheel
  const goToIndex = useCallback(
    (targetIndex: number) => {
      const total = AGENTS.length;
      const normalized = ((targetIndex % total) + total) % total;
      const nextAgent = AGENTS[normalized];

      // Step rotation by delta
      const direction = targetIndex >= currentIndex ? 1 : -1;
      setVisualRotation((prev) => prev + direction * ANGLE_STEP);

      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

      setInternalAgentId(nextAgent.id);
      onSelectAgent?.(nextAgent.id);
    },
    [currentIndex, onSelectAgent]
  );

  const handleNext = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [goToIndex, currentIndex]);

  const handlePrev = useCallback(() => {
    goToIndex(currentIndex - 1);
  }, [goToIndex, currentIndex]);

  // ── Native Non-Passive Wheel Event Listener ──
  // Listens on the container with passive: false so e.preventDefault() reliably halts page scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - lastScrollTime.current < 120) return;
      lastScrollTime.current = now;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 2) return;

      if (delta > 0) {
        // Scrolling down -> advance to next agent
        handleNext();
      } else {
        // Scrolling up -> advance to previous agent
        handlePrev();
      }
    };

    el.addEventListener("wheel", onWheelHandler, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheelHandler);
    };
  }, [handleNext, handlePrev]);

  // ── Mouse / Touch Drag Support ──
  // Does NOT call setPointerCapture so regular button clicks are never swallowed
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaY = e.clientY - dragStartY.current;

    // Trigger step when dragged past 22px
    if (deltaY > 22) {
      handleNext();
      dragStartY.current = e.clientY;
    } else if (deltaY < -22) {
      handlePrev();
      dragStartY.current = e.clientY;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const currentAgent = AGENTS[currentIndex];
  const CurrentIcon = currentAgent.icon;

  // Concentric wheel perimeter tick marks
  const numTicks = 24;
  const tickAngles = Array.from(
    { length: numTicks },
    (_, i) => -72 + i * (144 / (numTicks - 1))
  );

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: "none" }}
      className={`relative select-none flex flex-col justify-center items-end w-[265px] xl:w-[280px] h-[430px] overflow-visible cursor-ns-resize ${className}`}
      title="Scroll mouse wheel, drag, or click to switch agents"
    >
      {/* ── Header: Title, Counter & Rotary Steppers ── */}
      <div className="absolute top-1 right-2 z-30 flex items-center justify-between w-[245px] px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-blue-500/25 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-bold text-foreground tracking-tight">
            AI Agents
          </span>
          <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold">
            0{currentIndex + 1}/0{AGENTS.length}
          </span>
        </div>

        {/* Up / Down Micro Steppers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handlePrev();
            }}
            className="p-1 rounded-md bg-blue-500/10 hover:bg-blue-500/25 text-blue-600 dark:text-blue-400 transition-all active:scale-90 cursor-pointer"
            title="Previous Agent (Rotate Up)"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleNext();
            }}
            className="p-1 rounded-md bg-blue-500/10 hover:bg-blue-500/25 text-blue-600 dark:text-blue-400 transition-all active:scale-90 cursor-pointer"
            title="Next Agent (Rotate Down)"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── SVG Dual-Arc Half Wheel Track ── */}
      <div className="absolute inset-0 pointer-events-none overflow-visible">
        <svg
          viewBox="0 0 280 430"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cOuterRail" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#3B82F6" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#2563EB" stopOpacity="1" />
              <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="cInnerRail" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.1" />
              <stop offset="35%" stopColor="#60A5FA" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#60A5FA" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
            </linearGradient>

            <filter id="cGlow" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Ambient Glow Ribbon behind track */}
          <path
            d={`M ${CENTER_X + WHEEL_RADIUS * Math.cos((-72 * Math.PI) / 180)},${
              CENTER_Y + WHEEL_RADIUS * Math.sin((-72 * Math.PI) / 180)
            } A ${WHEEL_RADIUS} ${WHEEL_RADIUS} 0 0 0 ${
              CENTER_X + WHEEL_RADIUS * Math.cos((72 * Math.PI) / 180)
            },${CENTER_Y + WHEEL_RADIUS * Math.sin((72 * Math.PI) / 180)}`}
            stroke="url(#cOuterRail)"
            strokeWidth="22"
            strokeLinecap="round"
            filter="url(#cGlow)"
            opacity="0.25"
          />

          {/* 2. Outer Concentric Arc */}
          <path
            d={`M ${CENTER_X + WHEEL_OUTER_RADIUS * Math.cos((-74 * Math.PI) / 180)},${
              CENTER_Y + WHEEL_OUTER_RADIUS * Math.sin((-74 * Math.PI) / 180)
            } A ${WHEEL_OUTER_RADIUS} ${WHEEL_OUTER_RADIUS} 0 0 0 ${
              CENTER_X + WHEEL_OUTER_RADIUS * Math.cos((74 * Math.PI) / 180)
            },${CENTER_Y + WHEEL_OUTER_RADIUS * Math.sin((74 * Math.PI) / 180)}`}
            stroke="url(#cOuterRail)"
            strokeWidth="2.5"
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
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* 4. Physically Rotating Ticks along the Wheel Rim */}
          <g
            style={{
              transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
              transform: `rotate(${visualRotation}deg)`,
              transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {tickAngles.map((angleDeg, i) => {
              const rad = ((180 + angleDeg) * Math.PI) / 180;
              const x1 = CENTER_X + (WHEEL_INNER_RADIUS + 2) * Math.cos(rad);
              const y1 = CENTER_Y + (WHEEL_INNER_RADIUS + 2) * Math.sin(rad);
              const x2 = CENTER_X + (WHEEL_OUTER_RADIUS - 2) * Math.cos(rad);
              const y2 = CENTER_Y + (WHEEL_OUTER_RADIUS - 2) * Math.sin(rad);

              const isApex = Math.abs(angleDeg) < 4;

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isApex ? "#2563EB" : "#93C5FD"}
                  strokeWidth={isApex ? 2.5 : 1.2}
                  strokeOpacity={isApex ? 1 : 0.45}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* ── Orbiting Inactive Agent Nodes on the Rim ── */}
      <div className="absolute inset-0 pointer-events-none">
        {AGENTS.map((agent, index) => {
          const stepDiff = index - currentIndex;
          let delta = stepDiff;
          if (delta > AGENTS.length / 2) delta -= AGENTS.length;
          if (delta < -AGENTS.length / 2) delta += AGENTS.length;

          const angleDeg = 180 + delta * ANGLE_STEP;
          const rad = (angleDeg * Math.PI) / 180;

          const x = CENTER_X + WHEEL_RADIUS * Math.cos(rad);
          const y = CENTER_Y + WHEEL_RADIUS * Math.sin(rad);

          if (angleDeg < 95 || angleDeg > 265) return null;

          const isActive = index === currentIndex;
          const NodeIcon = agent.icon;

          if (isActive) return null;

          return (
            <div
              key={agent.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToIndex(index);
              }}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: `translate(-50%, -50%)`,
              }}
              className="absolute z-20 group/node cursor-pointer pointer-events-auto transition-transform duration-200 hover:scale-125 active:scale-95"
            >
              <div className="relative flex items-center">
                <div className="w-8 h-8 rounded-full liquid-glass bg-white/95 dark:bg-slate-900/95 border border-blue-400/50 shadow-sm flex items-center justify-center text-muted-foreground group-hover/node:text-blue-600 group-hover/node:border-blue-500 transition-colors">
                  <NodeIcon className="w-3.5 h-3.5" />
                </div>

                {/* Floating tooltip on hover */}
                <div className="hidden group-hover/node:flex absolute right-9 whitespace-nowrap items-center gap-1 px-2.5 py-0.5 rounded-lg liquid-glass bg-white/95 dark:bg-slate-900/95 border border-blue-400/50 shadow-md text-[10px] font-semibold text-foreground animate-in fade-in zoom-in-95 duration-100">
                  <span>{agent.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Active Agent Card at the Apex (The Blue Box from Layout) ── */}
      {/* Sized cleanly with full text visibility and click-to-cycle */}
      <div
        style={{
          top: `${CENTER_Y}px`,
          transform: `translateY(-50%)`,
        }}
        className="absolute left-0 z-20 w-[204px] transition-all duration-300 pointer-events-auto"
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleNext();
          }}
          className={`relative liquid-glass rounded-xl p-2.5 cursor-pointer transition-all duration-300 active:scale-98 ${
            isAnimating
              ? "scale-[1.02] border-blue-400 shadow-[0_0_22px_rgba(59,130,246,0.5)]"
              : "border-2 border-blue-500 dark:border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.32)] ring-1 ring-blue-400/30"
          }`}
          title="Click to switch to next agent"
        >
          {/* Active Left Pip */}
          <div className="absolute -left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-sky-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />

          {/* Mini Header: Tag & Apex indicator */}
          <div className="flex items-center justify-between mb-1.5 pl-0.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-blue-500 text-white shadow-xs">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              Active
            </span>

            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
              {currentAgent.badge}
            </span>
          </div>

          {/* Agent Icon + Title */}
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr ${currentAgent.color} text-white shadow-sm shadow-blue-500/35 shrink-0`}
            >
              <CurrentIcon className="w-4 h-4" />
            </div>

            <div className="space-y-0.5 min-w-0 flex-1 overflow-visible">
              <h4 className="text-[12px] font-extrabold text-foreground tracking-tight whitespace-nowrap flex items-center gap-1">
                <span>{currentAgent.name}</span>
                <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
              </h4>
              <p className="text-[9.5px] text-muted-foreground whitespace-nowrap leading-tight">
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

      {/* ── Compact Bottom Hint (Clickable to Rotate) ── */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleNext();
        }}
        className="absolute bottom-1 right-2 z-30 flex items-center gap-1 text-[9.5px] text-muted-foreground/85 hover:text-blue-600 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-border/50 hover:border-blue-400/40 transition-all cursor-pointer"
        title="Click or scroll wheel to rotate"
      >
        <RotateCw className="w-2.5 h-2.5 text-blue-500 animate-spin" style={{ animationDuration: "10s" }} />
        <span>Scroll or click to rotate</span>
      </button>
    </div>
  );
};
