// script/test-whatsapp.ts

import dotenv from "dotenv"
import { formatearNumeroTelefono } from "../lib/whatsapp"

// Cargar las variables desde .env.local
dotenv.config()

console.log("🧪 Variables de entorno cargadas:")
console.log("WHATSAPP_TOKEN:", process.env.WHATSAPP_TOKEN ? "✅ cargada" : "❌ no encontrada")
console.log("WHATSAPP_PHONE_NUMBER_ID:", process.env.WHATSAPP_PHONE_NUMBER_ID ? "✅ cargada" : "❌ no encontrada")

const enviarMensajeDePrueba = async () => {
    const token = process.env.WHATSAPP_TOKEN
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const telefono = "11 6971 9706" // Cambiá por otro si querés
    const mensaje = "Este es un mensaje de prueba desde el script 🎯"

    if (!token || !phoneId) {
        console.error("❌ Faltan variables de entorno. Verifica WHATSAPP_TOKEN y WHATSAPP_PHONE_NUMBER_ID")
        return
    }

    const numeroFormateado = formatearNumeroTelefono(telefono)

    try {
        const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
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
            console.error("❌ Error al enviar mensaje:", data)
        } else {
            console.log("✅ Mensaje enviado con éxito:", data)
        }
    } catch (error) {
        console.error("❌ Error inesperado:", error)
    }
}

enviarMensajeDePrueba()
