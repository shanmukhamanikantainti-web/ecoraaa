"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import {
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Radio,
  ArrowLeft,
  Circle,
  Square,
  Power,
  RotateCcw,
  Sparkles,
  RefreshCw,
  QrCode,
} from "lucide-react";

export default function DevicePage() {
  const { pairing, refreshState } = useApp();
  const [pairCode, setPairCode] = useState("ECORAA-4821");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePair = async () => {
    if (!pairCode.trim()) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await api.pairDevice(pairCode);
      if (res.status === "authenticated") {
        setStatusMsg({ type: "success", text: `Device paired successfully: ${res.device_id}` });
      } else {
        setStatusMsg({ type: "error", text: "Invalid pairing code. Try ECORAA-4821." });
      }
      await refreshState();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err?.message || "Pairing failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Android Companion & Screen Mirror</h1>
            <p className="text-xs text-muted-foreground">
              Direct connection, bidirectional telemetry, and remote interactive display
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={() => refreshState()} title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Device Pairing & Connection Settings */}
        <div className="lg:col-span-6 space-y-5">
          {/* Pairing Status Card */}
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-foreground">Host ↔ Android Bridge</h2>
              </div>
              <Badge variant={pairing?.paired ? "success" : "warning"} size="sm" dot={pairing?.paired}>
                {pairing?.paired ? "DEVICE CONNECTED" : "AWAITING PAIRING"}
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/50">
                <span className="text-muted-foreground">Device Name</span>
                <span className="font-semibold text-foreground font-mono">
                  {pairing?.device_name || "ECORAA Android Smartphone"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/50">
                <span className="text-muted-foreground">Protocol</span>
                <span className="font-semibold text-foreground font-mono">
                  USB ADB / WebSocket Low-Latency
                </span>
              </div>
              {pairing?.token && (
                <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border/50">
                  <span className="text-muted-foreground">Session Token</span>
                  <span className="font-mono text-primary font-semibold">{pairing.token}</span>
                </div>
              )}
            </div>

            {/* Pairing Code Input */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <label className="text-xs font-semibold text-muted-foreground block">
                Pairing Security PIN
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pairCode}
                  onChange={(e) => setPairCode(e.target.value.toUpperCase())}
                  placeholder="ECORAA-4821"
                  className="flex-1 px-3 py-2 text-sm font-mono tracking-wider text-center bg-surface border border-border/80 rounded-lg outline-none focus:border-primary text-foreground"
                />
                <Button variant="primary" size="md" onClick={handlePair} disabled={loading}>
                  {loading ? "Authenticating..." : "Pair Device"}
                </Button>
              </div>
            </div>

            {statusMsg && (
              <div
                className={`p-3 rounded-md text-xs flex items-center gap-2 ${
                  statusMsg.type === "success"
                    ? "bg-success/10 text-success border border-success/30"
                    : "bg-danger/10 text-danger border border-danger/30"
                }`}
              >
                {statusMsg.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}
          </GlassCard>

          {/* Quick Info */}
          <GlassCard className="p-5 space-y-3 bg-surface-subtle/50">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-primary">
              Companion Instructions
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>Connect your Android device via USB with USB Debugging enabled.</li>
              <li>Launch the PEGASUS System App on Android.</li>
              <li>Enter the PIN <strong className="text-foreground font-mono">ECORAA-4821</strong> to establish high-throughput state synchronization.</li>
            </ul>
          </GlassCard>
        </div>

        {/* Right Column: Virtual Screen Mirror Simulator */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[320px] rounded-[36px] bg-[#090C10] p-3 border-4 border-[#2A333E] shadow-2xl space-y-3">
            {/* Phone Top Notch */}
            <div className="flex items-center justify-between px-4 py-1 text-[10px] text-[#9DA7B3] font-mono select-none">
              <span>20:26</span>
              <div className="w-16 h-3 rounded-full bg-[#151B23]" />
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-[#3FB8A5]" />
                <span>100%</span>
              </div>
            </div>

            {/* Screen Content Canvas */}
            <div className="w-full h-[460px] rounded-[24px] bg-[#0D1117] border border-[#2A333E] p-4 flex flex-col justify-between overflow-hidden relative">
              {/* Wallpaper Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/5 pointer-events-none" />

              {/* Status Header inside Phone */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest text-[#3FB8A5] font-mono">
                    PEGASUS OS
                  </span>
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                </div>
                <h4 className="text-xs font-semibold text-[#E6EDF3]">System Intelligence Shell</h4>
              </div>

              {/* Center Activity Widget */}
              <div className="relative z-10 p-3 rounded-xl bg-[#151B23]/90 border border-[#2A333E] space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-[#3FB8A5] font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Agent Stream Active</span>
                </div>
                <p className="text-[10px] text-[#9DA7B3] font-mono leading-tight">
                  Listening for global voice/text commands. Memory synchronized with Host.
                </p>
              </div>

              {/* Bottom Quick Apps Dock */}
              <div className="relative z-10 grid grid-cols-4 gap-2 pt-2 border-t border-[#2A333E]">
                {["Core", "Files", "Term", "Settings"].map((app, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1 p-1.5 rounded-lg bg-[#151B23] border border-[#2A333E] cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary font-mono">
                      {app[0]}
                    </div>
                    <span className="text-[9px] text-[#9DA7B3] font-mono">{app}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Android Hardware Navigation Bar */}
            <div className="flex items-center justify-around py-1 text-[#9DA7B3] select-none">
              <button className="p-2 hover:text-[#E6EDF3] transition-colors" title="Back">
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button className="p-2 hover:text-[#E6EDF3] transition-colors" title="Home">
                <Circle className="w-4 h-4" />
              </button>
              <button className="p-2 hover:text-[#E6EDF3] transition-colors" title="Recents">
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
