"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import {
  Sparkles,
  Plus,
  Search,
  MessageSquare,
  Code2,
  BookOpen,
  Laptop,
  ChevronRight,
  Maximize2,
  Sliders,
  Sun,
  Moon,
} from "lucide-react";

interface RecentChat {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: any;
  route: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { openCommandPalette, isConnected, setShowWelcome, theme, toggleTheme } = useApp();
  const [selectedChatId, setSelectedChatId] = useState<string>("chat-1");

  const recentChats: RecentChat[] = [
    {
      id: "chat-1",
      title: "Project Ideas Discussion",
      subtitle: "Let's explore some innovative...",
      time: "10:24 AM",
      icon: MessageSquare,
      route: "/",
    },
    {
      id: "chat-2",
      title: "Code Review Help",
      subtitle: "Here's the optimized version...",
      time: "Yesterday",
      icon: Code2,
      route: "/console",
    },
    {
      id: "chat-3",
      title: "Study Plan for AI",
      subtitle: "Here's a 7-day learning plan...",
      time: "Sep 18",
      icon: BookOpen,
      route: "/memory",
    },
    {
      id: "chat-4",
      title: "Build a Web App",
      subtitle: "I can help you create a simple...",
      time: "Sep 16",
      icon: Laptop,
      route: "/tasks",
    },
    {
      id: "chat-5",
      title: "General Query",
      subtitle: "Sure! Here's the information...",
      time: "Sep 14",
      icon: MessageSquare,
      route: "/",
    },
  ];

  const handleNewChat = () => {
    router.push("/");
  };

  return (
    <aside className="hidden lg:flex flex-col w-[275px] h-[calc(100vh-2rem)] my-4 ml-4 rounded-[28px] liquid-glass p-4 select-none z-30 shrink-0">
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-blue-600 dark:text-blue-400">
            AI Assist
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

      {/* New Chat Button */}
      <div className="py-2">
        <button
          onClick={handleNewChat}
          className="w-full py-2.5 px-4 rounded-full gradient-blue-btn flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Recent Chats Section Header */}
      <div className="flex items-center justify-between px-2 pt-3 pb-2 text-xs font-semibold text-foreground">
        <span>Recent Chats</span>
        <button
          onClick={openCommandPalette}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recent Chats List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-1 pb-2">
        {recentChats.map((chat) => {
          const Icon = chat.icon;
          const isSelected = selectedChatId === chat.id;

          return (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChatId(chat.id);
                router.push(chat.route);
              }}
              className={`p-2.5 rounded-2xl cursor-pointer transition-all duration-200 group relative flex items-center justify-between ${
                isSelected
                  ? "liquid-glass bg-white/90 dark:bg-slate-900/90 border-blue-400/50 shadow-sm"
                  : "liquid-glass-card hover:bg-white/80"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Chat Icon Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-600/10 text-blue-600 dark:text-blue-400"
                      : "bg-surface-subtle text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Title & Preview */}
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-foreground truncate">
                      {chat.title}
                    </h4>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{chat.subtitle}</p>
                </div>
              </div>

              {/* Timestamp & Chevron */}
              <div className="flex flex-col items-end shrink-0 pl-1">
                <span className="text-[9px] font-mono text-muted-foreground">{chat.time}</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile Card at Bottom */}
      <div className="pt-2 mt-auto">
        <Link href="/settings">
          <div className="p-2.5 rounded-2xl liquid-glass-card flex items-center justify-between cursor-pointer hover:border-blue-400/50">
            <div className="flex items-center gap-2.5">
              {/* User Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm ring-2 ring-white dark:ring-slate-800">
                SC
              </div>

              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-foreground">Sai Chandra Kiran</h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">AI & Data Science</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
      </div>
    </aside>
  );
};
