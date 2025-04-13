"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-browser"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        // Solo corre en cliente
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push("/admin")
            }
        }
        checkSession()
    }, [router])

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError("Credenciales incorrectas")
        } else {
            router.push("/admin")
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
            <form onSubmit={handleLogin} className="space-y-4 p-6 rounded bg-zinc-900 shadow-md w-full max-w-md">
                <h1 className="text-xl font-bold">Iniciar sesión</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 rounded bg-zinc-800"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full p-2 rounded bg-zinc-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full">
                    Ingresar
                </button>
                {error && <p className="text-red-400 text-sm">{error}</p>}
            </form>
        </div>
    )
}
