# 🚀 Despliegue en Vercel - Next.js 15

## Cambios para Next.js 15

### ✅ Correcciones realizadas:

1. **vercel.json simplificado** - Removido `name` (deprecated) y `builds` (innecesario)
2. **Next.js 15 actualizado** - Versión más reciente
3. **React 19** - Compatible con Next.js 15
4. **Configuración optimizada** - Solo lo esencial

## Despliegue Manual

### Paso 1: Limpiar y actualizar
\`\`\`bash
# Limpiar instalación anterior
rm -rf node_modules package-lock.json .next .vercel

# Instalar dependencias actualizadas
npm install

# Verificar que build funciona
npm run build
\`\`\`

### Paso 2: Desplegar con Vercel CLI
\`\`\`bash
# Desplegar
vercel --prod

# O usar el script
npm run vercel-deploy
\`\`\`

## Configuración de Vercel.json

### ❌ Antes (con errores):
\`\`\`json
{
  "name": "rss-reader-bravo",  // ❌ Deprecated
  "builds": [...],             // ❌ Conflicto con functions
  "functions": {...}           // ❌ No puede ir con builds
}
\`\`\`

### ✅ Ahora (corregido):
\`\`\`json
{
  "version": 2,
  "functions": {
    "app/api/rss/route.ts": {
      "maxDuration": 30
    }
  }
}
\`\`\`

## Verificación del Despliegue

Después del despliegue exitoso deberías ver:

\`\`\`
✅ Production: https://tu-proyecto.vercel.app
\`\`\`

## Troubleshooting

### Error: "name property deprecated"
- ✅ **Solucionado**: Removido del vercel.json

### Error: "functions cannot be used with builds"
- ✅ **Solucionado**: Removido builds, mantenido functions

### Error: "Build failed"
\`\`\`bash
# Verificar build local
npm run build

# Si falla, limpiar y reinstalar
rm -rf node_modules .next
npm install
npm run build
\`\`\`

### Error: "API timeout"
- ✅ **Configurado**: maxDuration: 30 segundos para API RSS

## Comandos Útiles

\`\`\`bash
# Ver información del proyecto
vercel ls

# Ver logs de producción
vercel logs

# Ver dominios
vercel domains

# Remover proyecto
vercel remove
\`\`\`

## Variables de Entorno en Vercel

Si necesitas configurar variables de entorno:

\`\`\`bash
# Agregar variable
vercel env add RSS_SOURCES

# Listar variables
vercel env ls

# Remover variable
vercel env rm RSS_SOURCES
\`\`\`

## URL Final

Una vez desplegado, tu aplicación estará disponible en:
\`https://tu-proyecto.vercel.app\`
