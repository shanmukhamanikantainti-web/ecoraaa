"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sliders,
  Cpu,
  Palette,
  KeyRound,
  CheckCircle2,
  Server,
  Sparkles,
  Shield,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme, isConnected } = useApp();
  const [model, setModel] = useState("claude-3-5-sonnet");
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••");
  const [backendUrl, setBackendUrl] = useState("http://localhost:8420");
  const [saved, setSaved] = useState(false);

  const [varianceDial, setVarianceDial] = useState("3");
  const [motionDial, setMotionDial] = useState("3");
  const [densityDial, setDensityDial] = useState("4");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const models = [
    { id: "claude-3-5-sonnet", name: "Anthropic Claude 3.5 Sonnet", desc: "Recommended for reasoning & tools" },
    { id: "gpt-4o", name: "OpenAI GPT-4o", desc: "Multimodal and rapid execution" },
    { id: "deepseek-r1", name: "DeepSeek R1", desc: "Advanced algorithmic reasoning" },
    { id: "ollama-local", name: "Ollama (Local Offline LLM)", desc: "Private on-device inference" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">System Settings & AI Models</h1>
            <p className="text-xs text-muted-foreground">
              Configure intelligence providers, design system tokens, and backend bridges
            </p>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave} className="gap-1.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Preferences</span>
        </Button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-lg bg-success/10 border border-success/30 text-success text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences updated and saved to client state.</span>
        </div>
      )}

      {/* Model Selection */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <Cpu className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Active Intelligence Provider</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {models.map((m) => {
            const isSelected = model === m.id;
            return (
              <div
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-surface-elevated border-primary shadow-glow"
                    : "bg-surface/60 border-border/60 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-foreground">{m.name}</span>
                  {isSelected && <Badge variant="primary" size="sm">Active</Badge>}
                </div>
                <p className="text-[11px] text-muted-foreground">{m.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-border/40 space-y-2">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" /> API Key / Token Override
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-surface border border-border/80 rounded-lg outline-none focus:border-primary text-foreground font-mono"
          />
        </div>
      </GlassCard>

      {/* Design Dials & Aesthetic Tuning */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-warning" />
            <h2 className="text-sm font-bold text-foreground">ECORAA Design System Dials</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            Current: {theme.toUpperCase()}
          </Button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between text-muted-foreground font-mono text-[11px]">
              <span>Variance (Minimal vs Dynamic)</span>
              <span>{varianceDial}/10 (Centered / Minimal)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={varianceDial}
              onChange={(e) => setVarianceDial(e.target.value)}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-muted-foreground font-mono text-[11px]">
              <span>Motion (Micro-interactions)</span>
              <span>{motionDial}/10 (Subtle)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={motionDial}
              onChange={(e) => setMotionDial(e.target.value)}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-muted-foreground font-mono text-[11px]">
              <span>Density (Information Spacing)</span>
              <span>{densityDial}/10 (Standard)</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={densityDial}
              onChange={(e) => setDensityDial(e.target.value)}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </GlassCard>

      {/* Backend Core Connection */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-info" />
            <h2 className="text-sm font-bold text-foreground">Backend Pegasus Core Target</h2>
          </div>
          <Badge variant={isConnected ? "success" : "danger"} size="sm">
            {isConnected ? "CONNECTED" : "DISCONNECTED"}
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground block">
            Core HTTP / WebSocket Host
          </label>
          <input
            type="text"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-surface border border-border/80 rounded-lg outline-none focus:border-primary text-foreground"
          />
        </div>
      </GlassCard>
    </div>
  );
}
