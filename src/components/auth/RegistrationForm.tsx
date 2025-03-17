"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClient } from '@supabase/supabase-js'
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
  email: z.string().email("Veuillez entrer une adresse email valide"),
  phone: z.string().regex(/^\d{10}$/, "Le numéro doit contenir 10 chiffres").optional(),
  role: z.enum(["TEACHER", "ADMIN"]),
  avatar_url: z.string().optional(),
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function RegistrationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = React.useState(false)
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "TEACHER",
      name: "",
      email: "",
      phone: "",
      avatar_url: "",
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFile(event.target.files[0])
    }
  }

  async function uploadAvatar(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return publicUrl
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      let avatarUrl = ""
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile)
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, avatar_url: avatarUrl }),
      })

      if (!response.ok) {
        throw new Error("L'inscription a échoué")
      }

      toast({
        title: "Inscription réussie",
        description: "Vous pouvez maintenant vous connecter à votre compte",
      })
      router.push("/auth/login")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight">Inscription</CardTitle>
        <CardDescription className="text-zinc-500 dark:text-zinc-400">
          Créez un nouveau compte pour gérer vos présences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-900 dark:text-zinc-100">Nom</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John Doe" 
                      {...field}
                      className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </FormControl>
                  <FormDescription className="text-zinc-500 dark:text-zinc-400">
                    Optionnel mais recommandé
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-900 dark:text-zinc-100">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="john@example.com" 
                      type="email" 
                      required 
                      {...field}
                      className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-900 dark:text-zinc-100">Téléphone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="0612345678" 
                      type="tel" 
                      {...field}
                      className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                    />
                  </FormControl>
                  <FormDescription className="text-zinc-500 dark:text-zinc-400">
                    Optionnel - Utilisé pour les notifications
                  </FormDescription>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-900 dark:text-zinc-100">Rôle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800">
                        <SelectValue placeholder="Sélectionnez un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TEACHER">Enseignant</SelectItem>
                      <SelectItem value="ADMIN">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <FormLabel className="text-zinc-900 dark:text-zinc-100">Avatar</FormLabel>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choisir un fichier
                </Button>
                {avatarFile && (
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    {avatarFile.name}
                  </span>
                )}
              </div>
              <input title="image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <FormDescription className="text-zinc-500 dark:text-zinc-400">
                Optionnel - Choisissez une image de profil
              </FormDescription>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100" 
              disabled={isLoading}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}