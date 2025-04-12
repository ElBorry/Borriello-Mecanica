import { NextResponse } from "next/server"
import { getTurnos, getTurnoById, crearTurno, actualizarTurno, eliminarTurno } from "@/lib/db"
import { enviarConfirmacion } from "@/lib/whatsapp"

// GET /api/turnos - Obtener todos los turnos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const fecha = searchParams.get("fecha")

    if (id) {
      const turno = await getTurnoById(Number(id))
      if (!turno) {
        return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 })
      }
      return NextResponse.json(turno)
    }

    const turnos = await getTurnos()
    return NextResponse.json(turnos)
  } catch (error) {
    console.error("Error en GET /api/turnos:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

// POST /api/turnos - Crear un nuevo turno
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validar datos
    if (!body.nombre || !body.telefono || !body.servicio || !body.fecha) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 })
    }

    // Crear el turno
    const nuevoTurno = await crearTurno({
      ...body,
      estado: "pendiente",
    })

    // Enviar confirmación por WhatsApp
    await enviarConfirmacion(nuevoTurno)

    return NextResponse.json(nuevoTurno, { status: 201 })
  } catch (error) {
    console.error("Error en POST /api/turnos:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

// PUT /api/turnos/:id - Actualizar un turno
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 })
    }

    const body = await request.json()
    const turnoActualizado = await actualizarTurno(Number(id), body)

    if (!turnoActualizado) {
      return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 })
    }

    return NextResponse.json(turnoActualizado)
  } catch (error) {
    console.error("Error en PUT /api/turnos:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

// DELETE /api/turnos/:id - Eliminar un turno
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID no proporcionado" }, { status: 400 })
    }

    const turnoEliminado = await eliminarTurno(Number(id))

    if (!turnoEliminado) {
      return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error en DELETE /api/turnos:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
