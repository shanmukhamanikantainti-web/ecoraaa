import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const EcoraaLogo: React.FC<LogoProps> = ({ size = 28, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 hover:rotate-90 ${className}`}
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
      <path
        d="M20 6L32.1244 13V27L20 34L7.87564 27V13L20 6Z"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="4" fill="var(--color-primary)" />
      <line x1="20" y1="6" x2="20" y2="16" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="2 2" />
      <line x1="20" y1="24" x2="20" y2="34" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
};
