import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

// Configuración específica para Vercel - Next.js 15
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

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

// Configuración de fuentes RSS
const RSS_SOURCES = [
  {
    url: "https://dev.to/feed/tag/javascript",
    name: "Dev.to JavaScript",
  },
  {
    url: "https://hnrss.org/newest",
    name: "Hacker News",
  },
  {
    url: "https://www.genbeta.com/feedburner.xml",
    name: "Genbeta",
  },
]

/**
 * Parser XML simple para feeds RSS
 * @param xmlString - Contenido XML como string
 * @returns Datos RSS parseados
 */
function parseRSSXML(xmlString: string) {
  const items: any[] = []

  try {
    // Extraer elementos usando regex (enfoque simple)
    const itemMatches = xmlString.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []

    itemMatches.forEach((itemXml) => {
      const item: any = {}

      // Extraer título
      const titleMatch = itemXml.match(/<title[^>]*><!\[CDATA\[(.*?)\]\]><\/title>|<title[^>]*>(.*?)<\/title>/i)
      item.title = titleMatch ? (titleMatch[1] || titleMatch[2] || "").trim() : ""

      // Extraer descripción
      const descMatch = itemXml.match(
        /<description[^>]*><!\[CDATA\[(.*?)\]\]><\/description>|<description[^>]*>(.*?)<\/description>/i,
      )
      item.description = descMatch ? (descMatch[1] || descMatch[2] || "").trim() : ""

      // Extraer contenido
      const contentMatch = itemXml.match(
        /<content:encoded[^>]*><!\[CDATA\[(.*?)\]\]><\/content:encoded>|<content[^>]*>(.*?)<\/content>/i,
      )
      item.content = contentMatch ? (contentMatch[1] || contentMatch[2] || "").trim() : item.description

      // Extraer enlace
      const linkMatch = itemXml.match(/<link[^>]*>(.*?)<\/link>/i)
      item.link = linkMatch ? linkMatch[1].trim() : ""

      // Extraer fecha de publicación
      const dateMatch = itemXml.match(/<pubDate[^>]*>(.*?)<\/pubDate>|<published[^>]*>(.*?)<\/published>/i)
      item.pubDate = dateMatch ? (dateMatch[1] || dateMatch[2] || "").trim() : ""

      // Extraer GUID
      const guidMatch = itemXml.match(/<guid[^>]*>(.*?)<\/guid>/i)
      item.guid = guidMatch ? guidMatch[1].trim() : ""

      // Extraer imagen desde enclosure
      const enclosureMatch = itemXml.match(/<enclosure[^>]*url="([^"]*)"[^>]*type="image[^"]*"/i)
      if (enclosureMatch) {
        item.imageUrl = enclosureMatch[1]
      }

      // Extraer imagen desde contenido
      if (!item.imageUrl && item.content) {
        const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/i)
        if (imgMatch) {
          item.imageUrl = imgMatch[1]
        }
      }

      items.push(item)
    })
  } catch (error) {
    console.error("Error parseando XML:", error)
  }

  return { items }
}

/**
 * Extrae texto limpio de HTML
 * @param html - String HTML
 * @returns Texto limpio
 */
function stripHtml(html: string): string {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, "") // Remover etiquetas HTML
    .replace(/&nbsp;/g, " ") // Reemplazar &nbsp; con espacio
    .replace(/&amp;/g, "&") // Reemplazar &amp; con &
    .replace(/&lt;/g, "<") // Reemplazar &lt; con <
    .replace(/&gt;/g, ">") // Reemplazar &gt; con >
    .replace(/&quot;/g, '"') // Reemplazar &quot; con "
    .replace(/&#39;/g, "'") // Reemplazar &#39; con '
    .trim()
}

/**
 * Obtiene y parsea feed RSS de una fuente individual
 * @param source - Configuración de fuente RSS
 * @returns Elementos RSS parseados
 */
async function fetchRSSSource(source: { url: string; name: string }): Promise<RSSItem[]> {
  try {
    console.log(`Obteniendo RSS de: ${source.name} (${source.url})`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 segundos timeout

    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "RSS-Reader/1.0",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`)
    }

    const xmlText = await response.text()

    if (!xmlText || xmlText.trim().length === 0) {
      throw new Error("Respuesta XML vacía")
    }

    const feed = parseRSSXML(xmlText)

    return feed.items.map((item, index) => ({
      id: `${source.name}-${item.guid || item.link || index}`,
      title: stripHtml(item.title || "Sin título"),
      description: stripHtml(item.description || "Sin descripción").substring(0, 300),
      content: item.content || item.description || "Sin contenido",
      link: item.link || "#",
      pubDate: item.pubDate || new Date().toISOString(),
      source: source.name,
      imageUrl: item.imageUrl,
    }))
  } catch (error) {
    console.error(`Error obteniendo RSS de ${source.name}:`, error)
    return []
  }
}

/**
 * Obtiene todas las fuentes RSS y las combina
 * @returns Feed RSS combinado y ordenado
 */
async function fetchAllRSSFeeds(): Promise<RSSFeed> {
  const allItems: RSSItem[] = []

  // Obtener todas las fuentes en paralelo con Promise.allSettled para manejar errores
  const promises = RSS_SOURCES.map((source) => fetchRSSSource(source))
  const results = await Promise.allSettled(promises)

  // Combinar todos los elementos exitosos
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      allItems.push(...result.value)
    }
  })

  // Ordenar por fecha de publicación (más recientes primero)
  allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime()
    const dateB = new Date(b.pubDate).getTime()
    return dateB - dateA
  })

  return {
    items: allItems.slice(0, 50), // Limitar a 50 elementos más recientes
    lastUpdated: new Date().toISOString(),
  }
}

/**
 * Guarda datos del feed RSS en archivo estático
 * @param feed - Datos del feed RSS
 */
async function saveFeedData(feed: RSSFeed): Promise<void> {
  try {
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    const filePath = path.join(dataDir, "rss-feed.json")
    await fs.writeFile(filePath, JSON.stringify(feed, null, 2))

    console.log("Datos del feed RSS guardados exitosamente")
  } catch (error) {
    console.error("Error guardando datos del feed RSS:", error)
  }
}

/**
 * Carga datos del feed RSS desde archivo estático
 * @returns Datos del feed RSS o null si no se encuentra
 */
async function loadFeedData(): Promise<RSSFeed | null> {
  try {
    const filePath = path.join(process.cwd(), "data", "rss-feed.json")
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.log("No se encontraron datos existentes del feed RSS, obteniendo datos frescos")
    return null
  }
}

export async function GET() {
  try {
    console.log("🚀 Iniciando obtención de feeds RSS...")

    // Intentar cargar datos existentes primero
    let feed = await loadFeedData()

    // Si no hay datos o los datos son más antiguos de 1 hora
    if (!feed || new Date().getTime() - new Date(feed.lastUpdated).getTime() > 60 * 60 * 1000) {
      console.log("📡 Obteniendo datos frescos de RSS...")
      feed = await fetchAllRSSFeeds()
      await saveFeedData(feed)
    } else {
      console.log("📋 Usando datos RSS en cache")
    }

    console.log(`✅ Devolviendo ${feed.items.length} elementos RSS`)

    return NextResponse.json(feed, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("❌ Error en la API RSS:", error)

    // Devolver un feed vacío en caso de error
    const errorFeed: RSSFeed = {
      items: [],
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(errorFeed, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
