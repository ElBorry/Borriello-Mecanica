# 🛠️ Borriello Mecánica - Sistema de Turnos

Aplicación web desarrollada para gestionar turnos de manera simple, rápida y visual. Optimizada para uso móvil, con integración a Telegram y WhatsApp.

## 🚀 Funcionalidades

- 📅 Reserva de turnos con fecha y hora.
- 🔐 Login seguro exclusivo para el administrador (cliente).
- 🛎️ Panel de administración para visualizar y gestionar turnos.
- 📲 Envío automático de mensajes de confirmación, recordatorio y cancelación.
- 💬 Integración con WhatsApp y Telegram.
- 📊 Sección de clientes y estadísticas.
- 🎨 Estilo dark con branding personalizado.

## 🧰 Stack Tecnológico

- **Frontend**: Next.js + TailwindCSS + TypeScript
- **Backend**: Supabase (auth + base de datos)
- **Mensajería**: WhatsApp Business API / Bot de Telegram
- **Deploy**: Vercel

## 🔐 Acceso

- `/login`: Solo el cliente puede acceder al panel con sus credenciales Supabase.
- `/admin`: Protegido por sesión activa (requiere login).

## 📦 Instalación local

```bash
git clone https://github.com/ElBorry/Borriello-Mecanica.git
cd Borriello-Mecanica
npm install
npm run dev
```

Configurar el archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_PROJECT_ID=...
WHATSAPP_API_URL=...
WHATSAPP_TEMPLATE_ID=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

## 💬 Personalización de Mensajes

Los textos se encuentran en `lib/mensajeria.ts`. Se pueden editar fácilmente los placeholders:

- `[nombre]`
- `[fecha]`
- `[hora]`
- `[servicio]`

## 🤖 Bot de Telegram

Incluye opción de enviar mensajes desde el bot oficial de Borriello Mecánica.

> ✅ Se puede personalizar el avatar del bot subiendo el logo del cliente al [BotFather](https://t.me/BotFather).

## 📸 Branding

- Logo: `public/logo-borriello.jpeg`
- Colores personalizados desde `tailwind.config.ts` (rojo, negro y gris metálico)

---

## 👨‍🔧 Autor

Francisco Borriello · [@ElBorry](https://github.com/ElBorry)
