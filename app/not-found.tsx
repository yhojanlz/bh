import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-serif text-4xl">404</h1>
      <p className="text-sm text-muted-foreground">La página que buscas no existe.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-none bg-primary px-6 py-2 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/80"
      >
        Volver a la tienda
      </Link>
    </main>
  )
}
