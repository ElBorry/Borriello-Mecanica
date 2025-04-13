"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Clock, Wrench } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { crearTurno } from "@/lib/db"
import { enviarConfirmacion, enviarRecordatorio, enviarCancelacion } from "@/lib/mensajeria"

export default function ReservaPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hora, setHora] = useState<string>("")
  const [servicio, setServicio] = useState<string>("")
  const [otroServicio, setOtroServicio] = useState<string>("")
  const [nota, setNota] = useState<string>("")
  const [nombre, setNombre] = useState<string>("")
  const [whatsapp, setWhatsapp] = useState<string>("")
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const serviciosMecanica = [
    "Cambio de aceite",
    "Distribucion",
    "Revisión general",
    "Diagnóstico por falla",
    "Colocación de repuestos",
    "Otro",
  ]

  const horasDisponibles = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!date || !hora) {
        alert("Por favor selecciona fecha y hora")
        setLoading(false)
        return
      }

      // Crear fecha completa con hora
      const [hours, minutes] = hora.split(":").map(Number)
      const fechaCompleta = new Date(date)
      fechaCompleta.setHours(hours, minutes)

      // Crear el turno
      const servicioFinal = servicio === "Otro" ? otroServicio : servicio
      const nuevoTurno = await crearTurno({
        nombre,
        telefono: whatsapp,
        servicio: servicioFinal,
        fecha: fechaCompleta,
        estado: "pendiente",
        notas: nota || undefined,
      })

      // Enviar confirmación por WhatsApp
      await enviarConfirmacion(nuevoTurno)

      setSubmitted(true)
    } catch (error) {
      console.error("Error al crear turno:", error)
      alert("Ocurrió un error al crear el turno. Por favor intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Alert className="bg-primary/10 border-primary/20">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <AlertTitle className="text-primary">¡Turno reservado con éxito!</AlertTitle>
            <AlertDescription>
              Hemos enviado una confirmación a tu WhatsApp. Te esperamos el{" "}
              {date && format(date, "EEEE d 'de' MMMM", { locale: es })} a las {hora} hs.
            </AlertDescription>
          </Alert>
          <div className="mt-6 text-center">
            <Button onClick={() => router.push("/")}>Volver al inicio</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card className="border-secondary/20 bg-black">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary p-1 rounded">
                <Wrench className="h-4 w-4 text-black" />
              </div>
              <CardTitle className="text-xl tracking-tight">RESERVA DE TURNO</CardTitle>
            </div>
            <CardDescription>Completa el formulario para reservar tu turno en Borriello Mecánica</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="servicio">¿Qué servicio deseas reservar?</Label>
                <RadioGroup
                  id="servicio"
                  value={servicio}
                  onValueChange={setServicio}
                  className="grid grid-cols-1 gap-2"
                >
                  {serviciosMecanica.map((item) => (
                    <div
                      key={item}
                      className="flex items-center space-x-2 border border-secondary/20 p-3 rounded-md bg-black"
                    >
                      <RadioGroupItem value={item} id={`servicio-${item}`} />
                      <Label htmlFor={`servicio-${item}`} className="flex-1 cursor-pointer">
                        {item}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {servicio === "Otro" && (
                <div className="space-y-2">
                  <Label htmlFor="otro-servicio">Describe el servicio que necesitas</Label>
                  <Textarea
                    id="otro-servicio"
                    placeholder="Describe el servicio que necesitas..."
                    value={otroServicio}
                    onChange={(e) => setOtroServicio(e.target.value)}
                    required={servicio === "Otro"}
                    className="bg-black border-secondary/20"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>¿Qué día prefieres?</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-black border-secondary/20",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-black border-secondary/20">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                        date.getDay() === 0 || // Domingo
                        date > new Date(new Date().setDate(new Date().getDate() + 30))
                      }
                      className="bg-black"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">¿A qué hora?</Label>
                <Select value={hora} onValueChange={setHora} required>
                  <SelectTrigger id="hora" className="w-full bg-black border-secondary/20">
                    <SelectValue placeholder="Selecciona un horario">
                      {hora ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {hora} hs
                        </div>
                      ) : (
                        "Selecciona un horario"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-black border-secondary/20">
                    {horasDisponibles.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h} hs
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nota">¿Quieres agregar alguna nota o preferencia? (opcional)</Label>
                <Textarea
                  id="nota"
                  placeholder="Escribe aquí cualquier detalle adicional..."
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  className="bg-black border-secondary/20"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="bg-black border-secondary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Número de Telegram</Label>
                  <Input
                    id="whatsapp"
                    placeholder="Ej: 11 1234 5678"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    required
                    className="bg-black border-secondary/20"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Procesando..." : "Reservar turno"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
