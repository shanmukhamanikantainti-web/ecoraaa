"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/store";
import {
  Sun,
  Moon,
  Command,
  Sparkles,
  ListTodo,
  BrainCircuit,
  Terminal,
  FolderGit2,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { isConnected, theme, toggleTheme, openCommandPalette } = useApp();

  const navTabs = [
    { label: "Assistant", href: "/", icon: Sparkles },
    { label: "Tasks", href: "/tasks", icon: ListTodo },
    { label: "Memory", href: "/memory", icon: BrainCircuit },
    { label: "Console", href: "/console", icon: Terminal },
    { label: "Files", href: "/files", icon: FolderGit2 },
    { label: "Cases", href: "/cases", icon: ShieldCheck },
    { label: "Device", href: "/device", icon: Smartphone },
  ];

  return (
    <header className="h-16 px-4 md:px-8 flex items-center justify-between z-20 select-none">
      {/* Left: Status Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass-card text-xs font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          />
          <span className="font-semibold text-foreground">
            {isConnected ? "Core Online" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Center: Glass View Tabs */}
      <nav className="hidden md:flex items-center gap-1 p-1 rounded-full liquid-glass-card shadow-xs">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm shadow-blue-500/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right: Pill Badge & Theme Toggle */}
      <div className="flex items-center gap-2.5">
        {/* "Better ideas. Faster." Top Pill Badge from Image */}
        <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass-pill text-xs font-medium text-foreground">
          <span className="text-amber-500 text-sm">☼</span>
          <span className="text-muted-foreground">Better ideas. Faster.</span>
        </div>

        {/* Command Search Button */}
        <button
          onClick={openCommandPalette}
          title="Spotlight Search (Ctrl+K)"
          className="w-9 h-9 rounded-full liquid-glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-400/50 transition-colors"
        >
          <Command className="w-4 h-4" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
          className="w-9 h-9 rounded-full liquid-glass-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-blue-400/50 transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-blue-600" />
          )}
        </button>
      </div>
    </header>
  );
};
