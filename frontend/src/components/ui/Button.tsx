import React, { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-sm border border-transparent",
    secondary:
      "bg-surface text-foreground hover:bg-surface-elevated border border-border",
    ghost:
      "bg-transparent text-muted-foreground hover:text-foreground hover:bg-surface-subtle",
    danger:
      "bg-danger text-white hover:opacity-90 shadow-sm border border-transparent",
    glass:
      "glass-panel text-foreground hover:border-primary/50 shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 rounded-sm gap-1.5",
    md: "text-sm px-3.5 py-2 rounded-md gap-2",
    lg: "text-base px-5 py-2.5 rounded-lg gap-2.5",
    icon: "p-2 rounded-md",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
