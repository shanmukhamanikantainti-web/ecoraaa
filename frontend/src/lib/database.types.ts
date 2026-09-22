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
          },
          {
            foreignKeyName: "fk_chat_messages_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      memory_items: {
        Row: {
          category: string;
          created_at: string | null;
          id: string;
          user_id: string | null;
          value: string;
        };
        Insert: {
          category: string;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
          value: string;
        };
        Update: {
          category?: string;
          created_at?: string | null;
          id?: string;
          user_id?: string | null;
          value?: string;
        };
        Relationships: [
          {
            foreignKeyName: "memory_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      missions: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          goal: string;
          id: string;
          project_id: string | null;
          result: string | null;
          status: string;
          steps: Json | null;
          user_id: string | null;
          workspace: string | null;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          goal: string;
          id: string;
          project_id?: string | null;
          result?: string | null;
          status: string;
          steps?: Json | null;
          user_id?: string | null;
          workspace?: string | null;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          goal?: string | null;
          id?: string;
          project_id?: string | null;
          result?: string | null;
          status?: string;
          steps?: Json | null;
          user_id?: string | null;
          workspace?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "missions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "missions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "fk_projects_user";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          name: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          id: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
