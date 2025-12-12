'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { userLogin, userRegister, userMe, userLogout, userUpdateProfile } from './user-api';
import type { User as ApiUser } from './user-api';
import { initializeUserDataIsolation, cleanupUserData, cleanupLegacySharedData } from './user-data-utils';

// Re-export the User type from the API
export type User = ApiUser;

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: { fullName: string; email: string; password: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

// Store user data key for localStorage
const USER_STORAGE_KEY = 'auralearn_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount - NEVER auto-logout
  useEffect(() => {
    const initializeAuth = async () => {
      // Skip user authentication verification on admin routes
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        setLoading(false);
        return;
      }

      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Try to sync with backend silently in background
          // NEVER log user out automatically - only on explicit signOut()
          try {
            const response = await userMe();
            if (response?.user) {
              // Update with fresh data from backend
              setUser(response.user);
              console.log('✅ Session synced with backend');
            }
          } catch (error) {
            // ALWAYS keep user logged in regardless of backend response
            // Backend might be down, network might be slow, or session might have expired
            // User will remain logged in until they explicitly click Sign Out
            console.log('ℹ️ Backend sync failed, keeping local session active:', error);
          }
        } catch (error) {
          // Error parsing saved user data - keep user logged in anyway
          // They can manually log out if there's an issue
          console.error('⚠️ Error parsing saved user, keeping session:', error);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await userLogin({ email, password });
      setUser(response.user);
      
      // Initialize user data isolation for this user
      if (response.user?.id) {
        initializeUserDataIsolation(response.user.id);
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      return false;
    }
  };

  const signUp = async (userData: { fullName: string; email: string; password: string }): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await userRegister(userData);
      setUser(response.user);
      
      // Initialize user data isolation for this new user
      if (response.user?.id) {
        // Clean up any legacy shared data first
        cleanupLegacySharedData();
        initializeUserDataIsolation(response.user.id);
      }
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      setLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    // Get current user ID before clearing user state
    const currentUserId = user?.id;
    
    console.log('🚪 User explicitly signing out');
    
    try {
      // Attempt to notify backend about logout
      await userLogout();
      console.log('✅ Backend logout successful');
    } catch (error) {
      // Even if backend logout fails, still log out locally
      // User explicitly requested to sign out
      console.log('⚠️ Backend logout failed, but clearing local session anyway:', error);
    } finally {
      // ALWAYS clear user state when user explicitly signs out
      setUser(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      
      console.log('✅ Local session cleared');
      
      // Optional: Clean up user data on logout (uncomment if desired)
      // if (currentUserId) {
      //   cleanupUserData(currentUserId);
      // }
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const response = await userUpdateProfile(updates);
        setUser(response.user);
      } catch (error) {
        console.error('Update user error:', error);
        // Fallback to local update if API fails
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
      }
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 