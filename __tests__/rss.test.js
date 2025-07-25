/**
 * Tests del Lector RSS
 * Pruebas unitarias para parsing RSS y procesamiento de datos
 */

const { fetchRSSSource, stripHtml } = require("../scripts/fetch-rss")
const jest = require("jest")

describe("Lector RSS", () => {
  describe("stripHtml", () => {
    test("debería eliminar etiquetas HTML básicas", () => {
      const html = "<p>Texto de prueba</p>"
      expect(stripHtml(html)).toBe("Texto de prueba")
    })

    test("debería manejar entidades HTML", () => {
      const html = "Texto con &amp; entidades &lt;test&gt;"
      expect(stripHtml(html)).toBe("Texto con & entidades <test>")
    })

    test("debería manejar texto sin HTML", () => {
      const text = "Solo texto plano"
      expect(stripHtml(text)).toBe("Solo texto plano")
    })

    test("debería eliminar espacios extra", () => {
      const html = "  <p>  Texto con espacios  </p>  "
      expect(stripHtml(html)).toBe("Texto con espacios")
    })
  })

  describe("fetchRSSSource", () => {
    // Mock de fetch global
    global.fetch = jest.fn()

    beforeEach(() => {
      fetch.mockClear()
    })

    test("debería manejar respuesta RSS exitosa", async () => {
      const mockXML = `
        <rss>
          <channel>
            <item>
              <title>Artículo de Prueba</title>
              <description>Descripción de prueba</description>
              <link>https://ejemplo.com/articulo</link>
              <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
              <guid>test-guid</guid>
            </item>
          </channel>
        </rss>
      `

      fetch.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(mockXML),
      })

      const source = {
        url: "https://ejemplo.com/feed.xml",
        name: "Fuente de Prueba",
      }

      const result = await fetchRSSSource(source)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        title: "Artículo de Prueba",
        description: "Descripción de prueba",
        link: "https://ejemplo.com/articulo",
        source: "Fuente de Prueba",
      })
    })

    test("debería manejar errores de red graciosamente", async () => {
      fetch.mockRejectedValue(new Error("Error de red"))

      const source = {
        url: "https://url-invalida.com/feed.xml",
        name: "Fuente Inválida",
      }

      const result = await fetchRSSSource(source)

      expect(result).toEqual([])
    })

    test("debería manejar respuestas HTTP de error", async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
      })

      const source = {
        url: "https://ejemplo.com/feed-inexistente.xml",
        name: "Fuente Inexistente",
      }

      const result = await fetchRSSSource(source)

      expect(result).toEqual([])
    })
  })
})
