import type { Turno } from "./db"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const plantillas = {
    confirmacion:
        "✨ Nuevo turno cargado por [nombre]:\n⚙ Servicio: [servicio]\n🗓 Fecha: [fecha] a las [hora]\n📞 Teléfono: [telefono]",
    recordatorio:
        "⏰ Recordatorio: Mañana [fecha] a las [hora] tenés un turno de [nombre] para [servicio].",
    cancelacion:
        "❌ Cancelado: [nombre] canceló su turno para [servicio] del [fecha] a las [hora].",
}

const reemplazarVariables = (mensaje: string, turno: Turno) => {
    const fechaTurno = new Date(turno.fecha)
    const fecha = format(fechaTurno, "EEEE d 'de' MMMM", { locale: es })
    const hora = format(fechaTurno, "HH:mm")
    const nombrePrimero = typeof turno.nombre === "string" ? turno.nombre.split(" ")[0] : ""

    return mensaje
        .replace("[nombre]", nombrePrimero)
        .replace("[servicio]", turno.servicio)
        .replace("[fecha]", fecha)
        .replace("[hora]", hora)
        .replace("[telefono]", turno.telefono)
}

export const enviarConfirmacion = async (turno: Turno) => {
    const mensaje = reemplazarVariables(plantillas.confirmacion, turno)
    return await enviarMensajeTelegram(mensaje)
}

export const enviarRecordatorio = async (turno: Turno) => {
    const mensaje = reemplazarVariables(plantillas.recordatorio, turno)
    return await enviarMensajeTelegram(mensaje)
}

export const enviarCancelacion = async (turno: Turno) => {
    const mensaje = reemplazarVariables(plantillas.cancelacion, turno)
    return await enviarMensajeTelegram(mensaje)
}

const enviarMensajeTelegram = async (mensaje: string) => {
    try {
        const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
        const adminId = process.env.NEXT_PUBLIC_TELEGRAM_ADMIN_ID

        if (!botToken || !adminId) {
            throw new Error("Faltan TELEGRAM_BOT_TOKEN o TELEGRAM_ADMIN_ID en el entorno.")
        }

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: adminId,
                text: mensaje,
                parse_mode: "Markdown",
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("Error al enviar mensaje a Telegram:", data)
            throw new Error(`Error Telegram: ${data.description}`)
        }

        return {
            success: true,
            messageId: data.result?.message_id,
            timestamp: new Date().toISOString(),
        }
    } catch (error) {
        console.error("Error al enviar mensaje Telegram:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Error desconocido",
        }
    }
}
