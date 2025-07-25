# 🚀 Guía de Despliegue

## Configuración de Vercel

### 1. Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con tu cuenta de GitHub
3. Conecta tu repositorio

### 2. Obtener tokens y IDs necesarios

#### A. Vercel Token
1. Ve a [Vercel Dashboard](https://vercel.com/account/tokens)
2. Crea un nuevo token
3. Copia el token generado

#### B. Organization ID
1. Ve a tu [Vercel Dashboard](https://vercel.com/dashboard)
2. En Settings > General
3. Copia el "Organization ID"

#### C. Project ID
1. Ve a tu proyecto en Vercel
2. Settings > General
3. Copia el "Project ID"

### 3. Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** > **Secrets and variables** > **Actions**
3. Agrega los siguientes **Repository secrets**:

\`\`\`
VERCEL_TOKEN=tu_token_aqui
ORG_ID=tu_org_id_aqui
PROJECT_ID=tu_project_id_aqui
\`\`\`

### 4. Variables de entorno (opcional)

En **Variables**, puedes agregar:

\`\`\`
RSS_SOURCES=[{"url":"https://dev.to/feed/tag/javascript","name":"Dev.to JavaScript"}]
\`\`\`

## Despliegue Manual

### Opción 1: Vercel CLI
\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel --prod
\`\`\`

### Opción 2: GitHub Actions
1. Ve a tu repositorio
2. **Actions** > **Actualizar Feeds RSS**
3. **Run workflow**

## Verificación del Despliegue

Después de configurar los secrets, el workflow debería mostrar:

\`\`\`
✅ Secrets de Vercel configurados correctamente.
🚀 Aplicación desplegada exitosamente a Vercel
\`\`\`

## Troubleshooting

### Error: "Input required and not supplied: vercel-token"
- Verifica que `VERCEL_TOKEN` esté configurado en GitHub Secrets
- Asegúrate de que el nombre sea exactamente `VERCEL_TOKEN`

### Error: "Project not found"
- Verifica que `PROJECT_ID` sea correcto
- Asegúrate de que el proyecto exista en Vercel

### Error: "Forbidden"
- Verifica que `ORG_ID` sea correcto
- Asegúrate de que el token tenga permisos suficientes

## URLs Útiles

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Tokens](https://vercel.com/account/tokens)
- [GitHub Secrets](https://github.com/tu-usuario/tu-repo/settings/secrets/actions)
