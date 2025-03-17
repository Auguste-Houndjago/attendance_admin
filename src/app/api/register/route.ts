import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { name, email, avatar_url, phone } = await request.json();

    if (!avatar_url) {
      console.log('missing avatar_url');
    }

    if (email !== authUser.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 1. Upsert dans Prisma pour récupérer l'ID utilisateur
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, avatar_url, phone },
      create: { email, name, avatar_url, phone }
    });

    // 2. Mise à jour des métadonnées de Supabase avec l'ID Prisma
    const { error: userError } = await supabase.auth.updateUser({
      data: {
        name: name,
        phone: phone,
        avatar_url,
        role: "ADMIN",
        prisma_user_id: user.id  
      },
    });

    if (userError) {
      console.log("can't update user in supabase metadata");
      throw new Error(userError.message);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}































