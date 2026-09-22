"use client";

import React, { useState } from "react";
import { Sparkles, Code2, Search, Feather, ChevronRight } from "lucide-react";

export interface AgentOption {
  id: string;
  name: string;
  subtitle: string;
  icon: any;
  activeColor: string;
}

interface AgentArcPanelProps {
  activeAgentId?: string;
  onSelectAgent?: (id: string) => void;
  className?: string;
}

export const AgentArcPanel: React.FC<AgentArcPanelProps> = ({
  activeAgentId = "general",
  onSelectAgent,
  className = "",
}) => {
  const [selected, setSelected] = useState(activeAgentId);

  const agents: AgentOption[] = [
    {
      id: "general",
      name: "General Agent",
      subtitle: "Chat, help, answer",
      icon: Sparkles,
      activeColor: "bg-blue-600 text-white",
    },
    {
      id: "coding",
      name: "Coding Agent",
      subtitle: "Write, debug, build",
      icon: Code2,
      activeColor: "bg-indigo-600 text-white",
    },
    {
      id: "research",
      name: "Research Agent",
      subtitle: "Find, analyze, summarize",
      icon: Search,
      activeColor: "bg-cyan-600 text-white",
    },
    {
      id: "creative",
      name: "Creative Agent",
      subtitle: "Design, write, brainstorm",
      icon: Feather,
      activeColor: "bg-purple-600 text-white",
    },
  ];

  const handleSelect = (id: string) => {
    setSelected(id);
    onSelectAgent?.(id);
  };

  return (
    <div className={`relative flex flex-col justify-center ${className}`}>
      {/* Curved Arc Background Edge */}
      <div className="hidden xl:block absolute -left-12 top-0 bottom-0 w-24 border-l-2 border-blue-400/30 rounded-l-[120px] pointer-events-none" />

      <div className="w-full max-w-[290px] space-y-4">
        {/* Header */}
        <div className="space-y-0.5 pl-2">
          <h3 className="text-base font-bold text-foreground tracking-tight">AI Agents</h3>
          <p className="text-xs text-muted-foreground">Choose an agent for your task</p>
        </div>

        {/* Agent Cards Stack */}
        <div className="space-y-2.5">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isActive = selected === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => handleSelect(agent.id)}
                className={`relative flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isActive
                    ? "liquid-glass bg-white/85 dark:bg-slate-900/85 border-blue-400/60 shadow-[0_10px_30px_-8px_rgba(37,99,235,0.22)] -translate-x-1"
                    : "liquid-glass-card hover:-translate-x-1"
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/40"
                        : "bg-surface-subtle/80 text-muted-foreground border border-border/80 group-hover:border-blue-400/50 group-hover:text-blue-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Text */}
                  <div className="space-y-0.5">
                    <h4
                      className={`text-xs font-bold leading-none ${
                        isActive ? "text-blue-600 dark:text-blue-400" : "text-foreground"
                      }`}
                    >
                      {agent.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">{agent.subtitle}</p>
                  </div>
                </div>

                {/* Right Arrow Chevron */}
                <ChevronRight
                  className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
