'use server'

import { createClient } from '@/utils/supabase/server'
import prisma from '@/lib/prisma'

export async function getUserData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, isAdmin: false, avatarUrl: null }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { avatar_url: true }
  })

  const isAdmin = user.email === process.env.ADMIN_EMAIL
  const avatarUrl = dbUser?.avatar_url || user.user_metadata?.avatar_url

  return { user, isAdmin, avatarUrl }
}
