'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [confirmationLink, setConfirmationLink] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setConfirmationLink(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `/auth/callback`,
        },

      });

      if (error) throw error;
      if (data.user) {
        setConfirmationLink(formData.email);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full b p-6 rounded-lg shadow-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-11 items-center justify-center rounded-full border border-gray-300">
          <svg className="stroke-gray-800" width="20" height="20" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
 <h1>Schule</h1>
        </div>

        {confirmationLink ? (
          <div className="p-4  border border-green-400 text-green-700 rounded">
            <strong>Signup Successful!</strong>
            <p>
      Please check your email ( <strong>{confirmationLink}</strong> ) to confirm your account.
    </p>
            <a href={`mailto:${confirmationLink}`}  target="_blank" className="text-blue-600 underline text-center">Confirmation Link</a>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="hi@yourcompany.com" required value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Enter your password" required value={formData.password} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm your password" required value={formData.confirmPassword} onChange={handleChange} />
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-500">Or</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <Button variant="outline" className="w-full">Sign Up with Google</Button>
      </div>
    </div>
  );
}
