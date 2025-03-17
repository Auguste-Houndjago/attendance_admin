"use server";

import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const origin = headers().get('origin');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const supabase = await createClient();

  if (password !== confirmPassword) {
    return redirect('/signup?message=Passwords do not match');
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

  return redirect(`/auth/confirm?message=${email}`);
}
