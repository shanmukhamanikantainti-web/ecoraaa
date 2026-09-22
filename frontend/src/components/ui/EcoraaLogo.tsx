import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
}

export const EcoraaLogo: React.FC<LogoProps> = ({ size = 36, className = "" }) => {
  return (
    <img
      src="/ecoraa_logo.png"
      alt="ECORAA Logo"
      width={size}
      height={size}
      className={`object-contain mix-blend-multiply dark:invert shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
};





