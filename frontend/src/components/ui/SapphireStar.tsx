"use client";

import React from "react";

interface SapphireStarProps {
  size?: number;
  className?: string;
}

export const SapphireStar: React.FC<SapphireStarProps> = ({ size = 160, className = "" }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient Blue Halo Glow */}
      <div className="absolute inset-0 rounded-full bg-blue-500/25 blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute inset-4 rounded-full bg-sky-400/20 blur-xl pointer-events-none" />

      {/* Floating Sparkle Stars around the orb */}
      <div className="absolute -top-3 right-6 text-blue-500 text-base animate-bounce duration-1000">
        ✦
      </div>
      <div className="absolute top-8 -right-4 text-sky-400 text-xs animate-pulse">
        ✦
      </div>
      <div className="absolute -bottom-1 -left-4 text-blue-500 text-xs animate-pulse">
        ✦
      </div>
      <div className="absolute top-4 -left-6 text-indigo-400 text-[14px] animate-bounce">
        ✦
      </div>
      <div className="absolute bottom-6 right-2 text-cyan-400 text-[10px]">
        ✦
      </div>

      {/* Main 3D Faceted Sapphire Star */}
      <div className="relative animate-float z-10 flex items-center justify-center drop-shadow-[0_18px_30px_rgba(47,126,218,0.5)] shrink-0">
        <svg
          width={Math.round(size * 0.72)}
          height={Math.round(size * 0.72)}
          style={{
            width: `${Math.round(size * 0.72)}px`,
            height: `${Math.round(size * 0.72)}px`,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >

          <defs>
            {/* Top North Facet */}
            <linearGradient id="facet-north-left" x1="50" y1="2" x2="35" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="40%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="facet-north-right" x1="50" y1="2" x2="65" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7DD3FC" />
              <stop offset="50%" stopColor="#2F7EDA" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>

            {/* East Facet */}
            <linearGradient id="facet-east-top" x1="98" y1="50" x2="50" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="45%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="facet-east-bottom" x1="98" y1="50" x2="50" y2="65" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            {/* South Facet */}
            <linearGradient id="facet-south-right" x1="50" y1="98" x2="65" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="facet-south-left" x1="50" y1="98" x2="35" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            {/* West Facet */}
            <linearGradient id="facet-west-bottom" x1="2" y1="50" x2="50" y2="65" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="facet-west-top" x1="2" y1="50" x2="50" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#BAE6FD" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Central Diamond Flare */}
            <radialGradient id="center-flare" cx="50" cy="50" r="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="35%" stopColor="#E0F2FE" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#2F7EDA" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* North Point: Left & Right Half-Facets */}
          <path d="M50 2 C50 2 48 32 30 46 L50 50 Z" fill="url(#facet-north-left)" />
          <path d="M50 2 C50 2 52 32 70 46 L50 50 Z" fill="url(#facet-north-right)" />

          {/* East Point: Top & Bottom Half-Facets */}
          <path d="M98 50 C98 50 68 48 54 30 L50 50 Z" fill="url(#facet-east-top)" />
          <path d="M98 50 C98 50 68 52 54 70 L50 50 Z" fill="url(#facet-east-bottom)" />

          {/* South Point: Right & Left Half-Facets */}
          <path d="M50 98 C50 98 52 68 70 54 L50 50 Z" fill="url(#facet-south-right)" />
          <path d="M50 98 C50 98 48 68 30 54 L50 50 Z" fill="url(#facet-south-left)" />

          {/* West Point: Bottom & Top Half-Facets */}
          <path d="M2 50 C2 50 32 52 46 70 L50 50 Z" fill="url(#facet-west-bottom)" />
          <path d="M2 50 C2 50 32 48 46 30 L50 50 Z" fill="url(#facet-west-top)" />

          {/* Central Specular Flare & Star highlight */}
          <circle cx="50" cy="50" r="14" fill="url(#center-flare)" />
          <path
            d="M50 40 L52.5 47.5 L60 50 L52.5 52.5 L50 60 L47.5 52.5 L40 50 L47.5 47.5 Z"
            fill="#FFFFFF"
            filter="drop-shadow(0 0 2px #FFFFFF)"
          />
        </svg>
      </div>
    </div>
  );
};

