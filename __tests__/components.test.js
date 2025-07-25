"use client"

/**
 * Tests de Componentes UI
 * Pruebas unitarias para los componentes de la interfaz
 */

import { render, screen, fireEvent } from "@testing-library/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { jest } from "@jest/globals"

// Mock de jest está disponible globalmente
const mockFn = jest.fn

describe("Componentes UI", () => {
  describe("Card", () => {
    test("debería renderizar correctamente", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Título de prueba</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Contenido de prueba</p>
          </CardContent>
        </Card>,
      )

      expect(screen.getByText("Título de prueba")).toBeInTheDocument()
      expect(screen.getByText("Contenido de prueba")).toBeInTheDocument()
    })

    test("debería aplicar clases CSS correctas", () => {
      const { container } = render(<Card data-testid="card">Contenido</Card>)
      const card = container.firstChild
      expect(card).toHaveClass("card")
    })
  })

  describe("Button", () => {
    test("debería renderizar con texto", () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText("Click me")).toBeInTheDocument()
    })

    test("debería manejar clicks", () => {
      const handleClick = mockFn()
      render(<Button onClick={handleClick}>Click me</Button>)

      fireEvent.click(screen.getByText("Click me"))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    test("debería aplicar variantes correctas", () => {
      const { rerender } = render(<Button variant="ghost">Ghost Button</Button>)
      expect(screen.getByText("Ghost Button")).toHaveClass("btn-ghost")

      rerender(<Button variant="default">Default Button</Button>)
      expect(screen.getByText("Default Button")).toHaveClass("btn-default")
    })

    test("debería estar deshabilitado cuando disabled=true", () => {
      render(<Button disabled>Disabled Button</Button>)
      expect(screen.getByText("Disabled Button")).toBeDisabled()
    })
  })

  describe("Badge", () => {
    test("debería renderizar con texto", () => {
      render(<Badge>Test Badge</Badge>)
      expect(screen.getByText("Test Badge")).toBeInTheDocument()
    })

    test("debería aplicar variantes correctas", () => {
      const { rerender } = render(<Badge variant="secondary">Secondary</Badge>)
      expect(screen.getByText("Secondary")).toHaveClass("badge-secondary")

      rerender(<Badge variant="outline">Outline</Badge>)
      expect(screen.getByText("Outline")).toHaveClass("badge-outline")
    })
  })
})
