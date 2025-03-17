"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const locationSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(1, "Le rayon minimum est de 1 mètre"),
})

type LocationFormValues = z.infer<typeof locationSchema>

export function CreateLocation() {
  const queryClient = useQueryClient()
  const [isMapVisible, setIsMapVisible] = useState(false)

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      address: "",
      latitude: 0,
      longitude: 0,
      radius: 50,
    },
  })

  const createLocation = useMutation({
    mutationFn: async (data: LocationFormValues) => {
      const response = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Erreur lors de la création")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] })
      toast.success("Localisation créée avec succès")
      form.reset()
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue")
    },
  })

  const onSubmit = (data: LocationFormValues) => {
    createLocation.mutate(data)
  }

  return (
    <div className="bg-zinc-900 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Nouvelle localisation</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du lieu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="Adresse complète" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="any" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="any" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="radius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rayon (mètres)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={createLocation.isPending}
          >
            {createLocation.isPending ? "Création..." : "Créer la localisation"}
          </Button>
        </form>
      </Form>
    </div>
  )
} 