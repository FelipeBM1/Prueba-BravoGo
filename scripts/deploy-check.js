/**
 * Script para verificar configuración de despliegue
 * Ejecutar con: node scripts/deploy-check.js
 */

const fs = require("fs")
const path = require("path")

function checkDeploymentConfig() {
  console.log("🔍 Verificando configuración de despliegue...\n")

  // Verificar archivos necesarios
  const requiredFiles = ["package.json", "next.config.mjs", "vercel.json", ".github/workflows/update-rss.yml"]

  console.log("📁 Verificando archivos necesarios:")
  requiredFiles.forEach((file) => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`❌ ${file} - FALTANTE`)
    }
  })

  // Verificar package.json
  console.log("\n📦 Verificando package.json:")
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))

    const requiredScripts = ["dev", "build", "start", "fetch-rss"]
    requiredScripts.forEach((script) => {
      if (pkg.scripts && pkg.scripts[script]) {
        console.log(`✅ Script "${script}": ${pkg.scripts[script]}`)
      } else {
        console.log(`❌ Script "${script}" - FALTANTE`)
      }
    })

    const requiredDeps = ["next", "react", "react-dom"]
    requiredDeps.forEach((dep) => {
      if (pkg.dependencies && pkg.dependencies[dep]) {
        console.log(`✅ Dependencia "${dep}": ${pkg.dependencies[dep]}`)
      } else {
        console.log(`❌ Dependencia "${dep}" - FALTANTE`)
      }
    })
  } catch (error) {
    console.log("❌ Error leyendo package.json:", error.message)
  }

  // Verificar estructura de directorios
  console.log("\n📂 Verificando estructura de directorios:")
  const requiredDirs = ["app", "components", "lib", "scripts"]
  requiredDirs.forEach((dir) => {
    if (fs.existsSync(path.join(process.cwd(), dir))) {
      console.log(`✅ ${dir}/`)
    } else {
      console.log(`❌ ${dir}/ - FALTANTE`)
    }
  })

  // Instrucciones para GitHub Secrets
  console.log("\n🔐 Para configurar GitHub Secrets:")
  console.log("1. Ve a: https://github.com/TU-USUARIO/TU-REPO/settings/secrets/actions")
  console.log("2. Agrega estos secrets:")
  console.log("   - VERCEL_TOKEN: (obtén de https://vercel.com/account/tokens)")
  console.log("   - ORG_ID: (obtén de Vercel Dashboard > Settings)")
  console.log("   - PROJECT_ID: (obtén de tu proyecto en Vercel > Settings)")

  console.log("\n🚀 Una vez configurados los secrets, el despliegue será automático!")
}

// Ejecutar verificación
if (require.main === module) {
  checkDeploymentConfig()
}

module.exports = { checkDeploymentConfig }
