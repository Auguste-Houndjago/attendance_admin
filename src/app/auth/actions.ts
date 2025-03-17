'use server';


import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";


export const getAuthStatus = async () => {
  const supabase = await  createClient();

  const {
    data: { user },
    } = await supabase.auth.getUser();
  
  if (!user?.id || !user?.email) {
    return { success: false }
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      id: user.id,
      email: user.email
    }
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: `${user.user_metadata.name || user.email.split('@')[0]}`,
        avatar_url: user.user_metadata.avatar_url || null,
        phone: user.user_metadata.phone || null,
        role:user.user_metadata.role || null,
      }
    });
  }


  return { success: true };
}


