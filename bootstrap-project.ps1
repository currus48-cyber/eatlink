# =====================================================
# EatLink Bootstrap Project v1
# =====================================================

Write-Host ""
Write-Host "🚀 EatLink Bootstrap Project" -ForegroundColor Cyan
Write-Host ""

function Run($cmd) {
    Write-Host "➜ $cmd" -ForegroundColor Yellow
    Invoke-Expression $cmd
}

# -----------------------------------------
# Install Workspace Dependencies
# -----------------------------------------

Run "pnpm add -Dw typescript tsx turbo"

Run "pnpm add -Dw eslint prettier"

Run "pnpm add -Dw commander chalk ora fs-extra inquirer execa zod"

Run "pnpm add -Dw dotenv dotenv-cli"

Run "pnpm add -Dw @types/node"

# -----------------------------------------
# Git Ignore
# -----------------------------------------

$gitignore=@"

node_modules

.next

dist

coverage

.env

.env.local

.vercel

pnpm-lock.yaml

"@

if (!(Test-Path ".gitignore")){

$gitignore | Out-File ".gitignore"

}

Write-Host ""
Write-Host "✅ Bootstrap terminé." -ForegroundColor Green