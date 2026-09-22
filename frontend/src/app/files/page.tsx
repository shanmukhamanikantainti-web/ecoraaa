"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import {
  FolderGit2,
  Folder,
  File,
  FileCode,
  FileText,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderOpen,
} from "lucide-react";

export default function FilesPage() {
  const { systemStatus, refreshState } = useApp();
  const [workspacePath, setWorkspacePath] = useState(
    systemStatus?.workspace?.path || "c:\\projects\\ecoraaa"
  );
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleUpdateWorkspace = async () => {
    if (!workspacePath.trim()) return;
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await api.setWorkspace(workspacePath);
      if (res.status === "success") {
        setStatusMsg({ type: "success", text: `Active workspace changed to: ${res.workspace.path}` });
      } else {
        setStatusMsg({ type: "error", text: res.workspace?.path || "Failed to switch directory." });
      }
      await refreshState();
    } catch (err: any) {
      setStatusMsg({ type: "error", text: err?.message || "Failed to switch workspace" });
    } finally {
      setLoading(false);
    }
  };

  const sampleFiles = [
    { name: "backend/main.py", type: "code", size: "370 B", modified: "Just now" },
    { name: "backend/requirements.txt", type: "config", size: "320 B", modified: "10 mins ago" },
    { name: "design-system/ecoraa/MASTER.md", type: "doc", size: "7.1 KB", modified: "Yesterday" },
    { name: "PEGASUS_OS_SRS.md", type: "doc", size: "41.3 KB", modified: "2 days ago" },
    { name: "README.md", type: "doc", size: "5.3 KB", modified: "Today" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Workspace & File Explorer</h1>
            <p className="text-xs text-muted-foreground">
              Manage the active working directory for agent filesystem and terminal tools
            </p>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={() => refreshState()} title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Active Workspace Selector Card */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground">Active Working Directory</h2>
          </div>
          <Badge
            variant={systemStatus?.workspace?.valid ? "success" : "danger"}
            size="sm"
          >
            {systemStatus?.workspace?.valid ? "VALID DIRECTORY" : "UNMOUNTED"}
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border/80 focus-within:border-primary">
            <FolderOpen className="w-4 h-4 text-primary shrink-0" />
            <input
              type="text"
              value={workspacePath}
              onChange={(e) => setWorkspacePath(e.target.value)}
              placeholder="e.g. c:\projects\ecoraaa"
              className="w-full bg-transparent border-none outline-none font-mono text-xs text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={handleUpdateWorkspace}
            disabled={loading}
          >
            {loading ? "Switching..." : "Set Workspace"}
          </Button>
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

      {/* Project Artifacts Table */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="text-sm font-bold text-foreground">Workspace Project Files</h2>
          <span className="text-xs font-mono text-muted-foreground">
            {sampleFiles.length} Indexed Items
          </span>
        </div>

        <div className="divide-y divide-border/30">
          {sampleFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 px-2 rounded-md hover:bg-surface/50 transition-colors text-xs"
            >
              <div className="flex items-center gap-3">
                {file.type === "code" ? (
                  <FileCode className="w-4 h-4 text-primary" />
                ) : (
                  <FileText className="w-4 h-4 text-muted-foreground" />
                )}
                <div>
                  <span className="font-mono font-medium text-foreground block">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Modified: {file.modified}
                  </span>
                </div>
              </div>
              <span className="font-mono text-muted-foreground">{file.size}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
