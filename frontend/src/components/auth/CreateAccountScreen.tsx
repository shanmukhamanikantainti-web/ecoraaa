"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SapphireStar } from "@/components/ui/SapphireStar";
import { GlassOrb } from "@/components/ui/GlassOrb";
import { useApp } from "@/lib/store";
import { supabaseService } from "@/lib/supabase";
import {
  Zap,
  ShieldCheck,
  Sparkles,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface CreateAccountScreenProps {
  onSuccess?: () => void;
  onBackToWelcome?: () => void;
  initialSignInMode?: boolean;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  onSuccess,
  onBackToWelcome,
  initialSignInMode = false,
}) => {
  const router = useRouter();
  const { setAuthStep, setShowWelcome } = useApp();
  const [isSignInMode, setIsSignInMode] = useState(initialSignInMode);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuthSuccess = () => {
    setShowWelcome(false);
    if (onSuccess) {
      onSuccess();
    } else {
      router.push("/");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    if (!isSignInMode && !fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    setIsLoading(true);
    try {
      if (!isSignInMode && fullName.trim()) {
        await supabaseService.addMemoryItem("user", fullName.trim());
      }
      // Artificial smooth transition for user feedback
      setTimeout(() => {
        setIsLoading(false);
        handleAuthSuccess();
      }, 500);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || "Failed to authenticate. Please try again.");
    }
  };

  const handleOAuth = (provider: "google" | "github") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      handleAuthSuccess();
    }, 400);
  };

  const valueProps = [
    {
      id: "tools",
      icon: Zap,
      title: "Access powerful AI tools",
      description: "Chat, write, research and more",
    },
    {
      id: "control",
      icon: ShieldCheck,
      title: "Your data, your control",
      description: "Private, secure, always",
    },
    {
      id: "grow",
      icon: Sparkles,
      title: "Build, learn, grow",
      description: "Turn your ideas into reality",
    },
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-y-auto bg-[#FAFAFA] flex flex-col justify-between select-none z-50">
      
      {/* ── Ambient Background 3D Glass Bubbles ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radiant Center Light Sheen */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] rounded-full bg-gradient-to-tr from-blue-200/25 via-sky-100/20 to-transparent blur-[120px]" />

        {/* Top Left Giant Frosted Bubble */}
        <GlassOrb
          size={500}
          className="absolute -top-[140px] -left-[140px] animate-float opacity-95"
          glowColor="rgba(47, 126, 218, 0.18)"
        />

        {/* Bottom Left Huge Bubble with Iridescent Glow */}
        <GlassOrb
          size={580}
          className="absolute -bottom-[170px] -left-[130px] animate-float opacity-90"
          glowColor="rgba(99, 102, 241, 0.2)"
        />

        {/* Top Right Curved Bubble Rim */}
        <GlassOrb
          size={680}
          className="absolute -top-[120px] -right-[160px] animate-float opacity-95"
          glowColor="rgba(56, 189, 248, 0.18)"
        />

        {/* Bottom Right Giant Luminous Sphere */}
        <GlassOrb
          size={620}
          className="absolute -bottom-[150px] -right-[110px] animate-float opacity-90"
          glowColor="rgba(47, 126, 218, 0.2)"
        />
      </div>

      {/* ── Top Header Navigation Bar ── */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 pt-6 pb-2 flex items-center justify-between shrink-0">
        {/* Brand Logo with 4-point Sparkle */}
        <Link
          id="brand-back-btn"
          href="/"
          onClick={() => {
            setAuthStep("welcome");
            onBackToWelcome?.();
          }}
          className="flex items-center gap-2.5 cursor-pointer group bg-transparent border-none p-0 focus:outline-none no-underline"
          title="Back to welcome screen"
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
        </Link>

        {/* Already have an account / Sign In toggle */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-medium text-[#9FA0B5]">
            {isSignInMode ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            id="auth-mode-toggle-btn"
            type="button"
            onClick={() => {
              setIsSignInMode((prev) => !prev);
              setErrorMsg(null);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#C6D1D7] text-xs font-semibold text-[#2F7EDA] hover:bg-white hover:border-[#2F7EDA]/60 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2F7EDA]/30"
          >
            <span>{isSignInMode ? "Sign Up" : "Sign In"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── Main Two-Column Content (Matching Design Image 2) ── */}
      <main className="relative z-10 flex-1 flex items-center justify-center max-w-6xl w-full mx-auto px-6 md:px-12 py-3 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center w-full my-auto">
          
          {/* ── Left Column: Value Propositions & 3D Star ── */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-5 text-left">
            
            {/* 3D Sapphire Star inside Glass Vessel */}
            <div className="relative flex items-center justify-center -ml-2">
              <div className="absolute w-32 h-32 md:w-36 md:h-36 rounded-full glass-vessel" />
              <SapphireStar size={115} className="relative z-10" />
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <h1 className="text-3xl md:text-4xl lg:text-[2.65rem] font-extrabold tracking-tight text-[#2E303D] leading-[1.15]">
                Build Your <br />
                <span className="text-[#2F7EDA]">AI Journey</span>
              </h1>
              <p className="text-xs md:text-sm text-[#9FA0B5] font-normal leading-relaxed max-w-sm pt-0.5">
                Create your account and get started with AI Assist. Ask, create, research and build — all in one place.
              </p>
            </div>

            {/* 3 Value Proposition Items */}
            <div className="space-y-3.5 pt-1 w-full max-w-sm">
              {valueProps.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center gap-3.5 group">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-blue-500/10 border border-blue-200/60 flex items-center justify-center text-[#2F7EDA] shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs md:text-sm font-bold text-[#2E303D]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] md:text-xs text-[#9FA0B5]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right Column: Frosted Glass Form Card ── */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end w-full">
            <div className="w-full max-w-lg p-6 md:p-8 rounded-[32px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_25px_60px_-15px_rgba(47,126,218,0.14),inset_0_2px_3px_#FFFFFF] flex flex-col space-y-4 md:space-y-4.5">
              
              {/* Card Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-2xl md:text-[1.65rem] font-extrabold text-[#2E303D] tracking-tight">
                  {isSignInMode ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-xs md:text-sm text-[#9FA0B5]">
                  {isSignInMode
                    ? "Sign in to access your intelligence workspace."
                    : "Join AI Assist and start your journey today."}
                </p>
              </div>

              {/* OAuth Social Buttons (Side by Side) */}
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                {/* Google Button */}
                <button
                  id="create-account-google-btn"
                  type="button"
                  onClick={() => handleOAuth("google")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/90 border border-[#C6D1D7]/80 text-xs font-semibold text-[#2E303D] hover:bg-white hover:border-[#2F7EDA]/50 hover:shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F7EDA]/20"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* GitHub Button */}
                <button
                  id="create-account-github-btn"
                  type="button"
                  onClick={() => handleOAuth("github")}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-white/90 border border-[#C6D1D7]/80 text-xs font-semibold text-[#2E303D] hover:bg-white hover:border-[#2F7EDA]/50 hover:shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F7EDA]/20"
                >
                  <svg className="w-4 h-4 fill-current text-[#2E303D] shrink-0" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-0.5">
                <div className="w-full border-t border-[#C6D1D7]/70" />
                <span className="absolute bg-[#EDEFF3] px-3 py-0.5 rounded-full text-[10px] font-semibold text-[#9FA0B5] uppercase tracking-wider">
                  OR
                </span>
              </div>

              {/* Error Message if any */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium animate-in fade-in">
                  {errorMsg}
                </div>
              )}

              {/* Inputs Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3">
                {/* Full Name field (Only shown for Create Account) */}
                {!isSignInMode && (
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#555663] block">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-[#9FA0B5] absolute left-3.5 pointer-events-none" />
                      <input
                        id="create-account-fullname-input"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 border border-[#C6D1D7] text-xs font-medium text-[#2E303D] placeholder:text-[#9FA0B5] focus:outline-none focus:border-[#2F7EDA] focus:ring-2 focus:ring-[#2F7EDA]/20 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address field */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#555663] block">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#9FA0B5] absolute left-3.5 pointer-events-none" />
                    <input
                      id="create-account-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 border border-[#C6D1D7] text-xs font-medium text-[#2E303D] placeholder:text-[#9FA0B5] focus:outline-none focus:border-[#2F7EDA] focus:ring-2 focus:ring-[#2F7EDA]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#555663] block">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-[#9FA0B5] absolute left-3.5 pointer-events-none" />
                    <input
                      id="create-account-password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignInMode ? "Enter your password" : "Create a strong password"}
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/70 border border-[#C6D1D7] text-xs font-medium text-[#2E303D] placeholder:text-[#9FA0B5] focus:outline-none focus:border-[#2F7EDA] focus:ring-2 focus:ring-[#2F7EDA]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 text-[#9FA0B5] hover:text-[#555663] cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-1.5">
                  <button
                    id="create-account-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full group py-3 rounded-full gradient-blue-btn flex items-center justify-center gap-2 text-sm font-bold tracking-wide cursor-pointer shadow-lg shadow-blue-500/30 hover:brightness-105 active:scale-98 transition-all focus:outline-none focus:ring-2 focus:ring-[#2F7EDA]/40"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        <span>{isSignInMode ? "Sign In" : "Create Account"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Terms & Privacy Footnote */}
              <p className="text-[10px] text-center text-[#9FA0B5] leading-relaxed pt-0.5">
                By creating an account, you agree to our{" "}
                <a href="#terms" className="text-[#2F7EDA] hover:underline font-medium">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#privacy" className="text-[#2F7EDA] hover:underline font-medium">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer Spacer ── */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-1 shrink-0" />
    </div>
  );
};
