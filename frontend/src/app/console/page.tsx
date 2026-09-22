"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { TerminalOutput } from "@/lib/types";
import {
  Terminal as TerminalIcon,
  Trash2,
  CornerDownLeft,
  Play,
  Copy,
  Check,
} from "lucide-react";

export default function ConsolePage() {
  const { systemStatus, isConnected } = useApp();
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<TerminalOutput[]>([
    {
      command: "pegasus --version",
      output: "PEGASUS OS Core v0.1.0 (Darwin/Linux/Windows Hybrid)\nIntelligence layer online. Connected tools: Browser, Filesystem, Terminal.",
      exit_code: 0,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [pastCommands, setPastCommands] = useState<string[]>(["pegasus --version"]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const runCommand = async (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) return;

    if (trimmed === "clear") {
      setHistory([]);
      setCommand("");
      return;
    }

    setLoading(true);
    setPastCommands((prev) => [...prev, trimmed]);
    setHistoryIndex(null);

    try {
      const res = await api.runTerminal(trimmed);
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: res.output || "(Command completed with no output)",
          exit_code: res.exit_code,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: `[Execution Error] ${err?.message || "Failed to reach backend terminal"}`,
          exit_code: 1,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
      setCommand("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(command);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (pastCommands.length === 0) return;
      const nextIdx =
        historyIndex === null
          ? pastCommands.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCommand(pastCommands[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= pastCommands.length) {
        setHistoryIndex(null);
        setCommand("");
      } else {
        setHistoryIndex(nextIdx);
        setCommand(pastCommands[nextIdx]);
      }
    }
  };

  const copyLog = () => {
    const text = history.map((h) => `$ ${h.command}\n${h.output}`).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickCommands = ["dir", "git status", "whoami", "python --version", "clear"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <TerminalIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Interactive Terminal Console</h1>
            <p className="text-xs text-muted-foreground">
              Direct shell environment executing commands on host Pegasus Core
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyLog} className="gap-1 text-xs">
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Log"}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHistory([])}
            className="text-danger hover:text-danger gap-1 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </Button>
        </div>
      </div>

      {/* Quick Snippets Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-mono text-muted-foreground uppercase">Quick Cmds:</span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => runCommand(cmd)}
            className="px-2.5 py-1 text-xs font-mono rounded bg-surface border border-border/60 hover:border-primary/50 text-foreground hover:bg-surface-elevated transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal View Container */}
      <div className="bg-[#090C10] border border-[#2A333E] rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#151B23] border-b border-[#2A333E] select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ED6A5E]" />
            <span className="w-3 h-3 rounded-full bg-[#F5BF4F]" />
            <span className="w-3 h-3 rounded-full bg-[#61C554]" />
            <span className="ml-2 text-[#9DA7B3] font-medium text-[11px]">
              ecoraa@pegasus-core: {systemStatus?.workspace?.path || "~"}
            </span>
          </div>
          <Badge variant={isConnected ? "success" : "danger"} size="sm">
            {isConnected ? "SHELL READY" : "DISCONNECTED"}
          </Badge>
        </div>

        {/* Scrollable Output Box */}
        <div
          className="p-4 space-y-4 min-h-[420px] max-h-[560px] overflow-y-auto text-[#E6EDF3]"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-[#3FB8A5]">
                <span>❯</span>
                <span className="text-[#E6EDF3] font-semibold">{item.command}</span>
                <span className="text-[10px] text-[#687481] ml-auto">{item.timestamp}</span>
              </div>
              <pre
                className={`whitespace-pre-wrap leading-relaxed ${
                  item.exit_code === 0 ? "text-[#9DA7B3]" : "text-[#D05C5C]"
                }`}
              >
                {item.output}
              </pre>
            </div>
          ))}

          {/* Current Command Input Line */}
          <div className="flex items-center gap-2 text-[#3FB8A5] pt-1">
            <span>❯</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={loading ? "Executing command..." : "Type shell command..."}
              className="flex-1 bg-transparent border-none outline-none text-[#E6EDF3] font-mono text-xs placeholder:text-[#4B5561]"
              autoFocus
            />
            {loading && <span className="text-[#3FB8A5] animate-pulse">Running...</span>}
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
