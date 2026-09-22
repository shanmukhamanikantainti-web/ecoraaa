export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          id: string;
          role: "user" | "assistant" | "system";
          content: string;
          timestamp: string;
          mission_id: string | null;
          steps: Json | null;
          tools_used: string[] | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          role: "user" | "assistant" | "system";
          content: string;
          timestamp: string;
          mission_id?: string | null;
          steps?: Json | null;
          tools_used?: string[] | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          timestamp?: string;
          mission_id?: string | null;
          steps?: Json | null;
          tools_used?: string[] | null;
          status?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      memory_items: {
        Row: {
          id: string;
          category: "user" | "projects" | "preferences" | "goals";
          value: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          category: "user" | "projects" | "preferences" | "goals";
          value: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          category?: "user" | "projects" | "preferences" | "goals";
          value?: string;
          created_at?: string | null;
        };
        Relationships: [];
      };
      missions: {
        Row: {
          id: string;
          goal: string;
          status: string;
          steps: Json | null;
          result: string | null;
          workspace: string | null;
          created_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id: string;
          goal: string;
          status: string;
          steps?: Json | null;
          result?: string | null;
          workspace?: string | null;
          created_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          goal?: string;
          status?: string;
          steps?: Json | null;
          result?: string | null;
          workspace?: string | null;
          created_at?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
