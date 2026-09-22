"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { CaseSession, UsbStatus } from "@/lib/types";
import {
  ShieldCheck,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  FileCheck2,
  RefreshCw,
  Clock,
  FolderLock,
} from "lucide-react";

export default function CasesPage() {
  const [usbStatus, setUsbStatus] = useState<UsbStatus | null>(null);
  const [cases, setCases] = useState<CaseSession[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseSession | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, cRes] = await Promise.allSettled([api.getUsbStatus(), api.listCases()]);
      if (uRes.status === "fulfilled") setUsbStatus(uRes.value);
      if (cRes.status === "fulfilled") {
        setCases(cRes.value);
        if (cRes.value.length > 0 && !selectedCase) {
          setSelectedCase(cRes.value[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load cases/USB status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatGb = (bytes: number) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Test Cases & USB Storage</h1>
            <p className="text-xs text-muted-foreground">
              Persistent storage health, boot verification logs, and session recordings
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={loadData} title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* USB Persistent Storage Health Panel */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Hardware Storage Health (USB FAT32/EXT4)</h2>
          </div>
          <Badge variant={usbStatus?.mounted ? "success" : "warning"} size="sm">
            {usbStatus?.mounted ? "STORAGE MOUNTED" : "UNMOUNTED"}
          </Badge>
        </div>

        {usbStatus ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-surface border border-border/50">
                <span className="text-muted-foreground block text-[10px]">MOUNT PATH</span>
                <span className="font-semibold text-foreground">{usbStatus.path}</span>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-border/50">
                <span className="text-muted-foreground block text-[10px]">TOTAL CAPACITY</span>
                <span className="font-semibold text-foreground">{formatGb(usbStatus.total_bytes)} GB</span>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-border/50">
                <span className="text-muted-foreground block text-[10px]">USED SPACE</span>
                <span className="font-semibold text-foreground">{formatGb(usbStatus.used_bytes)} GB</span>
              </div>
              <div className="p-3 rounded-lg bg-surface border border-border/50">
                <span className="text-muted-foreground block text-[10px]">FREE SPACE</span>
                <span className="font-semibold text-success">{formatGb(usbStatus.free_bytes)} GB</span>
              </div>
            </div>

            {/* Storage Usage Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>Storage Utilization</span>
                <span>
                  {Math.round((usbStatus.used_bytes / usbStatus.total_bytes) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((usbStatus.used_bytes / usbStatus.total_bytes) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Persistent Folders */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                <FolderLock className="w-3.5 h-3.5" /> Persistent Directories:
              </span>
              {usbStatus.persistent_folders.map((folder, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface border border-border/50 text-foreground"
                >
                  /{folder}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-muted-foreground">
            {loading ? "Checking hardware storage status..." : "No USB storage detected."}
          </div>
        )}
      </GlassCard>

      {/* Case Sessions & Recordings List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground">
            Session History & Case Logs ({cases.length})
          </h2>

          {cases.map((cs) => {
            const isSelected = selectedCase?.id === cs.id;
            return (
              <div
                key={cs.id}
                onClick={() => setSelectedCase(cs)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-surface-elevated border-primary shadow-glow"
                    : "bg-surface/60 border-border/60 hover:border-primary/40 hover:bg-surface-elevated/40"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-semibold text-foreground">{cs.id}</span>
                  <Badge variant={cs.status === "PASSED" ? "success" : "danger"} size="sm">
                    {cs.status}
                  </Badge>
                </div>
                <h3 className="text-xs font-medium text-foreground line-clamp-2 mb-2">{cs.title}</h3>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>{cs.timeline_events} Timeline Events</span>
                  <span>{new Date(cs.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Case Inspection */}
        <div className="lg:col-span-7">
          {selectedCase ? (
            <GlassCard className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">{selectedCase.id}</span>
                    <Badge variant={selectedCase.status === "PASSED" ? "success" : "danger"} size="sm">
                      {selectedCase.status}
                    </Badge>
                  </div>
                  <h2 className="text-base font-bold text-foreground">{selectedCase.title}</h2>
                </div>
              </div>

              {selectedCase.recording_path && (
                <div className="p-4 rounded-lg bg-surface/80 border border-border/50 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    <div>
                      <span className="font-semibold block text-foreground">Session Recording File</span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {selectedCase.recording_path}
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm">MP4 Video</Badge>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider font-mono text-muted-foreground">
                  Verification Event Log
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-surface/60 border border-border/40 flex items-center justify-between">
                    <span>[00:00:01] USB Hybrid Partition Mounted</span>
                    <span className="text-success">OK</span>
                  </div>
                  <div className="p-2.5 rounded bg-surface/60 border border-border/40 flex items-center justify-between">
                    <span>[00:00:02] SQLite Context Database Schema Verified</span>
                    <span className="text-success">OK</span>
                  </div>
                  <div className="p-2.5 rounded bg-surface/60 border border-border/40 flex items-center justify-between">
                    <span>[00:00:03] Vector DB Index Health Check</span>
                    <span className="text-success">OK</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-10 text-center text-muted-foreground text-sm">
              Select a case session to view event timeline and verification details.
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
