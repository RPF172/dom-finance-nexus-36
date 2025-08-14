export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          admin_user_id: string
          application_id: string
          created_at: string | null
          id: string
          notes: string | null
          rejection_reason: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          application_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          rejection_reason?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          application_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          rejection_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          collar_type: string
          created_at: string | null
          email: string
          financial_level: string | null
          first_act_of_obedience: string
          greatest_weakness: string
          highest_tribute: number
          id: string
          is_owned: string
          most_humiliating_act: string
          motivating_punishment: string
          name: string
          obedience_level: number
          proof_of_obedience: string | null
          public_failure_consent: string
          reaction_to_failure: string
          reason: string | null
          reference_id: string
          rejected_at: string | null
          rejection_reason: string | null
          ritual_frequency: string
          role_in_hierarchy: string
          status: string
          submission_level: string | null
          submission_pledge: string
          username: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          collar_type: string
          created_at?: string | null
          email: string
          financial_level?: string | null
          first_act_of_obedience: string
          greatest_weakness: string
          highest_tribute?: number
          id?: string
          is_owned: string
          most_humiliating_act: string
          motivating_punishment: string
          name: string
          obedience_level: number
          proof_of_obedience?: string | null
          public_failure_consent: string
          reaction_to_failure: string
          reason?: string | null
          reference_id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          ritual_frequency: string
          role_in_hierarchy: string
          status?: string
          submission_level?: string | null
          submission_pledge: string
          username: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          collar_type?: string
          created_at?: string | null
          email?: string
          financial_level?: string | null
          first_act_of_obedience?: string
          greatest_weakness?: string
          highest_tribute?: number
          id?: string
          is_owned?: string
          most_humiliating_act?: string
          motivating_punishment?: string
          name?: string
          obedience_level?: number
          proof_of_obedience?: string | null
          public_failure_consent?: string
          reaction_to_failure?: string
          reason?: string | null
          reference_id?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          ritual_frequency?: string
          role_in_hierarchy?: string
          status?: string
          submission_level?: string | null
          submission_pledge?: string
          username?: string
        }
        Relationships: []
      }
      assignments: {
        Row: {
          created_at: string
          deadline: string | null
          description: string
          humiliation_score: number | null
          id: string
          instructions: string
          module_number: number
          objective: string
          requires_proof: boolean
          review_notes: string | null
          reviewed_by: string | null
          status: string
          submission_date: string | null
          submission_media: Json | null
          submission_text: string | null
          title: string
          updated_at: string
          user_id: string
          week_id: string | null
          week_number: number
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          description: string
          humiliation_score?: number | null
          id?: string
          instructions: string
          module_number: number
          objective: string
          requires_proof?: boolean
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
          submission_date?: string | null
          submission_media?: Json | null
          submission_text?: string | null
          title: string
          updated_at?: string
          user_id: string
          week_id?: string | null
          week_number: number
        }
        Update: {
          created_at?: string
          deadline?: string | null
          description?: string
          humiliation_score?: number | null
          id?: string
          instructions?: string
          module_number?: number
          objective?: string
          requires_proof?: boolean
          review_notes?: string | null
          reviewed_by?: string | null
          status?: string
          submission_date?: string | null
          submission_media?: Json | null
          submission_text?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          week_id?: string | null
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "assignments_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          current_progress: number
          id: string
          joined_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          joined_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          current_progress?: number
          id?: string
          joined_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      chapters: {
        Row: {
          body_text: string | null
          created_at: string | null
          featured_image_url: string | null
          id: string
          module_id: string | null
          order_index: number
          published: boolean
          title: string
          updated_at: string | null
        }
        Insert: {
          body_text?: string | null
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          module_id?: string | null
          order_index?: number
          published?: boolean
          title: string
          updated_at?: string | null
        }
        Update: {
          body_text?: string | null
          created_at?: string | null
          featured_image_url?: string | null
          id?: string
          module_id?: string | null
          order_index?: number
          published?: boolean
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      collars: {
        Row: {
          collar_id: string
          created_at: string
          id: string
          registered: boolean
          updated_at: string
        }
        Insert: {
          collar_id: string
          created_at?: string
          id?: string
          registered?: boolean
          updated_at?: string
        }
        Update: {
          collar_id?: string
          created_at?: string
          id?: string
          registered?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      community_challenges: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          end_date: string
          id: string
          is_active: boolean
          reward_points: number
          start_date: string
          target_value: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty?: string
          end_date: string
          id?: string
          is_active?: boolean
          reward_points?: number
          start_date?: string
          target_value?: number
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          end_date?: string
          id?: string
          is_active?: boolean
          reward_points?: number
          start_date?: string
          target_value?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_sequence: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          module_id: string | null
          sequence_order: number
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          module_id?: string | null
          sequence_order: number
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          module_id?: string | null
          sequence_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_sequence_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          content: string | null
          content_id: string
          content_type: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          title: string | null
          version_number: number
        }
        Insert: {
          content?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          title?: string | null
          version_number?: number
        }
        Update: {
          content?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          title?: string | null
          version_number?: number
        }
        Relationships: []
      }
      discussion_likes: {
        Row: {
          created_at: string
          discussion_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discussion_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discussion_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string
          discussion_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_discussion_replies_discussion_id"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "peer_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_discussion_replies_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      dom_token: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
        }
        Relationships: []
      }
      emails: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string | null
          source: string | null
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string | null
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          source?: string | null
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_analytics: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          metric_type: string
          metric_value: number
          recorded_at: string
          user_id: string
          week_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_type: string
          metric_value: number
          recorded_at?: string
          user_id: string
          week_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          recorded_at?: string
          user_id?: string
          week_id?: string | null
        }
        Relationships: []
      }
      learning_sessions: {
        Row: {
          activities_completed: number | null
          created_at: string | null
          device_type: string | null
          duration_minutes: number | null
          focus_score: number | null
          id: string
          session_end: string | null
          session_start: string
          updated_at: string | null
          user_id: string
          week_id: string | null
        }
        Insert: {
          activities_completed?: number | null
          created_at?: string | null
          device_type?: string | null
          duration_minutes?: number | null
          focus_score?: number | null
          id?: string
          session_end?: string | null
          session_start?: string
          updated_at?: string | null
          user_id: string
          week_id?: string | null
        }
        Update: {
          activities_completed?: number | null
          created_at?: string | null
          device_type?: string | null
          duration_minutes?: number | null
          focus_score?: number | null
          id?: string
          session_end?: string | null
          session_start?: string
          updated_at?: string | null
          user_id?: string
          week_id?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          assignment_text: string | null
          body_text: string | null
          created_at: string | null
          estimated_time: number | null
          featured_image_url: string | null
          id: string
          module_id: string | null
          objective: string | null
          order_index: number
          published: boolean
          ritual_text: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assignment_text?: string | null
          body_text?: string | null
          created_at?: string | null
          estimated_time?: number | null
          featured_image_url?: string | null
          id?: string
          module_id?: string | null
          objective?: string | null
          order_index?: number
          published?: boolean
          ritual_text?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assignment_text?: string | null
          body_text?: string | null
          created_at?: string | null
          estimated_time?: number | null
          featured_image_url?: string | null
          id?: string
          module_id?: string | null
          objective?: string | null
          order_index?: number
          published?: boolean
          ritual_text?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      module_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
          week_module_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
          week_module_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
          week_module_id?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          published: boolean
          slug: string
          title: string
          updated_at: string | null
          year_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          published?: boolean
          slug: string
          title: string
          updated_at?: string | null
          year_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          published?: boolean
          slug?: string
          title?: string
          updated_at?: string | null
          year_id?: string
        }
        Relationships: []
      }
      obedience_points_ledger: {
        Row: {
          action_key: string | null
          action_type: string
          created_at: string
          id: string
          metadata: Json | null
          points: number
          user_id: string
        }
        Insert: {
          action_key?: string | null
          action_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          points: number
          user_id: string
        }
        Update: {
          action_key?: string | null
          action_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      obedience_tiers: {
        Row: {
          code: string
          created_at: string | null
          max_points: number | null
          min_points: number
          order_index: number
          title: string
          unlocks: Json
        }
        Insert: {
          code: string
          created_at?: string | null
          max_points?: number | null
          min_points: number
          order_index?: number
          title: string
          unlocks?: Json
        }
        Update: {
          code?: string
          created_at?: string | null
          max_points?: number | null
          min_points?: number
          order_index?: number
          title?: string
          unlocks?: Json
        }
        Relationships: []
      }
      peer_discussions: {
        Row: {
          content: string
          content_id: string
          content_type: string
          created_at: string
          id: string
          likes_count: number
          replies_count: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          likes_count?: number
          replies_count?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          likes_count?: number
          replies_count?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_peer_discussions_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          parent_comment_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          likes_count: number
          link_description: string | null
          link_image_url: string | null
          link_title: string | null
          link_url: string | null
          location: string | null
          media_urls: string[] | null
          post_type: Database["public"]["Enums"]["post_type"]
          privacy_level: Database["public"]["Enums"]["privacy_level"]
          shares_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          likes_count?: number
          link_description?: string | null
          link_image_url?: string | null
          link_title?: string | null
          link_url?: string | null
          location?: string | null
          media_urls?: string[] | null
          post_type?: Database["public"]["Enums"]["post_type"]
          privacy_level?: Database["public"]["Enums"]["privacy_level"]
          shares_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          likes_count?: number
          link_description?: string | null
          link_image_url?: string | null
          link_title?: string | null
          link_url?: string | null
          location?: string | null
          media_urls?: string[] | null
          post_type?: Database["public"]["Enums"]["post_type"]
          privacy_level?: Database["public"]["Enums"]["privacy_level"]
          shares_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_verified: boolean
          avatar_url: string | null
          bio: string | null
          collar_id: string | null
          cover_photo_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          interests: string[] | null
          is_premium: boolean
          location: string | null
          premium_color: string | null
          social_links: Json | null
          terms_accepted: boolean
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          age_verified?: boolean
          avatar_url?: string | null
          bio?: string | null
          collar_id?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean
          location?: string | null
          premium_color?: string | null
          social_links?: Json | null
          terms_accepted?: boolean
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          age_verified?: boolean
          avatar_url?: string | null
          bio?: string | null
          collar_id?: string | null
          cover_photo_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          interests?: string[] | null
          is_premium?: boolean
          location?: string | null
          premium_color?: string | null
          social_links?: Json | null
          terms_accepted?: boolean
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          answer: Json
          created_at: string | null
          explanation: string | null
          id: string
          lesson_id: string | null
          options: Json | null
          order_index: number
          question: string
          type: string
        }
        Insert: {
          answer: Json
          created_at?: string | null
          explanation?: string | null
          id?: string
          lesson_id?: string | null
          options?: Json | null
          order_index?: number
          question: string
          type: string
        }
        Update: {
          answer?: Json
          created_at?: string | null
          explanation?: string | null
          id?: string
          lesson_id?: string | null
          options?: Json | null
          order_index?: number
          question?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      review_steps: {
        Row: {
          created_at: string | null
          description: string
          id: string
          order_index: number
          updated_at: string | null
          week_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          order_index?: number
          updated_at?: string | null
          week_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          order_index?: number
          updated_at?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "review_steps_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      step_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          review_step_id: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          review_step_id?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          review_step_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "step_progress_review_step_id_fkey"
            columns: ["review_step_id"]
            isOneToOne: false
            referencedRelation: "review_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      study_group_members: {
        Row: {
          id: string
          joined_at: string
          study_group_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          study_group_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          study_group_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_study_group_members_study_group_id"
            columns: ["study_group_id"]
            isOneToOne: false
            referencedRelation: "study_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_study_group_members_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      study_groups: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          max_members: number
          name: string
          updated_at: string
          week_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_members?: number
          name: string
          updated_at?: string
          week_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          max_members?: number
          name?: string
          updated_at?: string
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_study_groups_created_by"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      submissions: {
        Row: {
          assignment_id: string | null
          id: string
          media_url: string | null
          metadata: Json | null
          submitted_at: string | null
          task_id: string | null
          text_response: string | null
          user_id: string
          week_id: string | null
        }
        Insert: {
          assignment_id?: string | null
          id?: string
          media_url?: string | null
          metadata?: Json | null
          submitted_at?: string | null
          task_id?: string | null
          text_response?: string | null
          user_id: string
          week_id?: string | null
        }
        Update: {
          assignment_id?: string | null
          id?: string
          media_url?: string | null
          metadata?: Json | null
          submitted_at?: string | null
          task_id?: string | null
          text_response?: string | null
          user_id?: string
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_amount: number | null
          subscription_end: string | null
          subscription_price_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_amount?: number | null
          subscription_end?: string | null
          subscription_price_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_amount?: number | null
          subscription_end?: string | null
          subscription_price_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
          week_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string | null
          week_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      tributes: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          status: string
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          status?: string
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_connections: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
          status: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
          status?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
          status?: string
        }
        Relationships: []
      }
      user_lesson_progress: {
        Row: {
          assignment_submitted: boolean
          completed: boolean
          completed_at: string | null
          content_read: boolean
          created_at: string | null
          id: string
          lesson_id: string | null
          quiz_completed: boolean
          quiz_score: number | null
          ritual_completed: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assignment_submitted?: boolean
          completed?: boolean
          completed_at?: string | null
          content_read?: boolean
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          quiz_completed?: boolean
          quiz_score?: number | null
          ritual_completed?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assignment_submitted?: boolean
          completed?: boolean
          completed_at?: string | null
          content_read?: boolean
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          quiz_completed?: boolean
          quiz_score?: number | null
          ritual_completed?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_obedience_summary: {
        Row: {
          alpha_approved: boolean
          created_at: string | null
          last_activity_at: string | null
          last_decay_run_at: string | null
          shame_mark: boolean
          tier_code: string | null
          total_points: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alpha_approved?: boolean
          created_at?: string | null
          last_activity_at?: string | null
          last_decay_run_at?: string | null
          shame_mark?: boolean
          tier_code?: string | null
          total_points?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alpha_approved?: boolean
          created_at?: string | null
          last_activity_at?: string | null
          last_decay_run_at?: string | null
          shame_mark?: boolean
          tier_code?: string | null
          total_points?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_obedience_summary_tier_code_fkey"
            columns: ["tier_code"]
            isOneToOne: false
            referencedRelation: "obedience_tiers"
            referencedColumns: ["code"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      week_modules: {
        Row: {
          content: string
          created_at: string | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
          week_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string | null
          week_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "week_modules_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      week_progress: {
        Row: {
          assignments_completed: number | null
          completed_at: string | null
          created_at: string | null
          current_step: string | null
          id: string
          last_activity_at: string | null
          modules_completed: number | null
          progress_percentage: number | null
          review_steps_completed: number | null
          started_at: string | null
          tasks_completed: number | null
          updated_at: string | null
          user_id: string
          week_id: string
        }
        Insert: {
          assignments_completed?: number | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: string | null
          id?: string
          last_activity_at?: string | null
          modules_completed?: number | null
          progress_percentage?: number | null
          review_steps_completed?: number | null
          started_at?: string | null
          tasks_completed?: number | null
          updated_at?: string | null
          user_id: string
          week_id: string
        }
        Update: {
          assignments_completed?: number | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: string | null
          id?: string
          last_activity_at?: string | null
          modules_completed?: number | null
          progress_percentage?: number | null
          review_steps_completed?: number | null
          started_at?: string | null
          tasks_completed?: number | null
          updated_at?: string | null
          user_id?: string
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "week_progress_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      weeks: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty_level:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          estimated_duration: number | null
          id: string
          objective: string | null
          points_reward: number | null
          prerequisites: Json | null
          title: string
          total_assignments: number | null
          total_modules: number | null
          total_tasks: number | null
          updated_at: string | null
          week_number: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty_level?:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          estimated_duration?: number | null
          id?: string
          objective?: string | null
          points_reward?: number | null
          prerequisites?: Json | null
          title: string
          total_assignments?: number | null
          total_modules?: number | null
          total_tasks?: number | null
          updated_at?: string | null
          week_number: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty_level?:
            | Database["public"]["Enums"]["difficulty_level"]
            | null
          estimated_duration?: number | null
          id?: string
          objective?: string | null
          points_reward?: number | null
          prerequisites?: Json | null
          title?: string
          total_assignments?: number | null
          total_modules?: number | null
          total_tasks?: number | null
          updated_at?: string | null
          week_number?: number
        }
        Relationships: []
      }
    }
    Views: {
      user_activities: {
        Row: {
          activity_type: string | null
          description: string | null
          id: string | null
          metadata: string | null
          occurred_at: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      are_users_connected: {
        Args: { user1_id: string; user2_id: string }
        Returns: boolean
      }
      award_op: {
        Args: {
          _action_key: string
          _action_type: string
          _base_points: number
          _limit_per_day?: number
          _metadata?: Json
          _user_id: string
          _window_hours?: number
        }
        Returns: number
      }
      calculate_week_progress_percentage: {
        Args: { _user_id: string; _week_id: string }
        Returns: number
      }
      check_email_exists: {
        Args: { email_to_check: string }
        Returns: boolean
      }
      check_week_prerequisites: {
        Args: { _user_id: string; _week_id: string }
        Returns: boolean
      }
      get_application_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          approved_count: number
          pending_count: number
          rejected_count: number
          total_count: number
        }[]
      }
      get_learning_insights: {
        Args: { _days_back?: number; _user_id: string }
        Returns: {
          avg_focus_score: number
          avg_session_duration: number
          completion_rate: number
          most_active_day: string
          total_minutes: number
          total_sessions: number
          weekly_progress: Json
        }[]
      }
      get_profile_overview: {
        Args: { _target_user_id: string; _viewer_user_id?: string }
        Returns: {
          avatar_url: string
          comments_received_count: number
          cover_photo_url: string
          display_name: string
          is_premium: boolean
          joined_at: string
          lessons_completed_count: number
          likes_received_count: number
          posts_count: number
          premium_color: string
          user_id: string
        }[]
      }
      get_recent_activity: {
        Args: {
          _limit?: number
          _target_user_id: string
          _viewer_user_id?: string
        }
        Returns: {
          activity_type: string
          description: string
          id: string
          occurred_at: string
          title: string
        }[]
      }
      get_tier_for_points: {
        Args: { _points: number }
        Returns: string
      }
      get_user_premium_status: {
        Args: { user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_lesson_unlocked: {
        Args: {
          _lesson_id: string
          _module_id: string
          _user_id: string
          _year_id: string
        }
        Returns: boolean
      }
      is_lesson_unlocked_new: {
        Args: { _lesson_id: string; _user_id: string }
        Returns: boolean
      }
      track_learning_session: {
        Args: {
          _activities_completed?: number
          _device_type?: string
          _duration_minutes: number
          _focus_score?: number
          _user_id: string
          _week_id: string
        }
        Returns: string
      }
      update_week_progress: {
        Args: { _user_id: string; _week_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user" | "pledge" | "alpha"
      difficulty_level: "beginner" | "intermediate" | "advanced" | "expert"
      post_type: "text" | "image" | "video" | "link"
      privacy_level: "public" | "friends" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "pledge", "alpha"],
      difficulty_level: ["beginner", "intermediate", "advanced", "expert"],
      post_type: ["text", "image", "video", "link"],
      privacy_level: ["public", "friends", "private"],
    },
  },
} as const
