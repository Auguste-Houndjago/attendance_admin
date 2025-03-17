
'use client'
import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import * as authActions from '@/lib/auth';
import { getAuthStatus } from '../app/auth/actions';

interface UserMetadata {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: UserMetadata) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signInWithGitHub: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const signIn = useCallback(async (email: string, password: string) => {
 await authActions.signIn(email, password);
 const { data } = await supabase.auth.getUser();
 setUser(data.user);
 const { data: sessionData } = await supabase.auth.getSession();
 setSession(sessionData.session);
  
  }, []);

  const signInWithGoogle = useCallback(async () => {
        await authActions.signInWithGoogle();
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);
  }, []);


  const signInWithGitHub = useCallback(async () => {
    await authActions.signInWithGitHub();
    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    const { data: sessionData } = await supabase.auth.getSession();
    setSession(sessionData.session);
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata?: UserMetadata) => {
    const { error } = await authActions.signUp(email, password, metadata);
    
    if (error) {
    
      console.error("Error signing up:", error);
      return;
    }
  
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Error fetching user:", userError);
      setUser(null); 
    } else {
      setUser(userData.user);
    }
  
    const { data: sessionData } = await supabase.auth.getSession();
    setSession(sessionData.session);
  }, []);

  const signOut = useCallback(async () => {
    await authActions.signOut();
    setUser(null); 
    setSession(null); 
  }, []);

  const resetPassword = useCallback(async (email: string) => {
 await authActions.resetPassword(email);
      
 
  }, []);

  const updateProfile = useCallback(async (data: UserMetadata) => {
    try {
      if (!user) throw new Error('No authenticated user');

      const result = await authActions.updateProfile(user.id, data);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
    } catch (err) {
      console.error('Profile update failed', err);
    }
  }, [user]);

  const contextValue = useMemo(() => ({
    user,
    session,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }), [user, session, signIn, signInWithGoogle, signInWithGitHub, signUp, signOut, resetPassword, updateProfile]);

  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setSession(session || null);
    
      if (event === 'SIGNED_IN' && session?.user) {
        const provider = session.user.app_metadata.provider;
        if (provider === 'google' || provider === 'github') {
          getAuthStatus();
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};