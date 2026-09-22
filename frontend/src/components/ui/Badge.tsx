"use client";

import React from "react";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "muted" | "outline";
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "muted",
  size = "md",
  className,
  dot = false,
}) => {
  const baseStyles =
    "inline-flex items-center font-mono font-medium rounded-xs uppercase tracking-wider select-none";

  const variants = {
    primary: "bg-primary/15 text-primary border border-primary/30",
    success: "bg-success/15 text-success border border-success/30",
    warning: "bg-warning/15 text-warning border border-warning/30",
    danger: "bg-danger/15 text-danger border border-danger/30",
    muted: "bg-muted text-muted-foreground border border-border/60",
    outline: "bg-transparent text-foreground border border-border",
  };

  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2 py-0.5 gap-1.5",
  };

  const dotColors = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    muted: "bg-muted-foreground",
    outline: "bg-foreground",
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
};
