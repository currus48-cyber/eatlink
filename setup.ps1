# ==========================================
# EatLink Project Bootstrap
# ==========================================

Write-Host ""
Write-Host "🚀 Creating EatLink structure..." -ForegroundColor Green
Write-Host ""

$folders = @(
    "apps/dashboard",
    "apps/landing",

    "packages/ai",
    "packages/auth",
    "packages/booking",
    "packages/catalog",
    "packages/core",
    "packages/customer",
    "packages/import-engine",
    "packages/notification",
    "packages/shared",
    "packages/ui",

    "database",
    "docs",
    "agents",
    "prompts"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

Write-Host "✅ Folder structure created." -ForegroundColor Green

# Create README files
$readmes = @(
    "apps/dashboard/README.md",
    "apps/landing/README.md",
    "packages/ai/README.md",
    "packages/auth/README.md",
    "packages/booking/README.md",
    "packages/catalog/README.md",
    "packages/core/README.md",
    "packages/customer/README.md",
    "packages/import-engine/README.md",
    "packages/notification/README.md",
    "packages/shared/README.md",
    "packages/ui/README.md"
)

foreach ($file in $readmes) {
    if (!(Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
    }
}

Write-Host "✅ Package placeholders created." -ForegroundColor Green

Write-Host ""
Write-Host "🎉 EatLink bootstrap completed!" -ForegroundColor Cyan
Write-Host ""