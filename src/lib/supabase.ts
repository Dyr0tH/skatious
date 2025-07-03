import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          category_id: string
          sizes: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          category_id: string
          sizes: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          category_id?: string
          sizes?: string[]
          created_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          image_url: string
          alt_text: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          image_url: string
          alt_text?: string | null
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          image_url?: string
          alt_text?: string | null
          order_index?: number
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          mobile_number: string | null
          alternate_mobile: string | null
          country: string | null
          state: string | null
          city: string | null
          pin_code: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          mobile_number?: string | null
          alternate_mobile?: string | null
          country?: string | null
          state?: string | null
          city?: string | null
          pin_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          mobile_number?: string | null
          alternate_mobile?: string | null
          country?: string | null
          state?: string | null
          city?: string | null
          pin_code?: string | null
          created_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
        }
      }
      discount_codes: {
        Row: {
          id: string
          code: string
          discount_percentage: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_percentage: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_percentage?: number
          active?: boolean
          created_at?: string
        }
      }
      special_discount_settings: {
        Row: {
          id: string
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          active: boolean
          created_at?: string
        }
        Update: {
          id?: string
          active?: boolean
          created_at?: string
        }
      }
      user_dice_rolls: {
        Row: {
          id: string
          user_id: string
          roll_result: number
          discount_percentage: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          roll_result: number
          discount_percentage: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          roll_result?: number
          discount_percentage?: number
          created_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          product_id: string
          size: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          product_id: string
          size: string
          quantity: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          product_id?: string
          size?: string
          quantity?: number
          created_at?: string
        }
      }
    }
  }
}