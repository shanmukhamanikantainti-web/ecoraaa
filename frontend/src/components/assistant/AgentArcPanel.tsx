"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Code2,
  Search,
  TrendingUp,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  RotateCw,
  CheckCircle2,
  GripVertical,
  Brain,
  BarChart3,
} from "lucide-react";

export interface AgentOption {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// Canonical agent IDs: GENERAL, CODING, RESEARCH, TESTING, REVIEW, MARKETING
export const AGENTS: AgentOption[] = [
  {
    id: "GENERAL",
    name: "General Agent",
    subtitle: "Broad-purpose assistance, intent understanding",
    badge: "General",
    icon: Brain,
    color: "from-purple-600 to-violet-500",
  },
  {
    id: "CODING",
    name: "Coding Agent",
    subtitle: "Write, debug, build, refactor code",
    badge: "Code",
    icon: Code2,
    color: "from-blue-600 to-indigo-500",
  },
  {
    id: "RESEARCH",
    name: "Research Agent",
    subtitle: "Web search, source collection, analysis",
    badge: "Research",
    icon: Search,
    color: "from-cyan-600 to-teal-400",
  },
  {
    id: "TESTING",
    name: "Testing Agent",
    subtitle: "Run tests, analyze failures, validate",
    badge: "Testing",
    icon: BarChart3,
    color: "from-green-600 to-emerald-500",
  },
  {
    id: "REVIEW",
    name: "Review Agent",
    subtitle: "Code review, security, quality audit",
    badge: "Review",
    icon: ShieldCheck,
    color: "from-emerald-600 to-teal-500",
  },
  {
    id: "MARKETING",
    name: "Marketing Agent",
    subtitle: "Docs, release notes, project content",
    badge: "Marketing",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-500",
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
const ANGLE_STEP = 60; // Degrees between each of the 6 agents

// Continuous cyclic angular difference wrapping helper
const wrapDiff = (diff: number, n: number) => {
  return (((diff % n) + n * 1.5) % n) - n / 2;
};

export const AgentArcPanel: React.FC<AgentArcPanelProps> = ({
  activeAgentId = "coding",
  onSelectAgent,
  className = "",
}) => {
  const initialIndex = Math.max(
    0,
    AGENTS.findIndex((a) => a.id === activeAgentId)
  );

  // Continuous wheelAngle in degrees for 60fps/120fps direct-manipulation dragging
  const [wheelAngle, setWheelAngle] = useState(initialIndex * ANGLE_STEP);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDeltaY, setDragDeltaY] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelAngleRef = useRef(initialIndex * ANGLE_STEP);
  const isDraggingRef = useRef(false);
  const dragStartY = useRef(0);
  const startWheelAngle = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastScrollTime = useRef(0);
  const prevPropAgentId = useRef(activeAgentId);

  // Keep wheelAngleRef in sync with wheelAngle
  wheelAngleRef.current = wheelAngle;

  // Normalize current slot index to [0, AGENTS.length - 1]
  const currentSlot = Math.round(wheelAngle / ANGLE_STEP);
  const normalizedIndex =
    ((currentSlot % AGENTS.length) + AGENTS.length) % AGENTS.length;

  // Snap to target slot with smooth transition
  const snapToSlot = useCallback(
    (slot: number) => {
      const targetAngle = slot * ANGLE_STEP;
      const targetNormalized =
        ((slot % AGENTS.length) + AGENTS.length) % AGENTS.length;
      console.log("[AgentArcPanel] snapToSlot:", { slot, targetAngle, targetNormalized, selectedId: AGENTS[targetNormalized].id });
      setWheelAngle(targetAngle);
      wheelAngleRef.current = targetAngle;
      const selectedId = AGENTS[targetNormalized].id;
      prevPropAgentId.current = selectedId;
      onSelectAgent?.(selectedId);
    },
    [onSelectAgent]
  );

  // Synchronize ONLY when external activeAgentId prop actually changes from parent
  useEffect(() => {
    if (!activeAgentId) return;
    if (activeAgentId !== prevPropAgentId.current) {
      prevPropAgentId.current = activeAgentId;
      // Never interrupt an active user drag
      if (isDraggingRef.current) return;

      const targetIdx = AGENTS.findIndex((a) => a.id === activeAgentId);
      if (targetIdx >= 0) {
        // Find slot closest to current wheelAngle matching targetIdx
        const curSlot = Math.round(wheelAngleRef.current / ANGLE_STEP);
        const curNorm =
          ((curSlot % AGENTS.length) + AGENTS.length) % AGENTS.length;
        let diff = targetIdx - curNorm;
        if (diff > AGENTS.length / 2) diff -= AGENTS.length;
        if (diff < -AGENTS.length / 2) diff += AGENTS.length;

        const targetSlot = curSlot + diff;
        const targetAngle = targetSlot * ANGLE_STEP;
        setWheelAngle(targetAngle);
        wheelAngleRef.current = targetAngle;
      }
    }
  }, [activeAgentId]);

  const stepNext = useCallback(() => {
    const curSlot = Math.round(wheelAngleRef.current / ANGLE_STEP);
    snapToSlot(curSlot + 1);
  }, [snapToSlot]);

  const stepPrev = useCallback(() => {
    const curSlot = Math.round(wheelAngleRef.current / ANGLE_STEP);
    snapToSlot(curSlot - 1);
  }, [snapToSlot]);

  // ── Smooth Continuous Wheel & Trackpad Scroll Event Handling ──
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use a ref to always have the latest snapToSlot without re-registering the native listener
  const snapToSlotRef = useRef(snapToSlot);
  snapToSlotRef.current = snapToSlot;

  // ── Native Non-Passive Wheel Event Listener (ONLY handler — no React onWheel) ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const deltaY = e.deltaY;
      if (Math.abs(deltaY) < 1) return;

      const now = Date.now();
      const isNotchedWheel = Math.abs(deltaY) >= 40;

      if (isNotchedWheel) {
        // Standard notched mouse wheel: 1 click = 1 agent step
        if (now - lastScrollTime.current < 160) return;
        lastScrollTime.current = now;

        const curSlot = Math.round(wheelAngleRef.current / ANGLE_STEP);
        if (deltaY > 0) {
          snapToSlotRef.current(curSlot + 1);
        } else {
          snapToSlotRef.current(curSlot - 1);
        }
      } else {
        // Continuous smooth rotation for trackpads
        setIsDragging(true);
        isDraggingRef.current = true;

        const sensitivity = 0.4;
        const newAngle = wheelAngleRef.current + deltaY * sensitivity;
        wheelAngleRef.current = newAngle;
        setWheelAngle(newAngle);

        if (snapTimeoutRef.current) {
          clearTimeout(snapTimeoutRef.current);
        }
        snapTimeoutRef.current = setTimeout(() => {
          setIsDragging(false);
          isDraggingRef.current = false;
          const nearestSlot = Math.round(wheelAngleRef.current / ANGLE_STEP);
          snapToSlotRef.current(nearestSlot);
        }, 130);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, []); // stable — uses refs internally

  // ── Mouse & Touch Direct Manipulation Dragging ──
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to main left-click or touch/pen
    if (e.button !== 0) return;
    // Don't drag if user clicked directly on a button
    if ((e.target as HTMLElement).closest("button")) return;

    e.preventDefault();
    e.stopPropagation();

    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartY.current = e.clientY;
    startWheelAngle.current = wheelAngleRef.current;
    hasDraggedRef.current = false;
    setDragDeltaY(0);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingRef.current) return;
      moveEvent.preventDefault();

      const deltaY = moveEvent.clientY - dragStartY.current;
      if (Math.abs(deltaY) > 3) {
        hasDraggedRef.current = true;
      }

      // Dragging DOWN moves items above down into the apex
      // Sensitivity: 1px drag = 0.45 degrees of wheel rotation
      const sensitivity = 0.45;
      const newAngle = startWheelAngle.current + deltaY * sensitivity;

      wheelAngleRef.current = newAngle;
      setWheelAngle(newAngle);
      setDragDeltaY(deltaY);
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);

      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      setDragDeltaY(0);

      if (hasDraggedRef.current) {
        // Snap to nearest agent slot smoothly
        const nearestSlot = Math.round(wheelAngleRef.current / ANGLE_STEP);
        snapToSlot(nearestSlot);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  const activeAgent = AGENTS[normalizedIndex];
  const ActiveIcon = activeAgent.icon;

  // Concentric wheel perimeter tick marks
  const numTicks = AGENTS.length; // Now 6 agents
  const tickAngles = Array.from(
    { length: numTicks },
    (_, i) => -60 + i * (120 / (numTicks - 1))
  );

  // Active card position: tracks wheel rotation continuously along the circular arc!
  const activeDiffSlots = wrapDiff(
    normalizedIndex - wheelAngle / ANGLE_STEP,
    AGENTS.length
  );
  const activeDiffDeg = activeDiffSlots * ANGLE_STEP;
  const cardAngleDeg = 180 + activeDiffDeg;
  const cardRad = (cardAngleDeg * Math.PI) / 180;
  const cardY = CENTER_Y + WHEEL_RADIUS * Math.sin(cardRad);
  const cardX = Math.max(0, CENTER_X + WHEEL_RADIUS * Math.cos(cardRad) - 105);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onDragStart={(e) => e.preventDefault()}
      style={{ touchAction: "none" }}
      className={`relative select-none flex flex-col justify-center items-end w-[265px] xl:w-[280px] h-[430px] overflow-visible cursor-grab active:cursor-grabbing ${className}`}
      title="Drag up or down, scroll mouse wheel, or click to rotate agents"
    >
      {/* ── Header: Title, Counter & Steppers ── */}
      <div className="absolute top-1 right-2 z-30 flex items-center justify-between w-[245px] px-2.5 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-blue-500/25 shadow-sm select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[11px] font-bold text-foreground tracking-tight">
            AI Agents
          </span>
          <span className="text-[9px] font-mono text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold">
            0{normalizedIndex + 1}/0{AGENTS.length}
          </span>
        </div>

        {/* Up / Down Micro Steppers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              stepPrev();
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
              stepNext();
            }}
            className="p-1 rounded-md bg-blue-500/10 hover:bg-blue-500/25 text-blue-600 dark:text-blue-400 transition-all active:scale-90 cursor-pointer"
            title="Next Agent (Rotate Down)"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── SVG Dual-Arc Half Wheel Track ── */}
      {/* The concentric track physically rotates as you drag the wheel! */}
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

          {/* 4. Ticks along the Wheel Rim - rotates in real time with drag! */}
          <g
            style={{
              transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
              transform: `rotate(${-wheelAngle}deg)`,
              transition: isDragging
                ? "none"
                : "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
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

      {/* ── Orbiting Agent Nodes on the Arc Track ── */}
      {/* Each node glides smoothly along the arc continuously from wheelAngle */}
      <div className="absolute inset-0 pointer-events-none">
        {AGENTS.map((agent, index) => {
          // Calculate angular position on the circle relative to current wheelAngle using cyclic wrap
          const diffSlots = wrapDiff(index - wheelAngle / ANGLE_STEP, AGENTS.length);
          const diffDeg = diffSlots * ANGLE_STEP;

          // If close to apex, the active card displays this agent
          if (Math.abs(diffDeg) < 16) return null;

          // Only show nodes along the visible half-wheel arc
          if (Math.abs(diffDeg) > 55) return null;

          const angleDeg = 180 + diffDeg;
          const rad = (angleDeg * Math.PI) / 180;

          const x = CENTER_X + WHEEL_RADIUS * Math.cos(rad);
          const y = CENTER_Y + WHEEL_RADIUS * Math.sin(rad);

          const NodeIcon = agent.icon;

          return (
            <div
              key={agent.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                snapToSlot(index);
              }}
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                transition: isDragging
                  ? "none"
                  : "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="absolute z-20 group/node cursor-pointer pointer-events-auto hover:scale-120 active:scale-95"
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
      <div
        style={{
          top: `${cardY}px`,
          left: `${cardX}px`,
          transform: "translateY(-50%)",
          transition: isDragging
            ? "none"
            : "all 350ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="absolute z-20 w-[204px] pointer-events-auto"
      >
        <div
          onClick={(e) => {
            // Advance to next agent on simple click without drag
            if (!hasDraggedRef.current) {
              e.preventDefault();
              e.stopPropagation();
              stepNext();
            }
          }}
          className="relative liquid-glass rounded-xl p-2.5 cursor-grab active:cursor-grabbing border-2 border-blue-500 dark:border-blue-400 shadow-[0_0_22px_rgba(37,99,235,0.35)] ring-1 ring-blue-400/30 active:scale-98 transition-transform select-none"
          title="Drag up or down to roll the wheel, or click to advance"
        >
          {/* Active Left Pip */}
          <div className="absolute -left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-gradient-to-b from-blue-500 to-sky-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />

          {/* Drag Handle Gripper Bar on far right */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground/50 flex flex-col items-center">
            <GripVertical className="w-3.5 h-3.5 text-blue-400/70" />
          </div>

          {/* Mini Header: Active Tag & Apex indicator */}
          <div className="flex items-center justify-between mb-1.5 pl-0.5 pr-3">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold uppercase tracking-wider bg-blue-500 text-white shadow-xs">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              Active
            </span>

            <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">
              {activeAgent.badge}
            </span>
          </div>

          {/* Agent Icon + Title */}
          <div className="flex items-center gap-2.5 pr-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr ${activeAgent.color} text-white shadow-sm shadow-blue-500/35 shrink-0`}
            >
              <ActiveIcon className="w-4 h-4" />
            </div>

            <div className="space-y-0.5 min-w-0 flex-1 overflow-visible">
              <h4 className="text-[12px] font-extrabold text-foreground tracking-tight whitespace-nowrap flex items-center gap-1">
                <span>{activeAgent.name}</span>
                <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />
              </h4>
              <p className="text-[9.5px] text-muted-foreground whitespace-nowrap leading-tight">
                {activeAgent.subtitle}
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
          stepNext();
        }}
        className="absolute bottom-1 right-2 z-30 flex items-center gap-1 text-[9.5px] text-muted-foreground/85 hover:text-blue-600 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-border/50 hover:border-blue-400/40 transition-all cursor-pointer select-none"
        title="Click or drag to rotate wheel"
      >
        <RotateCw className="w-2.5 h-2.5 text-blue-500 animate-spin" style={{ animationDuration: "10s" }} />
        <span>Scroll or drag to rotate</span>
      </button>
    </div>
  );
};
