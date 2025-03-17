import Link from "next/link"
import { SubmitButton } from "./submit-button"
import { signIn, signUp } from "./actions"

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center"> 

      <div className="flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 relative">
      <h1 className="text-xl font-semibold text-center">Bienvenue </h1>

        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <SubmitButton
            formAction={signIn}
            className="border border-input bg-gray-300 font-semibold transition-all dark:bg-background shadow-sm hover:bg-accent hover:text-accent-foreground rounded-md px-4 py-2  mb-2"
            pendingText="Signing In..."
          >
            Sign In
          </SubmitButton>

          <p className="text-sm text-center text-muted-foreground">
          Déjà un compte ?{' '}
             
          <Link href={"/auth/signup"} className="text-primary hover:underline" about="signup">
          signup
          </Link>
        </p>
          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
