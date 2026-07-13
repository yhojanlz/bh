import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero({ onVerColeccion }: { onVerColeccion: () => void }) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-20">
      <div className="flex flex-col items-start gap-6">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Nueva colección</p>
        <h1 className="font-serif text-4xl leading-tight text-balance md:text-6xl">
          Elegancia en cada detalle
        </h1>
        <p className="max-w-md leading-relaxed text-muted-foreground text-pretty">
          Vestidos, deportivo, corsets, lencería y bikinis seleccionados para realzar tu estilo.
          Calidad premium, diseño atemporal.
        </p>
        <Button
          onClick={onVerColeccion}
          className="rounded-none px-6 uppercase tracking-[0.2em]"
        >
          Ver colección
        </Button>
      </div>
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="Mujer con vestido lencero marfil de la nueva colección Athenea"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
    </section>
  )
}
