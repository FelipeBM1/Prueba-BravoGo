#!/bin/bash

echo "🚀 Desplegando a Vercel..."

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Limpiar build anterior
echo "🧹 Limpiando build anterior..."
rm -rf .next

# Verificar que el build funciona localmente
echo "🔨 Verificando build local..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build local exitoso"
    
    # Desplegar a Vercel
    echo "🚀 Desplegando a producción..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 ¡Despliegue exitoso!"
        echo "📱 Tu aplicación está disponible en la URL mostrada arriba"
    else
        echo "❌ Error en el despliegue"
        exit 1
    fi
else
    echo "❌ Build local falló. Revisa los errores antes de desplegar."
    exit 1
fi
