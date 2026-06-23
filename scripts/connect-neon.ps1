# Conecta Neon Postgres al proyecto Vercel de Glow Up.
# Requisito: `vercel login` completado.

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Verificando sesion de Vercel..."
vercel whoami

if (-not (Test-Path ".vercel\project.json")) {
  Write-Host "Vinculando proyecto glow-up..."
  vercel link --yes --project glow-up
}

Write-Host "Provisionando Neon Postgres..."
vercel integration add neon `
  --name glow-up-db `
  -m region=iad1 `
  -m auth=false `
  -e production `
  -e preview `
  -e development

Write-Host "Sincronizando variables locales..."
vercel env pull .env.local --yes

Write-Host "Listo. Reinicia el servidor de desarrollo si estaba corriendo."