"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, Calendar, LogIn, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-browser"

export default function Header() {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLogged(!!session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLogged(!!session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  return (
    <header className="border-b border-secondary/20">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded">
            <Wrench className="h-5 w-5 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">BORRIELLO MECÁNICA</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLogged ? (
            <>
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Administración</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4" />
                <span>Iniciar sesión</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
