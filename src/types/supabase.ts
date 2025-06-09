export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      medicines: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image_url: string | null
          category_id: string | null
          in_stock: boolean
          is_emergency: boolean
          created_at: string
          updated_at: string
          manufacturer: string | null
          dosage_form: string | null
          strength: string | null
          package_size: string | null
          requires_prescription: boolean
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image_url?: string | null
          category_id?: string | null
          in_stock?: boolean
          is_emergency?: boolean
          created_at?: string
          updated_at?: string
          manufacturer?: string | null
          dosage_form?: string | null
          strength?: string | null
          package_size?: string | null
          requires_prescription?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image_url?: string | null
          category_id?: string | null
          in_stock?: boolean
          is_emergency?: boolean
          created_at?: string
          updated_at?: string
          manufacturer?: string | null
          dosage_form?: string | null
          strength?: string | null
          package_size?: string | null
          requires_prescription?: boolean
        }
      }
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
      compositions: {
        Row: {
          id: string
          medicine_id: string
          ingredient: string
          amount: string | null
          unit: string | null
          created_at: string
        }
        Insert: {
          id?: string
          medicine_id: string
          ingredient: string
          amount?: string | null
          unit?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          medicine_id?: string
          ingredient?: string
          amount?: string | null
          unit?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: string
          total_amount: number
          created_at: string
          updated_at: string
          delivery_address: string | null
          is_emergency: boolean
          estimated_delivery: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          total_amount: number
          created_at?: string
          updated_at?: string
          delivery_address?: string | null
          is_emergency?: boolean
          estimated_delivery?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          total_amount?: number
          created_at?: string
          updated_at?: string
          delivery_address?: string | null
          is_emergency?: boolean
          estimated_delivery?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          medicine_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          medicine_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          medicine_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
      price_comparisons: {
        Row: {
          id: string
          medicine_id: string
          store_name: string
          price: number
          url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          medicine_id: string
          store_name: string
          price: number
          url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          medicine_id?: string
          store_name?: string
          price?: number
          url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          phone_number: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}