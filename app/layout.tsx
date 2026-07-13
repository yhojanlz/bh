import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: {
    default: 'Athenea Store — Elegancia en cada detalle',
    template: '%s — Athenea Store',
  },
  description:
    'Vestidos, deportivo, corsets, lencería y bikinis seleccionados para realzar tu estilo. Calidad premium, diseño atemporal.',
  metadataBase: new URL('https://athenea-store.vercel.app'),
  keywords: ['moda', 'vestidos', 'lencería', 'bikinis', 'corsets', 'ropa femenina', 'Venezuela'],
  openGraph: {
    title: 'Athenea Store — Elegancia en cada detalle',
    description:
      'Vestidos, deportivo, corsets, lencería y bikinis seleccionados para realzar tu estilo.',
    type: 'website',
    locale: 'es_VE',
    siteName: 'Athenea Store',
    images: [{ url: '/images/hero.png', width: 1200, height: 630, alt: 'Athenea Store' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Athenea Store — Elegancia en cada detalle',
    description:
      'Vestidos, deportivo, corsets, lencería y bikinis seleccionados para realzar tu estilo.',
    images: ['/images/hero.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#faf9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#1c1b19' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`bg-background ${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
