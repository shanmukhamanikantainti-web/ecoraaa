"use client";

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/store";
import { WelcomeScreen } from "@/components/assistant/WelcomeScreen";
import { CreateAccountScreen } from "@/components/auth/CreateAccountScreen";
import { SapphireStar } from "@/components/ui/SapphireStar";
import { GoalInput } from "@/components/assistant/GoalInput";
import { AgentArcPanel } from "@/components/assistant/AgentArcPanel";
import { ChatStream } from "@/components/assistant/ChatStream";

export default function AssistantPage() {
  const {
    chatMessages,
    showWelcome,
    setShowWelcome,
    authStep,
    setAuthStep,
    executeGoal,
  } = useApp();
  const [activeAgent, setActiveAgent] = useState("general");
  const [pendingGoal, setPendingGoal] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const hasUserMessages = chatMessages.some((m) => m.role === "user");

  useEffect(() => {
    if (hasUserMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, hasUserMessages]);

  const handleGetStarted = (starterGoal?: string) => {
    if (starterGoal) {
      setPendingGoal(starterGoal);
    }
    // Transition to the Create Account screen requested in design image
    setAuthStep("create-account");
  };

  const handleAuthSuccess = () => {
    setShowWelcome(false);
    if (pendingGoal) {
      const goalToRun = pendingGoal;
      setPendingGoal(null);
      setTimeout(() => {
        executeGoal(goalToRun);
      }, 150);
    }
  };

  if (showWelcome) {
    if (authStep === "create-account") {
      return (
        <CreateAccountScreen
          onSuccess={handleAuthSuccess}
          onBackToWelcome={() => setAuthStep("welcome")}
        />
      );
    }
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }


  return (
    <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 min-h-[calc(100vh-6.5rem)] px-2">
      {/* ── Main Center Conversational Canvas ── */}
      <div className="flex-1 flex flex-col items-center justify-between w-full h-full min-h-[580px] max-w-4xl mx-auto py-4">
        {/* If no user messages yet, show the central hero design with HEY ! HOW ARE YOU */}
        {!hasUserMessages ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500 my-auto">
            {/* 3D Animated Sapphire Crystal Star Emblem */}
            <div className="my-1">
              <SapphireStar size={125} />
            </div>

            {/* Hero Greeting Text */}
            <div className="space-y-2 max-w-lg">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
                HEY ! <span className="text-blue-600 dark:text-blue-400">HOW ARE YOU</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-4">
                Ask anything, get things done. I&apos;m here to help you code, research, build and create.
              </p>
            </div>
          </div>
        ) : (
          /* Active Chat Stream View */
          <div className="w-full flex-1 overflow-y-auto px-2 space-y-4 max-h-[calc(100vh-14rem)]">
            <ChatStream messages={chatMessages} />
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* ── Bottom Floating Liquid Glass Capsule Input Bar ── */}
        <div className="w-full pt-4 mt-auto">
          <GoalInput agentMode={activeAgent} />
        </div>
      </div>

      {/* ── Right Curved Arc AI Agents Panel ── */}
      <div className="hidden lg:flex shrink-0">
        <AgentArcPanel
          activeAgentId={activeAgent}
          onSelectAgent={(agentId) => setActiveAgent(agentId)}
        />
      </div>
    </div>
  );
}
