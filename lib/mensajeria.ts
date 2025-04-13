// lib/mensajeria.ts
import type { Turno } from "./db"
import {
    enviarConfirmacion as enviarWhatsAppConfirmacion,
    enviarRecordatorio as enviarWhatsAppRecordatorio,
    enviarCancelacion as enviarWhatsAppCancelacion,
} from "./whatsapp"
import {
    enviarConfirmacion as enviarTelegramConfirmacion,
    enviarRecordatorio as enviarTelegramRecordatorio,
    enviarCancelacion as enviarTelegramCancelacion,
} from "./telegram"

const canal = process.env.CANAL_MENSAJERIA || "telegram" // telegram por defecto

export const enviarConfirmacion = async (turno: Turno) => {
    return canal === "whatsapp"
        ? await enviarWhatsAppConfirmacion(turno)
        : await enviarTelegramConfirmacion(turno)
}

export const enviarRecordatorio = async (turno: Turno) => {
    return canal === "whatsapp"
        ? await enviarWhatsAppRecordatorio(turno)
        : await enviarTelegramRecordatorio(turno)
}

export const enviarCancelacion = async (turno: Turno) => {
    return canal === "whatsapp"
        ? await enviarWhatsAppCancelacion(turno)
        : await enviarTelegramCancelacion(turno)
}
