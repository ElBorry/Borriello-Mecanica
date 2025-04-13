// script/test-telegram.ts
import { enviarConfirmacion } from "../lib/telegram"
import dotenv from "dotenv"
dotenv.config()

const main = async () => {
    console.log("🚀 Iniciando prueba de envío por Telegram...")

    const turnoDePrueba = {
        id: 1,
        nombre: "Francisco Borriello",
        telefono: "11 6971 9706",
        servicio: "Cambio de aceite",
        fecha: new Date(),
        estado: "confirmado" as const,
    }

    const resultado = await enviarConfirmacion(turnoDePrueba)

    if (resultado.success) {
        console.log("✅ Mensaje enviado correctamente:", resultado)
    } else {
        console.error("❌ Error al enviar el mensaje:", resultado)
    }
}

main()
