import { createClient } from "@/utils/supabase/server";

export async function getUserInfo() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    email:user.email,
    id: user.id,
    name: user.user_metadata?.name || user.email?.split("@")[0],
    avatarUrl: user.user_metadata?.avatar_url || "/default-avatar.png",
    role: user.user_metadata?.role || "User",
    userPId: user.user_metadata?.prisma_user_id || null,
  };
}
