export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="size-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Cargando</p>
      </div>
    </main>
  )
}
