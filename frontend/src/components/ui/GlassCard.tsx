import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverable = false,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-[24px] p-5 liquid-glass transition-all duration-200",
          hoverable && "hover:border-blue-400/50 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
