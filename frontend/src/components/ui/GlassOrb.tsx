"use client";

import React from "react";


interface GlassOrbProps {
  size?: number;
  className?: string;
  glowColor?: string;
}

export const GlassOrb: React.FC<GlassOrbProps> = ({
  size = 400,
  className = "",
  glowColor = "rgba(47, 126, 218, 0.2)",
}) => {
  return (
    <div
      className={`relative rounded-full pointer-events-none select-none ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Outer Atmospheric Soft Halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          boxShadow: `0 35px 90px -10px ${glowColor}`,
        }}
      />

      {/* Main 3D Liquid Crystal Sphere */}
      <div
        className="absolute inset-0 rounded-full border-[2px] border-white/95"
        style={{
          background: `
            radial-gradient(circle at 32% 26%, 
              rgba(255, 255, 255, 0.88) 0%, 
              rgba(255, 255, 255, 0.4) 22%, 
              rgba(237, 239, 243, 0.12) 50%, 
              rgba(198, 209, 215, 0.3) 78%, 
              rgba(47, 126, 218, 0.25) 100%
            )
          `,
          boxShadow: `
            inset 0 18px 36px 0 rgba(255, 255, 255, 0.98),
            inset 0 -18px 36px 0 rgba(198, 209, 215, 0.45),
            inset -8px 0 28px 0 rgba(47, 126, 218, 0.22),
            0 20px 50px -10px rgba(47, 126, 218, 0.18)
          `,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Primary Specular Glint Reflection (Top-Left Pill Glow) */}
      <div
        className="absolute top-[12%] left-[16%] w-[32%] h-[18%] rounded-full bg-gradient-to-b from-white via-white/90 to-white/50 blur-[0.5px] transform -rotate-40 pointer-events-none"
        style={{
          boxShadow: "0 0 16px rgba(255, 255, 255, 0.95)",
        }}
      />

      {/* Secondary Rim Flare (Top-Right Crescent Highlight) */}
      <div className="absolute top-[10%] right-[20%] w-[16%] h-[8%] rounded-full bg-white/85 blur-[0.8px] transform rotate-35 pointer-events-none" />

      {/* Bottom Internal Caustic Sheen (Luminous Sapphire / Iris Glow) */}
      <div
        className="absolute bottom-[10%] right-[14%] w-[44%] h-[26%] rounded-full bg-gradient-to-tr from-blue-400/35 via-sky-300/25 to-transparent blur-[8px] transform -rotate-15 pointer-events-none"
      />
    </div>
  );
};



