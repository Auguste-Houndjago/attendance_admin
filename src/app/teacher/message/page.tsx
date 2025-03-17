"use client"

import { useState } from "react"
import { MessageCircle, Search, Star, Archive, Trash2, Send } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Message = {
  id: number
  sender: string
  avatar: string
  subject: string
  preview: string
  date: string
  isRead: boolean
  isStarred: boolean
}

export default function MessagePage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Exemple de messages (à remplacer par de vraies données)
  const [messages] = useState<Message[]>([
    {
      id: 1,
      sender: "Alice Martin",
      avatar: "/avatars/alice.jpg",
      subject: "Question sur le prochain cours",
      preview: "Bonjour, j'aurais besoin de précisions concernant...",
      date: "14:30",
      isRead: false,
      isStarred: true
    },
    {
      id: 2,
      sender: "Thomas Dubois",
      avatar: "/avatars/thomas.jpg",
      subject: "Absence prévue",
      preview: "Je vous informe que je serai absent au prochain...",
      date: "Hier",
      isRead: true,
      isStarred: false
    },
    {
      id: 3,
      sender: "Marie Lambert",
      avatar: "/avatars/marie.jpg",
      subject: "Devoir à rendre",
      preview: "Pourriez-vous me confirmer la date limite...",
      date: "Lun.",
      isRead: true,
      isStarred: false
    }
  ])

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.sender.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Barre latérale */}
          <div className="md:col-span-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5" />
                  <CardTitle>Boîte de réception</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-2">
                    {filteredMessages.map((message) => (
                      <div key={message.id}>
                        <button
                          className={`w-full text-left p-3 rounded-lg hover:bg-accent transition-colors ${
                            selectedMessage?.id === message.id ? 'bg-accent' : ''
                          } ${!message.isRead ? 'font-medium' : ''}`}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={message.avatar} />
                              <AvatarFallback>{message.sender[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="block truncate">{message.sender}</span>
                                <span className="text-sm text-muted-foreground">{message.date}</span>
                              </div>
                              <div className="text-sm truncate">{message.subject}</div>
                              <div className="text-sm text-muted-foreground truncate">
                                {message.preview}
                              </div>
                            </div>
                            {message.isStarred && (
                              <Star className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Zone de lecture */}
          <div className="md:col-span-8">
            <Card className="h-[calc(100vh-200px)]">
              {selectedMessage ? (
                <>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={selectedMessage.avatar} />
                          <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle>{selectedMessage.sender}</CardTitle>
                          <CardDescription>{selectedMessage.subject}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Star className={`h-4 w-4 ${selectedMessage.isStarred ? 'text-yellow-400' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Reçu le {selectedMessage.date}
                      </p>
                      <div className="prose dark:prose-invert">
                        {/* Contenu du message (à remplacer par le vrai contenu) */}
                        <p>
  "Je trouve que le planning est bien structuré, mais ce serait bien d'ajouter plus de temps pour les révisions avant les examens."
</p>
<p>
  "Mais les horaires des cours sont un peu trop serrés. Peut-on avoir plus de pauses entre les sessions pour mieux assimiler les cours ?"
</p>
                      </div>
                      
                      {/* Zone de réponse */}
                      <div className="mt-6">
                        <div className="relative">
                          <Input
                            placeholder="Répondre..."
                            className="pr-24"
                          />
                          <Button
                            size="sm"
                            className="absolute right-1 top-1"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Aucun message sélectionné</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Sélectionnez un message pour le lire
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}