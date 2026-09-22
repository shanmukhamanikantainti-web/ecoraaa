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
          content: string;
          created_at: string | null;
          id: string;
          mission_id: string | null;
          project_id: string | null;
          role: string;
          status: string | null;
          steps: Json | null;
          timestamp: string;
          tools_used: string[] | null;
          user_id: string | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id: string;
          mission_id?: string | null;
          project_id?: string | null;
          role: string;
          status?: string | null;
          steps?: Json | null;
          timestamp: string;
          tools_used?: string[] | null;
          user_id?: string | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          mission_id?: string | null;
          project_id?: string | null;
          role?: string;
          status?: string | null;
          steps?: Json | null;
          timestamp?: string;
          tools_used?: string[] | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      memory_items: {
        Row: {
          category: string;
          created_at: string | null;
          id: string;
          value: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          id?: string;
          value: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          id?: string;
          value?: string;
        };
        Relationships: [];
      };
      missions: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          goal: string;
          id: string;
          result: string | null;
          status: string;
          steps: Json | null;
          workspace: string | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          goal: string;
          id: string;
          result?: string | null;
          status: string;
          steps?: Json | null;
          workspace?: string | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          goal?: string;
          id?: string;
          result?: string | null;
          status?: string;
          steps?: Json | null;
          workspace?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id: string;
          name: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
          user_id?: string;
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
