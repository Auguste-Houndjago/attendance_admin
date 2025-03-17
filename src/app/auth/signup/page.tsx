import Link from 'next/link';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function Signup({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: { user } } = await supabase.auth.getUser();

  if (user?.email) {
    return redirect('/');
  }

  const signUp = async (formData: FormData) => {
    'use server';

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
        emailRedirectTo: "https://attendance-admin-lyart.vercel.app/auth/callback",
      },
    });

    if (error) {
      return redirect('/auth/signup?message=Could not authenticate user');
    }

    return redirect(`/auth/confirm?message=${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 rounded-lg shadow-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-11 items-center justify-center rounded-full border border-gray-300">
            <svg className="stroke-gray-800" width="20" height="20" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <h1>Schule</h1>
        </div>

        {searchParams?.message ? (
          <div className="p-4 border border-green-400 text-green-700 rounded">
         
            <p>
              ( <strong>{searchParams.message}</strong> ) 
            </p>
           
          </div>
        ) : (
          <form action={signUp} className="space-y-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="hi@yourcompany.com" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter your password" required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" required />
              </div>
            </div>

            {searchParams?.message && searchParams.message !== 'Signup successful' && (
              <p className="text-red-500 text-center">{searchParams.message}</p>
            )}

            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-500">Or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <Button variant="outline" className="w-full">Sign Up with Google</Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}