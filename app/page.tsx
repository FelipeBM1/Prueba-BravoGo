"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

// Interfaz para un elemento RSS individual
interface RSSItem {
  id: string
  title: string
  description: string
  content: string
  link: string
  pubDate: string
  source: string
  imageUrl?: string
}

// Interfaz para el feed RSS completo
interface RSSFeed {
  items: RSSItem[]
  lastUpdated: string
}

export default function RSSReader() {
  // Estados del componente
  const [feed, setFeed] = useState<RSSFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [visitedItems, setVisitedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Cargar elementos visitados desde localStorage
    const saved = localStorage.getItem("visitedItems")
    if (saved) {
      setVisitedItems(new Set(JSON.parse(saved)))
    }

    // Cargar datos del feed RSS
    fetchFeed()
  }, [])

  /**
   * Obtiene los datos del feed RSS desde la API
   */
  const fetchFeed = async () => {
    try {
      const response = await fetch("/api/rss")
      const data = await response.json()
      setFeed(data)
    } catch (error) {
      console.error("Error al obtener el feed RSS:", error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Alterna el estado expandido de un elemento
   * @param itemId - ID del elemento a expandir/contraer
   */
  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  /**
   * Maneja el clic en el título de un artículo
   * @param itemId - ID del elemento
   * @param link - URL del artículo original
   */
  const handleTitleClick = (itemId: string, link: string) => {
    // Marcar como visitado
    const newVisited = new Set(visitedItems)
    newVisited.add(itemId)
    setVisitedItems(newVisited)
    localStorage.setItem("visitedItems", JSON.stringify([...newVisited]))

    // Abrir en nueva pestaña
    window.open(link, "_blank")
  }

  /**
   * Formatea una fecha para mostrar
   * @param dateString - Fecha en formato string
   * @returns Fecha formateada en español
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  /**
   * Elimina etiquetas HTML de un texto
   * @param html - Texto con HTML
   * @returns Texto limpio sin HTML
   */
  const stripHtml = (html: string) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  /**
   * Trunca un texto a una longitud máxima
   * @param text - Texto a truncar
   * @param maxLength - Longitud máxima (por defecto 200)
   * @returns Texto truncado
   */
  const truncateText = (text: string, maxLength = 200) => {
    const cleaned = stripHtml(text)
    return cleaned.length > maxLength ? cleaned.substring(0, maxLength) + "..." : cleaned
  }

  // Mostrar spinner de carga
  if (loading) {
    return (
      <div className="bg-gradient p-4">
        <div className="container">
          <div className="text-center py-12">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
              style={{ borderColor: "#4f46e5", borderTopColor: "transparent" }}
            ></div>
            <p className="mt-4 text-gray-600">Cargando feeds RSS...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient p-4">
      <div className="container">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">RSS Reader</h1>
          <p className="text-gray-600 mb-4">Agregador de noticias de múltiples fuentes RSS</p>
          {feed && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Última actualización: {formatDate(feed.lastUpdated)}</span>
            </div>
          )}
        </div>

        {/* Lista de elementos RSS */}
        <div className="space-y-6">
          {feed?.items.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle
                      className={`text-xl leading-tight cursor-pointer transition-colors ${
                        visitedItems.has(item.id) ? "visited" : ""
                      }`}
                      onClick={() => handleTitleClick(item.id, item.link)}
                    >
                      {item.title}
                      <ExternalLink className="inline w-4 h-4 ml-2" />
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary">{item.source}</Badge>
                      <span className="text-sm text-gray-500">{formatDate(item.pubDate)}</span>
                      {visitedItems.has(item.id) && (
                        <Badge variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Visitado
                        </Badge>
                      )}
                    </div>
                  </div>
                  {/* Imagen destacada si existe */}
                  {item.imageUrl && (
                    <div className="flex-shrink-0">
                      <Image
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover max-h-150"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Descripción del artículo */}
                  <p className="text-gray-700 leading-relaxed">{truncateText(item.description)}</p>

                  {/* Botón para expandir/contraer contenido */}
                  <Button variant="ghost" size="sm" onClick={() => toggleExpanded(item.id)}>
                    {expandedItems.has(item.id) ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Ocultar contenido
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver contenido completo
                      </>
                    )}
                  </Button>

                  {/* Contenido expandido */}
                  {expandedItems.has(item.id) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: item.content }} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pie de página */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">RSS Reader - Actualización automática cada 24 horas</p>
        </div>
      </div>
    </div>
  )
}
