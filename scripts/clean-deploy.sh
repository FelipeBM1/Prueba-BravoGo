#!/bin/bash

echo "🧹 Limpiando proyecto para despliegue..."

# Remover archivos de build y cache
rm -rf .next
rm -rf .vercel
rm -rf node_modules/.cache

echo "🔨 Verificando build local..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build local exitoso"
    echo "🚀 Desplegando a Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "🎉 ¡Despliegue exitoso!"
    else
        echo "❌ Error en el despliegue"
        exit 1
    fi
else
    echo "❌ Build local falló"
    exit 1
fi
