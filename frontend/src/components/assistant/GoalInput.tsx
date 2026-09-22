"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/store";
import { Paperclip, UploadCloud, Mic, Send, Sparkles } from "lucide-react";

interface GoalInputProps {
  onExecute?: (goal: string, agentMode?: string) => void;
  agentMode?: string;
  disabled?: boolean;
}

export const GoalInput: React.FC<GoalInputProps> = ({ onExecute, agentMode = "GENERAL", disabled = false }) => {
  const [goal, setGoal] = useState("");
  const { executeGoal } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || disabled) return;
    if (onExecute) {
      onExecute(goal, agentMode);
    } else {
      executeGoal(goal, agentMode);
    }
    setGoal("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto flex items-center gap-2 p-2 rounded-full liquid-glass-input transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400/30"
    >
      {/* Left Attachment Icon Button */}
      <button
        type="button"
        title="Attach context or file"
        className="w-9 h-9 rounded-full bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 text-muted-foreground hover:text-foreground hover:bg-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
      >
        <Paperclip className="w-4 h-4" />
      </button>

      {/* Center Input Field */}
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled}
        className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm font-medium px-2"
      />

      {/* Right Actions Cluster */}
      <div className="flex items-center gap-1.5 pr-0.5">
        {/* Upload Button */}
        <button
          type="button"
          title="Upload document"
          className="w-9 h-9 rounded-full bg-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
        </button>

        {/* Mic Voice Button */}
        <button
          type="button"
          title="Voice command"
          className="w-9 h-9 rounded-full bg-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all cursor-pointer"
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Circular Vibrant Blue Send Button */}
        <button
          type="submit"
          disabled={!goal.trim() || disabled}
          title="Send message"
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
            goal.trim()
              ? "bg-gradient-to-tr from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95"
              : "bg-blue-500/30 text-white/50 cursor-not-allowed"
          }`}
        >
          <Send className="w-4 h-4 -rotate-45 -translate-y-0.5 translate-x-0.5 fill-current" />
        </button>
      </div>
    </form>
  );
};
