"use client";

import React, { useState, useEffect } from "react";
import { useApp, getInitials } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  User,
  Smartphone,
  Shield,
  KeyRound,
  CheckCircle2,
  Server,
  Palette,
  Info,
  RefreshCw,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const {
    theme,
    toggleTheme,
    isConnected,
    pairing,
    refreshState,
    userName,
    setUserName,
    userRole,
    setUserRole,
    memory,
    isAuthenticated,
    logout,
  } = useApp();
  const [pairingCode, setPairingCode] = useState("");
  const [pairStatus, setPairStatus] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const initialName = userName || (memory?.user && !memory.user.toLowerCase().includes("engineering student") ? memory.user : "") || "User";
  const [nameInput, setNameInput] = useState(initialName);
  const [roleInput, setRoleInput] = useState(userRole || "Lead Systems Architect & AI Specialist");

  useEffect(() => {
    if (userName) setNameInput(userName);
  }, [userName]);

  useEffect(() => {
    if (userRole) setRoleInput(userRole);
  }, [userRole]);

  const handlePair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingCode.trim()) return;
    try {
      const res = await api.pairDevice(pairingCode);
      if (res.status === "authenticated") {
        setPairStatus("Device paired successfully!");
        refreshState();
      } else {
        setPairStatus("Invalid pairing code");
      }
    } catch (err: any) {
      setPairStatus(`Pairing failed: ${err.message}`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
    if (roleInput.trim()) {
      setUserRole(roleInput.trim());
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = getInitials(nameInput || userName);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">User Profile & Companion Settings</h1>
            <p className="text-xs text-muted-foreground">
              Manage user profile, Android pairing, session security, and environment preferences
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
          <span>Profile preferences saved successfully.</span>
        </div>
      )}

      {/* User Profile Overview */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-3">
            <div
              suppressHydrationWarning
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md ring-2 ring-white dark:ring-slate-800"
            >
              {initials}
            </div>
            <div>
              <h2 suppressHydrationWarning className="text-sm font-bold text-foreground">
                {nameInput || userName || "User"}
              </h2>
              <p suppressHydrationWarning className="text-xs text-muted-foreground">
                {roleInput || "AI Specialist"}
              </p>
            </div>
          </div>
          <Badge variant="primary" size="sm">Active User</Badge>
        </div>

        {/* Profile Editing Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="space-y-1.5">
            <label className="text-muted-foreground block font-mono text-[11px]">Display Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3 py-2 text-xs bg-surface border border-border/80 rounded-lg outline-none focus:border-primary text-foreground"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground block font-mono text-[11px]">Professional Title / Role</label>
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              placeholder="e.g. Lead Systems Architect & AI Specialist"
              className="w-full px-3 py-2 text-xs bg-surface border border-border/80 rounded-lg outline-none focus:border-primary text-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-border/40">
          <div className="space-y-1">
            <span className="text-muted-foreground block font-mono">Workspace Role</span>
            <span className="font-semibold text-foreground">Administrator</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground block font-mono">Environment Target</span>
            <span className="font-semibold text-foreground">Windows Desktop Core</span>
          </div>
        </div>
      </GlassCard>

      {/* Android Device Pairing */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Android Companion Pairing</h2>
          </div>
          <Badge variant={pairing?.paired ? "success" : "muted"} size="sm">
            {pairing?.paired ? "PAIRED" : "UNPAIRED"}
          </Badge>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Connect your ECORAA Android Companion app to this Windows Desktop host using the 6-character pairing code.
          </p>

          <form onSubmit={handlePair} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="e.g. ECORAA-4821"
              value={pairingCode}
              onChange={(e) => setPairingCode(e.target.value)}
              className="flex-1 px-3 py-2 text-xs font-mono bg-surface border border-border/80 rounded-lg outline-none focus:border-primary text-foreground uppercase"
            />
            <Button type="submit" variant="primary" size="sm">
              Pair Device
            </Button>
          </form>

          {pairStatus && (
            <p className="text-xs font-mono text-primary font-medium">{pairStatus}</p>
          )}

          {pairing?.paired && (
            <div className="p-3 rounded-lg bg-surface/80 border border-border/60 text-xs font-mono space-y-1">
              <div>Device: <span className="text-foreground font-semibold">{pairing.device_name || "ECORAA Android Pad"}</span></div>
              <div>Session Token: <span className="text-muted-foreground">{pairing.token || "Active"}</span></div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Security & System Info */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-warning" />
            <h2 className="text-sm font-bold text-foreground">Security & Permissions</h2>
          </div>
          <Badge variant={isConnected ? "success" : "danger"} size="sm">
            {isConnected ? "SECURE BRIDGE ACTIVE" : "OFFLINE"}
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface/40 border border-border/40">
            <span>Workspace Security Boundary</span>
            <span className="font-mono text-emerald-600 font-semibold">ENFORCED</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface/40 border border-border/40">
            <span>OpenRouter API Key Storage</span>
            <span className="font-mono text-emerald-600 font-semibold">BACKEND ONLY (.env)</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface/40 border border-border/40">
            <span>This Device Authentication</span>
            <span className="font-mono text-emerald-600 font-semibold">
              {isAuthenticated ? "REMEMBERED & ACTIVE" : "TEMPORARY SESSION"}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border/40 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-1.5 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out & Forget Device</span>
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}
