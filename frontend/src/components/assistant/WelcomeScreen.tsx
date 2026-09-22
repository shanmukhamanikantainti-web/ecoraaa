"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SapphireStar } from "@/components/ui/SapphireStar";
import { GlassOrb } from "@/components/ui/GlassOrb";
import { useApp } from "@/lib/store";
import {
  Sun,
  Moon,
  MessageSquare,
  Code2,
  Search,
  PenTool,
  ArrowRight,
} from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted?: (starterGoal?: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const router = useRouter();
  const { theme, toggleTheme, setAuthStep } = useApp();

  const features = [
    {
      id: "chat",
      icon: MessageSquare,
      iconColor: "text-[#2F7EDA]",
      iconBg: "bg-blue-500/10 border-blue-200/60 shadow-blue-500/10",
      title: "Chat Naturally",
      description: "Get instant, helpful responses",
      starter: "Hello! What can you help me with today?",
    },
    {
      id: "code",
      icon: Code2,
      iconColor: "text-[#7C3AED]",
      iconBg: "bg-indigo-500/10 border-indigo-200/60 shadow-indigo-500/10",
      title: "Write & Code",
      description: "Build, debug and solve problems",
      starter: "Help me design and write clean code for a project",
    },
    {
      id: "research",
      icon: Search,
      iconColor: "text-[#0D9488]",
      iconBg: "bg-teal-500/10 border-teal-200/60 shadow-teal-500/10",
      title: "Research Deeply",
      description: "Find, analyze and summarize",
      starter: "Research the latest trends in autonomous AI agents",
    },
    {
      id: "create",
      icon: PenTool,
      iconColor: "text-[#EA580C]",
      iconBg: "bg-amber-500/10 border-amber-200/60 shadow-amber-500/10",
      title: "Create Freely",
      description: "Design, write and bring ideas to life",
      starter: "Brainstorm creative concepts and strategic ideas",
    },
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen max-h-screen overflow-hidden bg-[#FAFAFA] flex flex-col justify-between select-none z-50">
      
      {/* ── Ambient Background 3D Glass Bubbles (Matching Image 2) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radiant Center Light Atmosphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[580px] rounded-full bg-gradient-to-tr from-blue-200/30 via-sky-100/25 to-transparent blur-[120px]" />

        {/* Top Left Giant Frosted Bubble */}
        <GlassOrb
          size={480}
          className="absolute -top-[140px] -left-[130px] animate-float opacity-95"
          glowColor="rgba(47, 126, 218, 0.2)"
        />

        {/* Bottom Left Huge Bubble with Iridescent Refraction */}
        <GlassOrb
          size={580}
          className="absolute -bottom-[170px] -left-[140px] animate-float opacity-90"
          glowColor="rgba(99, 102, 241, 0.22)"
        />

        {/* Top Right Curved Bubble Rim */}
        <GlassOrb
          size={660}
          className="absolute -top-[110px] -right-[150px] animate-float opacity-95"
          glowColor="rgba(56, 189, 248, 0.2)"
        />

        {/* Bottom Right Giant Luminous Sphere */}
        <GlassOrb
          size={600}
          className="absolute -bottom-[150px] -right-[100px] animate-float opacity-90"
          glowColor="rgba(47, 126, 218, 0.22)"
        />
      </div>

      {/* ── Top Header Navigation Bar ── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 pt-6 pb-2 flex items-center justify-between shrink-0">
        {/* Brand Logo with 4-point Sparkle */}
        <div
          id="welcome-brand-logo"
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2F7EDA] to-[#54A0FF] flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform shrink-0">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ width: 20, height: 20 }}
            >
              <path d="M12 0L14.4 8.6L23 11L14.4 13.4L12 22L9.6 13.4L1 11L9.6 8.6L12 0Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#2F7EDA]">
            AI Assist
          </span>
        </div>

        {/* Light / Dark Mode Liquid Glass Pill */}
        <button
          id="welcome-theme-toggle"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill text-xs font-semibold text-[#555663] cursor-pointer shadow-xs shrink-0 hover:bg-white/90 transition-colors"
        >
          {theme === "dark" ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#2F7EDA]" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-[#2F7EDA]" />
              <span>Light Mode</span>
            </>
          )}
        </button>
      </header>

      {/* ── Center Hero Section ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto my-auto text-center px-4 py-2 space-y-4 md:space-y-5 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Central 3D Sapphire Star inside Frosted Liquid Glass Orb */}
        <div className="relative flex items-center justify-center">
          {/* Glass Orb Shell Sphere */}
          <div className="absolute w-40 h-40 md:w-44 md:h-44 rounded-full glass-vessel" />
          
          {/* 3D Star Jewel */}
          <SapphireStar size={135} className="relative z-10" />
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-1.5 max-w-xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#2E303D] leading-[1.12]">
            Welcome to <br />
            <span className="text-[#2F7EDA]">AI Assist</span>
          </h1>
          <p className="text-xs md:text-sm text-[#9FA0B5] font-normal leading-relaxed max-w-md mx-auto pt-0.5">
            Your all-in-one AI companion. Ask, create, research, and build — all in one place.
          </p>
        </div>

        {/* ── 4 Feature Frosted Liquid Glass Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-3xl px-2">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href="/create-account"
                id={`feature-card-${item.id}`}
                onClick={() => {
                  setAuthStep("create-account");
                  onGetStarted?.(item.starter);
                }}
                className="liquid-glass-card group p-4 md:p-5 rounded-[24px] flex flex-col items-center text-center space-y-2.5 cursor-pointer text-left w-full focus:outline-none focus:ring-2 focus:ring-[#2F7EDA]/40 no-underline"
              >
                {/* Circular Glass Icon Capsule */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center ${item.iconBg} border shadow-inner group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-5 h-5 ${item.iconColor}`} />
                </div>

                {/* Title & Description */}
                <div className="space-y-0.5 text-center">
                  <h3 className="text-xs md:text-sm font-bold text-[#2E303D] group-hover:text-[#2F7EDA] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] md:text-xs text-[#9FA0B5] leading-snug">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Call to Action Liquid Glass Capsule Button & Footnote ── */}
        <div className="flex flex-col items-center space-y-2 pt-1">
          <Link
            href="/create-account"
            id="get-started-btn"
            onClick={() => {
              setAuthStep("create-account");
              onGetStarted?.();
            }}
            className="group px-8 py-3.5 rounded-full gradient-blue-btn flex items-center gap-2.5 text-sm font-bold tracking-wide cursor-pointer shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all no-underline text-white"
          >
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            <span>Get Started</span>
          </Link>

          <p className="text-xs text-[#9FA0B5] font-normal tracking-wide">
            No account needed <span className="mx-2 opacity-50">•</span> Start exploring instantly
          </p>
        </div>
      </main>

      {/* ── Footer Spacer ── */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-1 shrink-0" />
    </div>
  );
};




