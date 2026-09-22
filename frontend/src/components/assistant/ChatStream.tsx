"use client";

import React from "react";
import { ChatMessage } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  User,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface ChatStreamProps {
  messages: ChatMessage[];
}

export const ChatStream: React.FC<ChatStreamProps> = ({ messages }) => {
  const [expandedSteps, setExpandedSteps] = React.useState<Record<string, boolean>>({});

  const toggleSteps = (id: string) => {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 pb-4">
      {messages.map((msg) => {
        const isAssistant = msg.role === "assistant";
        const hasSteps = msg.steps && msg.steps.length > 0;
        const isExpanded = expandedSteps[msg.id] ?? true;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3.5 ${
              isAssistant ? "justify-start" : "justify-end"
            } animate-in fade-in duration-200`}
          >
            {isAssistant && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 shadow-md transition-all ${
                isAssistant
                  ? "bg-[#FFFDF7] dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                  : "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <span
                  className={`text-xs font-bold tracking-wide ${
                    isAssistant ? "text-blue-600 dark:text-blue-400" : "text-white/90"
                  }`}
                >
                  {isAssistant ? "ECORAA ASSIST" : "YOU"}
                </span>
                <span
                  className={`text-[11px] font-mono ${
                    isAssistant ? "text-slate-400 dark:text-slate-500" : "text-white/80"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Content */}
              <div
                className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium ${
                  isAssistant ? "text-slate-800 dark:text-slate-100" : "text-white"
                }`}
              >
                {msg.content}
              </div>

              {/* Streaming Indicator */}
              {msg.status === "streaming" && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/40 text-xs text-blue-600 dark:text-blue-400">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="font-mono">Agents orchestrating and executing tools...</span>
                </div>
              )}

              {/* Step Pipeline Breakdown */}
              {hasSteps && (
                <div className="mt-4 pt-3 border-t border-border/50">
                  <button
                    onClick={() => toggleSteps(msg.id)}
                    className="flex items-center justify-between w-full text-xs font-mono font-medium text-muted-foreground hover:text-foreground mb-2"
                  >
                    <span>Execution Plan ({msg.steps!.length} Steps)</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="space-y-2 mt-2">
                      {msg.steps!.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-3 rounded-2xl liquid-glass-card text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-600 font-mono text-[10px] flex items-center justify-center font-bold">
                                {step.step_number || sIdx + 1}
                              </span>
                              <span className="font-semibold text-foreground">
                                {step.agent || "Agent"}
                              </span>
                            </div>
                            <Badge
                              size="sm"
                              variant={
                                step.status === "COMPLETED"
                                  ? "success"
                                  : step.status === "RUNNING"
                                  ? "primary"
                                  : "muted"
                              }
                            >
                              {step.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                          {step.result && (
                            <div className="mt-1.5 p-2 rounded-xl bg-surface/80 font-mono text-[11px] text-foreground border border-border/40 overflow-x-auto">
                              {step.result}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isAssistant && (
              <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-600 font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
