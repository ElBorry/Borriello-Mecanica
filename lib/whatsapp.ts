import type { Turno } from "./db"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Plantillas de mensajes
const plantillas = {
  confirmacion:
    "¡Hola [nombre]! Tu turno para [servicio] ha sido confirmado para el [fecha] a las [hora]. Te esperamos en Borriello Mecánica. Responde OK para confirmar.",
  recordatorio:
    "¡Hola [nombre]! Te recordamos que mañana [fecha] a las [hora] tienes turno para [servicio]. ¡Te esperamos!",
  cancelacion:
    "¡Hola [nombre]! Tu turno para [servicio] del [fecha] a las [hora] ha sido cancelado. Por favor, comunícate con nosotros para reprogramar.",
}

// Función para reemplazar variables en las plantillas
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
}

// Función para enviar mensaje de confirmación
export const enviarConfirmacion = async (turno: Turno) => {
  const mensaje = reemplazarVariables(plantillas.confirmacion, turno)
  return await enviarMensaje(turno.telefono, mensaje)
}

// Función para enviar recordatorio
export const enviarRecordatorio = async (turno: Turno) => {
  const mensaje = reemplazarVariables(plantillas.recordatorio, turno)
  return await enviarMensaje(turno.telefono, mensaje)
}

// Función para enviar cancelación
export const enviarCancelacion = async (turno: Turno) => {
  const mensaje = reemplazarVariables(plantillas.cancelacion, turno)
  return await enviarMensaje(turno.telefono, mensaje)
}

// Función base para enviar mensajes usando la API de WhatsApp
const enviarMensaje = async (telefono: string, mensaje: string) => {
  try {
    // Asegúrate de que el número de teléfono tenga el formato correcto (sin espacios, con código de país)
    const numeroFormateado = formatearNumeroTelefono(telefono)

    // Verifica si estamos en modo de desarrollo
    if (process.env.NODE_ENV === "development" || !process.env.WHATSAPP_TOKEN) {
      console.log(`[DEV] Enviando mensaje a ${numeroFormateado}: ${mensaje}`)
      // Simula una petición exitosa en desarrollo
      return {
        success: true,
        messageId: `dev_msg_${Date.now()}`,
        timestamp: new Date().toISOString(),
      }
    }

    // En producción, envía el mensaje real a la API de WhatsApp
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: numeroFormateado,
        type: "text",
        text: {
          body: mensaje,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("Error al enviar mensaje de WhatsApp:", data)
      throw new Error(`Error al enviar mensaje: ${data.error?.message || "Error desconocido"}`)
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error al enviar mensaje de WhatsApp:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

// Función para formatear el número de teléfono al formato requerido por WhatsApp
function formatearNumeroTelefono(telefono: string): string {
  // Elimina todos los espacios y caracteres no numéricos
  let numeroLimpio = telefono.replace(/\D/g, "")

  // Si el número no comienza con el código de país (54 para Argentina)
  if (!numeroLimpio.startsWith("54")) {
    numeroLimpio = "54" + numeroLimpio
  }

  return numeroLimpio
}

export {
  formatearNumeroTelefono, // 👈 agregalo acá
}
