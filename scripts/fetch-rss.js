/**
 * Script de Obtención de RSS
 * Este script obtiene feeds RSS y genera datos estáticos
 * Usado por GitHub Actions para actualizaciones automáticas
 */

const fs = require("fs").promises
const path = require("path")

// Configuración de fuentes RSS - puede ser sobrescrita por variables de entorno
const RSS_SOURCES = process.env.RSS_SOURCES
  ? JSON.parse(process.env.RSS_SOURCES)
  : [
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
 * @param {string} xmlString - Contenido XML como string
 * @returns {Object} Datos RSS parseados
 */
function parseRSSXML(xmlString) {
  const items = []

  try {
    // Extraer elementos usando regex
    const itemMatches = xmlString.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []

    itemMatches.forEach((itemXml) => {
      const item = {}

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
 * Elimina etiquetas HTML del texto
 * @param {string} html - String HTML
 * @returns {string} Texto limpio
 */
function stripHtml(html) {
  if (!html) return ""
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

/**
 * Obtiene y parsea feed RSS de una fuente individual
 * @param {Object} source - Configuración de fuente RSS
 * @returns {Promise<Array>} Elementos RSS parseados
 */
async function fetchRSSSource(source) {
  try {
    console.log(`Obteniendo RSS de: ${source.name} (${source.url})`)

    const response = await fetch(source.url, {
      headers: {
        "User-Agent": "RSS-Reader/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`)
    }

    const xmlText = await response.text()

    if (!xmlText || xmlText.trim().length === 0) {
      throw new Error("Respuesta XML vacía")
    }

    const feed = parseRSSXML(xmlText)

    const items = feed.items.map((item, index) => ({
      id: `${source.name}-${item.guid || item.link || index}`,
      title: stripHtml(item.title || "Sin título"),
      description: stripHtml(item.description || "Sin descripción").substring(0, 300),
      content: item.content || item.description || "Sin contenido",
      link: item.link || "#",
      pubDate: item.pubDate || new Date().toISOString(),
      source: source.name,
      imageUrl: item.imageUrl,
    }))

    console.log(`✅ Obtenidos ${items.length} elementos de ${source.name}`)
    return items
  } catch (error) {
    console.error(`❌ Error obteniendo RSS de ${source.name}:`, error.message)
    return []
  }
}

/**
 * Función principal para obtener todos los feeds RSS y guardar datos
 */
async function main() {
  try {
    console.log("🚀 Iniciando proceso de obtención de RSS...")
    console.log(`📡 Fuentes configuradas: ${RSS_SOURCES.length}`)

    const allItems = []

    // Obtener todas las fuentes en paralelo con manejo de errores
    const promises = RSS_SOURCES.map(async (source) => {
      try {
        return await fetchRSSSource(source)
      } catch (error) {
        console.error(`Error procesando ${source.name}:`, error)
        return []
      }
    })

    const results = await Promise.allSettled(promises)

    // Combinar todos los elementos exitosos
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const items = result.value
        allItems.push(...items)
        console.log(`📄 Agregados ${items.length} elementos de ${RSS_SOURCES[index].name}`)
      } else {
        console.error(`❌ Falló la fuente ${RSS_SOURCES[index].name}:`, result.reason)
      }
    })

    if (allItems.length === 0) {
      console.warn("⚠️  No se obtuvieron elementos RSS de ninguna fuente")
      // Crear un feed vacío pero válido
      const feed = {
        items: [],
        lastUpdated: new Date().toISOString(),
      }

      // Asegurar que el directorio de datos existe
      const dataDir = path.join(process.cwd(), "data")
      await fs.mkdir(dataDir, { recursive: true })

      // Guardar en archivo JSON
      const filePath = path.join(dataDir, "rss-feed.json")
      await fs.writeFile(filePath, JSON.stringify(feed, null, 2))

      console.log(`📝 Guardado feed vacío en ${filePath}`)
      return
    }

    // Ordenar por fecha de publicación (más recientes primero)
    allItems.sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime()
      const dateB = new Date(b.pubDate).getTime()
      return dateB - dateA
    })

    const feed = {
      items: allItems.slice(0, 50), // Limitar a 50 elementos más recientes
      lastUpdated: new Date().toISOString(),
    }

    // Asegurar que el directorio de datos existe
    const dataDir = path.join(process.cwd(), "data")
    await fs.mkdir(dataDir, { recursive: true })

    // Guardar en archivo JSON
    const filePath = path.join(dataDir, "rss-feed.json")
    await fs.writeFile(filePath, JSON.stringify(feed, null, 2))

    console.log(`✅ Guardados exitosamente ${feed.items.length} elementos RSS en ${filePath}`)
    console.log(`🕒 Última actualización: ${feed.lastUpdated}`)
    console.log(`🎉 Proceso completado exitosamente`)
  } catch (error) {
    console.error("❌ Error crítico en el proceso de obtención de RSS:", error)
    process.exit(1)
  }
}

// Ejecutar el script solo si es llamado directamente
if (require.main === module) {
  main()
}

// Exportar funciones para testing
module.exports = { main, fetchRSSSource, stripHtml, parseRSSXML }
