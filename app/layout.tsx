import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RSS Reader - Agregador de Noticias",
  description: "Lector de RSS que agrega múltiples fuentes de noticias en un solo lugar",
  keywords: "RSS, noticias, agregador, feeds, JavaScript, desarrollo",
  authors: [{ name: "RSS Reader" }],
  openGraph: {
    title: "RSS Reader - Agregador de Noticias",
    description: "Lector de RSS que agrega múltiples fuentes de noticias en un solo lugar",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
