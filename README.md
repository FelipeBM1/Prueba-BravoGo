# RSS Reader - Agregador de Noticias

Un lector de RSS moderno que agrega múltiples fuentes de noticias en un solo lugar, desarrollado como solución para la prueba técnica de Bravo Go.

## 🚀 Características

- **Agregación Multi-fuente**: Combina feeds RSS de diferentes fuentes
- **Actualización Automática**: Refrescado cada 24 horas mediante GitHub Actions
- **Interfaz Moderna**: Diseño responsive y atractivo
- **Marcado de Leídos**: Seguimiento de artículos visitados
- **Expansión de Contenido**: Ver contenido completo sin salir de la página
- **Preview de Imágenes**: Muestra imágenes destacadas de los artículos
- **Generación Estática**: Páginas pre-generadas para mejor rendimiento

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Componentes personalizados con shadcn/ui
- **RSS Parsing**: Parser XML personalizado con fetch nativo
- **CI/CD**: GitHub Actions
- **Deploy**: Vercel
- **Testing**: Jest, Testing Library

## 📋 Fuentes RSS Configuradas

Por defecto, el sistema agrega las siguientes fuentes:

1. **Dev.to JavaScript**: `https://dev.to/feed/tag/javascript`
2. **Hacker News**: `https://hnrss.org/newest`
3. **Genbeta**: `https://www.genbeta.com/feedburner.xml`

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Cuenta de GitHub (para CI/CD)
- Cuenta de Vercel (para deploy)

### Instalación Local

1. **Clonar el repositorio**
   \`\`\`bash
   git clone https://github.com/tu-usuario/rss-reader.git
   cd rss-reader
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   npm install
   \`\`\`

3. **Ejecutar en modo desarrollo**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Abrir en el navegador**
   \`\`\`
   http://localhost:3000
   \`\`\`

### Configuración de Fuentes RSS

Las fuentes RSS se pueden configurar de dos maneras:

#### 1. Variable de Entorno (Recomendado)

Crear un archivo `.env.local`:

\`\`\`env
RSS_SOURCES='[
  {
    "url": "https://dev.to/feed/tag/javascript",
    "name": "Dev.to JavaScript"
  },
  {
    "url": "https://hnrss.org/newest",
    "name": "Hacker News"
  },
  {
    "url": "https://www.genbeta.com/feedburner.xml",
    "name": "Genbeta"
  }
]'
\`\`\`

#### 2. Modificar el Script

Editar `scripts/fetch-rss.js` y modificar la constante `RSS_SOURCES`.

## 🔄 Automatización y Deploy

### GitHub Actions

El proyecto incluye un workflow de GitHub Actions que:

1. Se ejecuta automáticamente cada 24 horas
2. Puede ejecutarse manualmente
3. Actualiza los feeds RSS
4. Ejecuta tests
5. Despliega a Vercel

### Configuración de Secrets

En tu repositorio de GitHub, configura los siguientes secrets:

\`\`\`
VERCEL_TOKEN=tu_token_de_vercel
ORG_ID=tu_org_id_de_vercel
PROJECT_ID=tu_project_id_de_vercel
\`\`\`

### Deploy Manual

\`\`\`bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# O desplegar a Vercel
npx vercel --prod
\`\`\`

## 🧪 Testing

\`\`\`bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm test -- --coverage
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
rss-reader/
├── app/                    # Next.js App Router
│   ├── api/rss/           # API endpoint para RSS
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes UI personalizados
│   └── ui/               # Componentes base (Card, Button, Badge)
├── lib/                  # Utilidades y helpers
├── scripts/              # Scripts de automatización
│   └── fetch-rss.js      # Script de fetch RSS
├── __tests__/            # Tests unitarios
├── data/                 # Datos estáticos generados
├── .github/workflows/    # GitHub Actions
└── README.md
\`\`\`

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm start` - Servidor de producción
- `npm run lint` - Linter
- `npm test` - Ejecutar tests
- `npm run fetch-rss` - Actualizar feeds RSS manualmente

## 📊 Funcionalidades Implementadas

### ✅ Requerimientos Cumplidos

- [x] Lectura de múltiples feeds RSS
- [x] Ordenamiento por fecha
- [x] Título y resumen de artículos
- [x] Expansión de contenido completo
- [x] Enlaces a artículos originales
- [x] Marcado de artículos visitados
- [x] Preview de imágenes (máx. 150px)
- [x] Actualización automática cada 24h
- [x] Página estática generada
- [x] Deploy público
- [x] Fuentes RSS configurables
- [x] Tests unitarios
- [x] Documentación completa
- [x] CI/CD con GitHub Actions

### 🎨 Características Adicionales

- Interfaz responsive y moderna
- Indicadores de estado de carga
- Manejo de errores robusto
- Optimización de imágenes
- SEO optimizado
- Accesibilidad mejorada
- Parser XML personalizado sin dependencias externas

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de CORS**: El parser personalizado maneja esto usando fetch nativo.

2. **Imágenes no cargan**: Se implementa fallback automático para imágenes rotas.

3. **Feeds lentos**: El timeout está configurado para manejar feeds lentos.

### Logs y Debugging

\`\`\`bash
# Ver logs del script RSS
npm run fetch-rss

# Verificar datos generados
cat data/rss-feed.json
\`\`\`

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit los cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autor

Desarrollado como prueba técnica para Bravo Go.

---

## 📞 Soporte

Si tienes problemas con la implementación:

1. Revisa la documentación
2. Verifica los logs de GitHub Actions
3. Comprueba la configuración de variables de entorno
4. Abre un issue en el repositorio

---

**Nota**: Este proyecto demuestra habilidades en desarrollo full-stack, automatización, testing y deploy, siguiendo las mejores prácticas de desarrollo moderno. Todos los comentarios están en español para facilitar el mantenimiento y comprensión del código.
