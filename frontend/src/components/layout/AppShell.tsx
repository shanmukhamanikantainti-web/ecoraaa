"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { useApp } from "@/lib/store";
import { usePathname } from "next/navigation";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showWelcome, mounted } = useApp();
  const pathname = usePathname();

  const isAuthOrWelcome =
    pathname === "/create-account" ||
    pathname === "/login" ||
    (mounted ? (showWelcome && pathname === "/") : (pathname === "/"));

  if (isAuthOrWelcome) {
    return (
      <div className="relative w-screen h-screen overflow-hidden bg-background text-foreground selection:bg-blue-500/20 selection:text-blue-600">
        {/* Main Content Area */}
        <main className="w-full h-full overflow-hidden">
          {children}
        </main>
        <CommandPalette />
      </div>
    );
  }


  return (
    <div className="relative min-h-screen flex bg-background text-foreground overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-600">
      {/* ── Ambient Glowing Organic Orbs Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Center-Right Orb */}
        <div className="absolute top-[-10%] right-[15%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-300/40 via-cyan-200/30 to-transparent blur-[90px] dark:from-blue-600/20 dark:via-cyan-600/10" />

        {/* Bottom Left Orb */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-300/35 via-blue-200/30 to-transparent blur-[100px] dark:from-indigo-600/20 dark:via-blue-700/15" />

        {/* Bottom Right Giant Orb */}
        <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-blue-300/35 via-sky-200/25 to-transparent blur-[110px] dark:from-blue-700/20 dark:via-sky-800/10" />

        {/* Center Subdued Radiant Sheen */}
        <div className="absolute top-[30%] left-[40%] w-[350px] h-[350px] rounded-full bg-blue-400/15 blur-[80px]" />
      </div>

      {/* Main App Layout Container */}
      <div className="relative z-10 flex w-full min-h-screen">
        {/* Left Floating Sidebar */}
        <Sidebar />

        {/* Center & Right Main View Container */}
        <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
          <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 max-w-[1550px] w-full mx-auto animate-in fade-in duration-200">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Global Spotlight Command Modal */}
      <CommandPalette />
    </div>
  );
};
