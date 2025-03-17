import { createClient } from "@/utils/supabase/server";
import { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    console.error("Code OTP manquant !");
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Erreur lors de l'échange du code :", error.message);
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  // Rediriger vers la page register après l'authentification réussie
  return NextResponse.redirect(new URL("/auth/register", requestUrl.origin));
}






// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url)
//   const token_hash = searchParams.get('token_hash')
//   const type = searchParams.get('type') as EmailOtpType | null


//   if (token_hash && type) {
//     const supabase = await createClient()

//     const { error } = await supabase.auth.verifyOtp({
//       type,
//       token_hash,
//     })
//     if (!error) {
     
//      return redirect('/auth/register')
//     }
//   }


//  return redirect('/error')
// }
