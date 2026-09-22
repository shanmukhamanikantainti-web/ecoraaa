"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp, getInitials } from "@/lib/store";
import { EcoraaLogo } from "@/components/ui/EcoraaLogo";
import { Project } from "@/lib/types";

import {
  Sparkles,
  Plus,
  Search,
  ChevronRight,
  Maximize2,
  Sun,
  Moon,
  FolderKanban,
  Folder,
  Trash2,
  X,
  Loader2,
} from "lucide-react";

function formatProjectDate(dateStr?: string | null): string {
  if (!dateStr) return "Recent";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recent";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const {
    openCommandPalette,
    setShowWelcome,
    theme,
    toggleTheme,
    userName,
    memory,
    projects,
    activeProject,
    setActiveProject,
    createProject,
    deleteProject,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const displayName =
    userName ||
    (memory?.user && !memory.user.toLowerCase().includes("engineering student") ? memory.user : "") ||
    "User";
  const initials = getInitials(displayName);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenCreateModal = () => {
    setNewProjectName("");
    setNewProjectDesc("");
    setCreateError(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      setCreateError("Project name is required.");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      await createProject(newProjectName.trim(), newProjectDesc.trim());
      setIsCreateModalOpen(false);
      setNewProjectName("");
      setNewProjectDesc("");
      router.push("/");
    } catch (err: any) {
      setCreateError(err?.message || "Failed to create project in Supabase.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project and its chats?")) {
      try {
        await deleteProject(projectId);
      } catch (err: any) {
        alert("Failed to delete project: " + err.message);
      }
    }
  };

  return (
    <>
      <aside
        className="hidden lg:flex flex-col w-[275px] h-[calc(100vh-2rem)] my-4 ml-4 rounded-[28px] liquid-glass shadow-floating p-4 select-none z-30 shrink-0"
        style={{ background: "#FFFDF7" }}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-1 pb-3">
          <div
            onClick={() => {
              setShowWelcome(true);
              router.push("/");
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Return to Welcome Screen"
          >
            <div className="w-11 h-11 rounded-full bg-white border border-amber-200/60 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 p-1.5">
              <EcoraaLogo size={34} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              ECORAA
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>
            <button
              onClick={openCommandPalette}
              title="Spotlight Search"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Project Button (Replaces New Chat button in red box) */}
        <div className="py-2">
          <button
            onClick={handleOpenCreateModal}
            className="w-full py-2.5 px-4 rounded-full gradient-blue-btn flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer shadow-md active:scale-98 transition-transform"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Project</span>
          </button>
        </div>

        {/* Projects Section Header */}
        <div className="flex items-center justify-between px-2 pt-3 pb-2 text-xs font-semibold text-foreground">
          <div className="flex items-center gap-1.5">
            <span>Projects</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-mono">
              {projects.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsSearchOpen((prev) => !prev)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title="Filter projects"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="p-1 text-muted-foreground hover:text-blue-600 transition-colors"
              title="Add project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search input if active */}
        {isSearchOpen && (
          <div className="px-1 pb-2">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-foreground"
              autoFocus
            />
          </div>
        )}

        {/* User Projects List (Supabase database backed, scoped to user) */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-1 pb-2">
          {filteredProjects.length === 0 ? (
            <div className="p-4 text-center space-y-2 text-xs text-muted-foreground">
              <Folder className="w-6 h-6 mx-auto stroke-1 opacity-50" />
              <p>No projects found.</p>
              <button
                onClick={handleOpenCreateModal}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                + Create first project
              </button>
            </div>
          ) : (
            filteredProjects.map((proj) => {
              const isSelected = activeProject?.id === proj.id;

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setActiveProject(proj);
                    if (pathname !== "/") {
                      router.push("/");
                    }
                  }}
                  className={`p-2.5 rounded-2xl cursor-pointer transition-all duration-200 group relative flex items-center justify-between ${
                    isSelected
                      ? "liquid-glass bg-white/95 dark:bg-slate-900/95 border-blue-500/60 shadow-md ring-1 ring-blue-500/20"
                      : "liquid-glass-card hover:bg-white/80 dark:hover:bg-slate-800/80 border-transparent hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Project Icon */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 shadow-sm"
                          : "bg-surface-subtle text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <FolderKanban className="w-4 h-4" />
                    </div>

                    {/* Title & Preview */}
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <h4
                          className={`text-xs font-semibold truncate ${
                            isSelected ? "text-blue-700 dark:text-blue-400 font-bold" : "text-foreground"
                          }`}
                          title={proj.name}
                        >
                          {proj.name}
                        </h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {proj.description || "Project Workspace"}
                      </p>
                    </div>
                  </div>

                  {/* Timestamp & Actions */}
                  <div className="flex items-center gap-1 shrink-0 pl-1">
                    <span className="text-[9px] font-mono text-muted-foreground">
                      {formatProjectDate(proj.created_at)}
                    </span>
                    <button
                      onClick={(e) => handleDeleteProject(e, proj.id)}
                      title="Delete project"
                      className="p-1 text-muted-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight
                      className={`w-3.5 h-3.5 text-muted-foreground transition-opacity ${
                        isSelected ? "opacity-100 text-blue-500" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* User Profile Card at Bottom */}
        <div className="pt-2 mt-auto">
          <Link href="/profile">
            <div className="p-2.5 rounded-2xl liquid-glass-card flex items-center justify-between cursor-pointer hover:border-blue-400/50">
              <div className="flex items-center gap-2.5">
                {/* User Avatar */}
                <div
                  suppressHydrationWarning
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm ring-2 ring-white dark:ring-slate-800"
                >
                  {initials}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <h4
                    suppressHydrationWarning
                    className="text-xs font-bold text-foreground truncate max-w-[120px]"
                    title={displayName}
                  >
                    {displayName}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-muted-foreground font-mono">Profile & Settings</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>
        </div>
      </aside>

      {/* ── Create New Project Modal ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl p-6 shadow-2xl border border-blue-500/20 liquid-glass animate-in zoom-in-95 duration-200"
            style={{ background: "#FFFDF7" }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center shadow-sm">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Create New Project
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Saved in your Supabase workspace
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4">
              {createError && (
                <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400">
                  {createError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Project Name <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Multi-Agent Autonomous Pipeline"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                  autoFocus
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
                </label>
                <textarea
                  placeholder="What is this project focused on?"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 text-xs font-semibold rounded-xl gradient-blue-btn flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
