"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Moon, Sun, User, Globe, Shield } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ParametresPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [language, setLanguage] = useState("fr")
  const [privacy, setPrivacy] = useState("public")

  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    toast.success("Paramètres enregistrés avec succès")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Profil et compte</span>
              </CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et les paramètres de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" onClick={() => router.push("/teacher/profil")}>
                Modifier mon profil
              </Button>
              <Button variant="outline" className="ml-2">
                Changer mon mot de passe
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configurez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col gap-1">
                  <span>Notifications par email</span>
                  <span className="text-sm text-muted-foreground">Recevoir des emails pour les événements importants</span>
                </Label>
                <Switch 
                  id="notifications" 
                  checked={notifications} 
                  onCheckedChange={setNotifications} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="course-reminders" className="flex flex-col gap-1">
                  <span>Rappels de cours</span>
                  <span className="text-sm text-muted-foreground">Recevoir des rappels avant le début des cours</span>
                </Label>
                <Switch id="course-reminders" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>Préférences</span>
              </CardTitle>
              <CardDescription>
                Personnalisez votre expérience sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="flex flex-col gap-1">
                  <span>Thème sombre</span>
                  <span className="text-sm text-muted-foreground">Activer le mode sombre</span>
                </Label>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-muted-foreground" />
                  <Switch 
                    id="theme" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                  <Moon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="flex flex-col gap-1">
                  <span>Langue</span>
                  <span className="text-sm text-muted-foreground">Choisissez la langue de l'interface</span>
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Confidentialité</span>
              </CardTitle>
              <CardDescription>
                Gérez vos paramètres de confidentialité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="privacy" className="flex flex-col gap-1">
                  <span>Visibilité du profil</span>
                  <span className="text-sm text-muted-foreground">Qui peut voir votre profil</span>
                </Label>
                <Select value={privacy} onValueChange={setPrivacy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sélectionner une option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="students">Étudiants uniquement</SelectItem>
                    <SelectItem value="staff">Personnel uniquement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              Annuler
            </Button>
            <Button onClick={handleSaveSettings}>
              Enregistrer les modifications
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}