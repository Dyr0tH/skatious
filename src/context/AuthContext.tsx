import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Get initial session with error handling for invalid refresh tokens
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          // If there's an error getting the session (likely due to invalid refresh token),
          // clear the auth state and sign out to remove stale tokens
          console.warn('Session error, clearing auth state:', error.message)
          await supabase.auth.signOut()
          setUser(null)
          setIsAdmin(false)
        } else {
          setUser(session?.user ?? null)
          if (session?.user) {
            checkAdminStatus(session.user.id)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        // Clear auth state on any error
        await supabase.auth.signOut()
        setUser(null)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully')
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
      }

      setUser(session?.user ?? null)
      if (session?.user) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()
      
      setIsAdmin(!!data)
    } catch (error) {
      console.error('Error checking admin status:', error)
      setIsAdmin(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      if (data.user) {
        // Wait a moment for the user to be fully created
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Create profile with all information including name
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: userData.full_name || '',
          email: email,
          mobile_number: userData.mobile_number || null,
          alternate_mobile: userData.alternate_mobile || null,
          country: userData.country || null,
          state: userData.state || null,
          city: userData.city || null,
          pin_code: userData.pin_code || null,
        })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Don't return error here as the user was created successfully
          // The profile can be created later
        }
      }

      return { error: null }
    } catch (err) {
      console.error('Signup error:', err)
      return { error: err }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}