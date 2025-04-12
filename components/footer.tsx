export default function Footer() {
  return (
    <footer className="border-t border-secondary/20 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Borriello Mecánica. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
