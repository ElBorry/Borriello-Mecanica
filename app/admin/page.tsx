"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, CheckCircle2, Clock, MessageSquare, Settings, User, Wrench, XCircle } from "lucide-react"
import { getTurnos, actualizarTurno } from "@/lib/db"
import { enviarConfirmacion, enviarRecordatorio, enviarCancelacion } from "@/lib/mensajeria"
import type { Turno } from "@/lib/db"

export default function AdminPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [turnosFiltrados, setTurnosFiltrados] = useState<Turno[]>([])
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cargar turnos al iniciar
  useEffect(() => {
    const cargarTurnos = async () => {
      try {
        const data = await getTurnos()
        setTurnos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar turnos:", error)
        setLoading(false)
      }
    }

    cargarTurnos()
  }, [])

  // Filtrar turnos cuando cambia la fecha
  useEffect(() => {
    if (!date) {
      setTurnosFiltrados(turnos)
      return
    }

    const filtrados = turnos.filter((turno) => {
      const turnoDate = new Date(turno.fecha)
      return (
        turnoDate.getDate() === date.getDate() &&
        turnoDate.getMonth() === date.getMonth() &&
        turnoDate.getFullYear() === date.getFullYear()
      )
    })

    setTurnosFiltrados(filtrados)
  }, [date, turnos])

  // Función para confirmar un turno
  const confirmarTurno = async (id: number) => {
    try {
      const turnoActualizado = await actualizarTurno(id, { estado: "confirmado" })
      if (turnoActualizado) {
        await enviarConfirmacion(turnoActualizado)
        // Actualizar la lista de turnos
        setTurnos((prevTurnos) => prevTurnos.map((t) => (t.id === id ? { ...t, estado: "confirmado" } : t)))
      }
      setDialogOpen(false)
    } catch (error) {
      console.error("Error al confirmar turno:", error)
      alert("Error al confirmar el turno")
    }
  }

  // Función para cancelar un turno
  const cancelarTurno = async (id: number) => {
    try {
      const turnoActualizado = await actualizarTurno(id, { estado: "cancelado" })
      if (turnoActualizado) {
        await enviarCancelacion(turnoActualizado)
        // Actualizar la lista de turnos
        setTurnos((prevTurnos) => prevTurnos.map((t) => (t.id === id ? { ...t, estado: "cancelado" } : t)))
      }
      setDialogOpen(false)
    } catch (error) {
      console.error("Error al cancelar turno:", error)
      alert("Error al cancelar el turno")
    }
  }

  // Función para obtener el color del badge según el estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmado":
        return "bg-green-500"
      case "pendiente":
        return "bg-yellow-500"
      case "cancelado":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            PANEL DE <span className="text-primary">ADMINISTRACIÓN</span>
          </h1>
          <p className="text-muted-foreground">Gestiona los turnos y configuraciones</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-secondary/20">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-secondary/20">
              <DialogHeader>
                <DialogTitle>Configuración</DialogTitle>
                <DialogDescription>Ajusta la configuración de tu taller</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Nombre del taller</Label>
                  <Input
                    placeholder="Nombre del taller"
                    defaultValue="Borriello Mecánica"
                    className="bg-black border-secondary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número de WhatsApp para notificaciones</Label>
                  <Input
                    placeholder="Ej: 11 1234 5678"
                    defaultValue="11 1234 5678"
                    className="bg-black border-secondary/20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enviar recordatorios automáticos</Label>
                    <p className="text-sm text-muted-foreground">Enviar recordatorio 24hs antes del turno</p>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
              <DialogFooter>
                <Button>Guardar cambios</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="turnos">
        <TabsList className="mb-6 bg-black border border-secondary/20">
          <TabsTrigger value="turnos" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Turnos
          </TabsTrigger>
          <TabsTrigger value="mensajes" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <MessageSquare className="mr-2 h-4 w-4" />
            Mensajes
          </TabsTrigger>
          <TabsTrigger value="clientes" className="data-[state=active]:bg-primary data-[state=active]:text-black">
            <User className="mr-2 h-4 w-4" />
            Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="turnos" className="space-y-6">
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            <Card className="bg-black border-secondary/20">
              <CardHeader>
                <CardTitle>Calendario</CardTitle>
                <CardDescription>Selecciona una fecha para ver los turnos</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border rounded-md border-secondary/20 bg-black"
                />
              </CardContent>
            </Card>

            <Card className="bg-black border-secondary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="bg-primary p-1 rounded">
                    <Wrench className="h-4 w-4 text-black" />
                  </div>
                  <CardTitle>Turnos para {date && format(date, "EEEE d 'de' MMMM", { locale: es })}</CardTitle>
                </div>
                <CardDescription>{turnosFiltrados.length} turnos programados</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6">Cargando turnos...</div>
                ) : turnosFiltrados.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-secondary/20">
                        <TableHead>Hora</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Servicio</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {turnosFiltrados.map((turno) => (
                        <TableRow key={turno.id} className="border-secondary/20">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {format(new Date(turno.fecha), "HH:mm")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{turno.nombre}</div>
                              <div className="text-sm text-muted-foreground">{turno.telefono}</div>
                            </div>
                          </TableCell>
                          <TableCell>{turno.servicio}</TableCell>
                          <TableCell>
                            <Badge className={getEstadoColor(turno.estado)}>
                              {turno.estado.charAt(0).toUpperCase() + turno.estado.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedTurno(turno)
                                setDialogOpen(true)
                              }}
                            >
                              Ver detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No hay turnos programados para esta fecha
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mensajes">
          <Card className="bg-black border-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1 rounded">
                  <MessageSquare className="h-4 w-4 text-black" />
                </div>
                <CardTitle>Mensajes y Notificaciones</CardTitle>
              </div>
              <CardDescription>Configura los mensajes automáticos de WhatsApp</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Mensaje de confirmación de turno</Label>
                <Input
                  defaultValue="¡Hola [nombre]! Tu turno para [servicio] ha sido confirmado para el [fecha] a las [hora]. Te esperamos en Borriello Mecánica. Responde OK para confirmar."
                  className="bg-black border-secondary/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Mensaje de recordatorio (24hs antes)</Label>
                <Input
                  defaultValue="¡Hola [nombre]! Te recordamos que mañana [fecha] a las [hora] tienes turno para [servicio]. ¡Te esperamos!"
                  className="bg-black border-secondary/20"
                />
              </div>
              <div className="space-y-2">
                <Label>Mensaje de cancelación</Label>
                <Input
                  defaultValue="¡Hola [nombre]! Tu turno para [servicio] del [fecha] a las [hora] ha sido cancelado. Por favor, comunícate con nosotros para reprogramar."
                  className="bg-black border-secondary/20"
                />
              </div>
              <Button>Guardar cambios</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes">
          <Card className="bg-black border-secondary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1 rounded">
                  <User className="h-4 w-4 text-black" />
                </div>
                <CardTitle>Clientes</CardTitle>
              </div>
              <CardDescription>Gestiona tu base de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-6">Cargando clientes...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-secondary/20">
                      <TableHead>Nombre</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Turnos totales</TableHead>
                      <TableHead>Último turno</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...new Set(turnos.map((t) => t.nombre))].map((nombre, index) => {
                      const turnosCliente = turnos.filter((t) => t.nombre === nombre)
                      const telefono = turnosCliente[0].telefono
                      const ultimoTurno = new Date(Math.max(...turnosCliente.map((t) => new Date(t.fecha).getTime())))

                      return (
                        <TableRow key={index} className="border-secondary/20">
                          <TableCell className="font-medium">{nombre}</TableCell>
                          <TableCell>{telefono}</TableCell>
                          <TableCell>{turnosCliente.length}</TableCell>
                          <TableCell>{format(ultimoTurno, "dd/MM/yyyy")}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Ver historial
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black border-secondary/20">
          {selectedTurno && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles del turno</DialogTitle>
                <DialogDescription>Información completa del turno</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Cliente</Label>
                    <p className="font-medium">{selectedTurno.nombre}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Teléfono</Label>
                    <p className="font-medium">{selectedTurno.telefono}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Servicio</Label>
                  <p className="font-medium">{selectedTurno.servicio}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Fecha</Label>
                    <p className="font-medium">{format(new Date(selectedTurno.fecha), "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Hora</Label>
                    <p className="font-medium">{format(new Date(selectedTurno.fecha), "HH:mm")}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <div className="mt-1">
                    <Badge className={getEstadoColor(selectedTurno.estado)}>
                      {selectedTurno.estado.charAt(0).toUpperCase() + selectedTurno.estado.slice(1)}
                    </Badge>
                  </div>
                </div>
                {selectedTurno.notas && (
                  <div>
                    <Label className="text-muted-foreground">Notas</Label>
                    <p className="font-medium">{selectedTurno.notas}</p>
                  </div>
                )}
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-secondary/20"
                  onClick={() => {
                    // Aquí iría la lógica para enviar un mensaje personalizado
                    alert(`Enviar mensaje a ${selectedTurno.telefono}`)
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enviar mensaje
                </Button>
                {selectedTurno.estado !== "confirmado" && (
                  <Button
                    variant="default"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => confirmarTurno(selectedTurno.id)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Confirmar
                  </Button>
                )}
                {selectedTurno.estado !== "cancelado" && (
                  <Button variant="destructive" className="flex-1" onClick={() => cancelarTurno(selectedTurno.id)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
