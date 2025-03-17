
'use server'
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';


export async function signIn(email: string, password: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) throw error;

    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Sign-in failed' 
    };
  }
}


export async function signUp(email: string, password: string, metadata?: {
  name?: string;
  phone?: string;
  avatar_url?: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          name: metadata?.name,
          phone: metadata?.phone,
          avatar_url: metadata?.avatar_url
        }
      }
    });

    if (error) {
        return redirect('/auth/signup?message=Could not authenticate user');
      }
    
      return redirect(
        `/auth/signup?message=Check email(${email}) to continue sign in process`
      );

  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Sign up failed' 
    };
  }
}

// Connexion avec OAuth (Google)
export async function signInWithGoogle() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });

    if (error) throw error;

    return { success: true, url: data.url };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Google sign-in failed' 
    };
  }
}

// Connexion avec GitHub
export async function signInWithGitHub() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });

    if (error) throw error;

    return { success: true, url: data.url };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'GitHub sign-in failed' 
    };
  }
}

// Déconnexion
export async function signOut() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Sign out failed' 
    };
  }
}

// Réinitialisation de mot de passe
export async function resetPassword(email: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`
    });

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    return { 
      success: false, 
      error: err.message || 'Password reset failed' 
    };
  }
}

// Mise à jour du profil 
export async function updateProfile(userId: string, data: {
  name?: string;
  phone?: string;
  avatar_url?: string;
}) {
  try {
    const supabase = await createClient();
    
    // Mise à jour dans Auth
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        name: data.name,
        phone: data.phone,
        avatar_url: data.avatar_url
      }
    });

    if (authError) throw authError;

    // Mise à jour dans Prisma
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    });
    
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error('Profile update error:', error);
    return { success: false, error: error.message };
  }
}

