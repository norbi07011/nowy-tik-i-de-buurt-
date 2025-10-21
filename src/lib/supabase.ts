import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Create client without throwing error if env vars are missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
}

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          account_type: 'user' | 'business'
          profile_image?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          account_type: 'user' | 'business'
          profile_image?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          account_type?: 'user' | 'business'
          profile_image?: string
          created_at?: string
          updated_at?: string
        }
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string
          business_name: string
          owner_name: string
          phone?: string
          address?: string
          category?: string
          description?: string
          website?: string
          cover_image?: string
          is_verified: boolean
          is_premium: boolean
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          owner_name: string
          phone?: string
          address?: string
          category?: string
          description?: string
          website?: string
          cover_image?: string
          is_verified?: boolean
          is_premium?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          owner_name?: string
          phone?: string
          address?: string
          category?: string
          description?: string
          website?: string
          cover_image?: string
          is_verified?: boolean
          is_premium?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          content: string
          image_url?: string
          likes_count: number
          comments_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          image_url?: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          image_url?: string
          likes_count?: number
          comments_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
