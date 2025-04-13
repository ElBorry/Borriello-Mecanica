import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Car, FuelIcon as Oil, Settings, PenToolIcon as Tool, Wrench } from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight">
            BORRIELLO <span className="text-primary">MECÁNICA</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">Reserva tu turno de forma rápida y sencilla</p>
        </div>

        <Card className="bg-black border border-secondary/20 overflow-hidden">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/0"></div>
            <CardContent className="p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Servicios Profesionales</h2>
                  <ul className="space-y-3">
                    <ServiceItem icon={Oil} text="Cambio de aceite y filtros" />
                    <ServiceItem icon={Settings} text="Distribucion" />
                    <ServiceItem icon={Tool} text="Diagnóstico computarizado" />
                    <ServiceItem icon={Wrench} text="Reparación de suspensión" />
                    <ServiceItem icon={Car} text="Mantenimiento general" />
                  </ul>
                  <div className="mt-8">
                    <Link href="/reserva">
                      <Button size="lg" className="gap-2">
                        Reservar turno
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="bg-black/60 p-4 rounded-full border border-secondary/20 shadow-md">
                    <Image
                      src="/logo-borriello.jpeg"
                      alt="Logo Borriello"
                      width={140}
                      height={140}
                      className="rounded-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Clock />}
            title="Rápido"
            description="Servicio eficiente y puntual para que no pierdas tiempo"
          />
          <FeatureCard
            icon={<Shield />}
            title="Confiable"
            description="Mecánicos certificados y repuestos de calidad"
          />
          <FeatureCard
            icon={<ThumbsUp />}
            title="Garantizado"
            description="Todos nuestros trabajos cuentan con garantía"
          />
        </div>
      </div>
    </div>
  )
}

function ServiceItem({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="bg-primary/10 p-2 rounded-full">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <span>{text}</span>
    </li>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-black border border-secondary/20">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="bg-primary/10 p-3 rounded-full mb-4">{icon}</div>
        <h3 className="font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function Clock() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function Shield() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
  )
}

function ThumbsUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  )
}
