"use client"
import Link from "next/link"
import type React from "react"

import { ArrowRight, Calendar, Clock, QrCode } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center bg-background">
      {/* Logo & Hero Section */}
      <section className="w-full border-b py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <div className=" relative">
              <Image src="/logo.webp" className="object-cover rounded-md" height={"200"} width={"200"} priority alt="logo" />
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Votre Espace Enseignant
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-xl text-muted-foreground"
            >
              Gérez vos cours et présences en toute simplicité
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8"
            >
              <Button asChild size="lg" className="rounded-md">
                <Link href="/admin">Accéder à mon espace</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <motion.h2 variants={item} className="text-3xl font-bold text-center mb-12">
          Tout ce dont vous avez besoin
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={item}>
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Planning Personnalisé"
              description="Consultez votre emploi du temps et vos cours à venir en un coup d'œil"
            />
          </motion.div>

          <motion.div variants={item}>
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Suivi du Temps"
              description="Visualisez vos heures de cours et gérez votre temps efficacement"
            />
          </motion.div>

          <motion.div variants={item}>
            <FeatureCard
              icon={<QrCode className="h-8 w-8" />}
              title="Présence Simplifiée"
              description="Marquez votre présence rapidement via QR code ou géolocalisation"
            />
          </motion.div>
        </div>
      </motion.section>

 
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="h-full flex flex-col items-center text-center p-8 hover:shadow-md transition-all">
      <div className="rounded-full bg-primary/10 p-4 text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}

