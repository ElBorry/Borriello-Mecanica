import { supabase } from "@/lib/supabase-browser"

export type Turno = {
  id: number
  nombre: string
  telefono: string
  servicio: string
  fecha: Date | string
  estado: "pendiente" | "confirmado" | "cancelado"
  notas?: string
  created_at?: string
}

// Función para obtener todos los turnos
export const getTurnos = async (): Promise<Turno[]> => {
  try {
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return [
        {
          id: 1,
          nombre: "Juan Pérez",
          telefono: "11 2345 6789",
          servicio: "Cambio de aceite",
          fecha: new Date(2025, 3, 10, 10, 0),
          estado: "confirmado",
          notas: "Aceite sintético",
        },
        {
          id: 2,
          nombre: "María López",
          telefono: "11 9876 5432",
          servicio: "Distribucion",
          fecha: new Date(2025, 3, 10, 14, 30),
          estado: "pendiente",
        },
        {
          id: 3,
          nombre: "Carlos Rodríguez",
          telefono: "11 5555 8888",
          servicio: "Diagnóstico por falla",
          fecha: new Date(2025, 3, 11, 9, 0),
          estado: "confirmado",
          notas: "El auto hace un ruido extraño al frenar",
        },
      ]
    }

    const { data, error } = await supabase.from("turnos").select("*").order("fecha", { ascending: true })

    if (error) throw error
    return (data || []).map((turno) => ({
      ...turno,
      estado: turno.estado as "pendiente" | "confirmado" | "cancelado",
    }))
  } catch (error) {
    console.error("Error al obtener turnos:", error)
    return []
  }
}

export const getTurnosByFecha = async (fecha: Date): Promise<Turno[]> => {
  try {
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const turnos = await getTurnos()
      return turnos.filter((turno) => {
        const turnoDate = new Date(turno.fecha)
        return (
          turnoDate.getDate() === fecha.getDate() &&
          turnoDate.getMonth() === fecha.getMonth() &&
          turnoDate.getFullYear() === fecha.getFullYear()
        )
      })
    }

    const fechaInicio = new Date(fecha)
    fechaInicio.setHours(0, 0, 0, 0)

    const fechaFin = new Date(fecha)
    fechaFin.setHours(23, 59, 59, 999)

    const { data, error } = await supabase
      .from("turnos")
      .select("*")
      .gte("fecha", fechaInicio.toISOString())
      .lte("fecha", fechaFin.toISOString())
      .order("fecha", { ascending: true })

    if (error) throw error
    return (data || []).map((turno) => ({
      ...turno,
      estado: turno.estado as "pendiente" | "confirmado" | "cancelado",
    }))
  } catch (error) {
    console.error("Error al obtener turnos por fecha:", error)
    return []
  }
}

export const getTurnoById = async (id: number): Promise<Turno | null> => {
  try {
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const turnos = await getTurnos()
      return turnos.find((turno) => turno.id === id) || null
    }

    const { data, error } = await supabase.from("turnos").select("*").eq("id", id).single()

    if (error) throw error
    return data ? { ...data, estado: data.estado as Turno["estado"] } : null
  } catch (error) {
    console.error("Error al obtener turno por ID:", error)
    return null
  }
}

export const crearTurno = async (turno: Omit<Turno, "id">): Promise<Turno> => {
  try {
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const turnos = await getTurnos()
      const nuevoId = Math.max(0, ...turnos.map((t) => t.id)) + 1
      const nuevoTurno = { ...turno, id: nuevoId }
      console.log("Turno creado (simulación):", nuevoTurno)
      return nuevoTurno as Turno
    }

    const turnoAEnviar = {
      ...turno,
      fecha: new Date(turno.fecha).toISOString(),
    }

    const { data, error } = await supabase
      .from("turnos")
      .insert([turnoAEnviar])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error: any) {
    console.error("Error al crear turno:", {
      mensaje: error.message,
      errorCompleto: error,
    })
    throw error
  }
}

export const actualizarTurno = async (id: number, datos: Partial<Turno>): Promise<Turno | null> => {
  try {
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const turnos = await getTurnos()
      const index = turnos.findIndex((t) => t.id === id)
      if (index === -1) return null

      const turnoActualizado = { ...turnos[index], ...datos }
      console.log("Turno actualizado (simulación):", turnoActualizado)
      return turnoActualizado
    }

    const datosAActualizar = {
      ...datos,
      fecha: datos.fecha ? new Date(datos.fecha).toISOString() : undefined,
    }

    const { data, error } = await supabase
      .from("turnos")
      .update(datosAActualizar)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al actualizar turno:", error)
    return null
  }
}

export const eliminarTurno = async (id: number): Promise<Turno | null> => {
  try {
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const turnos = await getTurnos()
      const turno = turnos.find((t) => t.id === id)
      if (!turno) return null

      console.log("Turno eliminado (simulación):", turno)
      return turno
    }

    const { data, error } = await supabase.from("turnos").delete().eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al eliminar turno:", error)
    return null
  }
}
