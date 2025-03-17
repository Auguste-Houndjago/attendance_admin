'use server'

import { createClient } from '@/utils/supabase/server'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export async function signIn(request: NextRequest, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}



export const signUp = async (formData: FormData) => {


  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const supabase = await createClient();

  if (password !== confirmPassword) {
    return redirect('/auth/signup?message=Passwords do not match');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });


  
  if (error) {
    return redirect('/auth/signup?message=Could not authenticate user');
  }

  return redirect(
    `/auth/confirm?message=Check email(${email}) to continue sign in process`
  );
};





export async function logOut(request: NextRequest) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  redirect('/login')
}

export async function signOut() {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      redirect('/login?error=Failed to sign out');
    }

    revalidatePath('/', 'layout');
    redirect('/login');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    redirect('/login?error=Failed to sign out');
  }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase.auth.updateUser({
    data: { name, phone }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  return { success: true }
}