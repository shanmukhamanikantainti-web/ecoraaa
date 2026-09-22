"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquareCode,
  ListTodo,
  BrainCircuit,
  Terminal,
  FolderGit2,
  Sliders,
} from "lucide-react";

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Assistant", href: "/", icon: MessageSquareCode },
    { label: "Tasks", href: "/tasks", icon: ListTodo },
    { label: "Memory", href: "/memory", icon: BrainCircuit },
    { label: "Console", href: "/console", icon: Terminal },
    { label: "Files", href: "/files", icon: FolderGit2 },
    { label: "Settings", href: "/settings", icon: Sliders },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl border-t border-border/70 z-40 px-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-md transition-colors ${
              isActive
                ? "text-primary font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
