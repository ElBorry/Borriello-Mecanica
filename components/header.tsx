import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, Calendar } from "lucide-react"

export default function Header() {
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
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span>Administración</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
