import { useMutation } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const STORAGE_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`;

interface RegisterTeacherData {
  name: string;
  email: string;
  phone: string | null;
  avatarFile: File | null;
}

export const useRegisterTeacher = () => {
  return useMutation({
    mutationFn: async (data: RegisterTeacherData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non authentifié.');

      let avatarUrl = null;
      if (data.avatarFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`${user.id}/avatar.png`, data.avatarFile, {
            contentType: 'image/png',
            upsert: true,
          });

        if (uploadError) throw uploadError;


        avatarUrl = `${STORAGE_URL}/avatars/${uploadData.path}`;
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: user.email,
          avatar_url: avatarUrl,
          phone: data.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de l'enregistrement");
      }

      return response.json();
    },
  });
};
