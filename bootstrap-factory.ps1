# ==========================================
# EatLink AI Factory Bootstrap v1
# ==========================================

Write-Host ""
Write-Host "🚀 Bootstrapping EatLink AI Factory..." -ForegroundColor Cyan
Write-Host ""

# -------------------------
# Directories
# -------------------------

$folders = @(
    "factory",
    "factory/commands",
    "factory/generators",
    "factory/templates",
    "factory/services",
    "factory/config",
    "factory/utils",
    "factory/types",
    "factory/agents"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

# -------------------------
# Files
# -------------------------

$files = @(
    "factory/index.ts",

    "factory/commands/create.ts",
    "factory/commands/doctor.ts",
    "factory/commands/help.ts",

    "factory/generators/module.generator.ts",
    "factory/generators/package.generator.ts",

    "factory/services/filesystem.ts",
    "factory/services/logger.ts",

    "factory/config/factory.config.ts",

    "factory/utils/terminal.ts",

    "factory/types/index.ts",

    "factory/agents/architect.agent.ts",
    "factory/agents/backend.agent.ts",
    "factory/agents/frontend.agent.ts",
    "factory/agents/database.agent.ts",
    "factory/agents/reviewer.agent.ts",
    "factory/agents/qa.agent.ts",
    "factory/agents/devops.agent.ts"
)

foreach ($file in $files) {

    if (!(Test-Path $file)) {

        New-Item -ItemType File -Force -Path $file | Out-Null

    }

}

Write-Host ""
Write-Host "✅ EatLink AI Factory created successfully." -ForegroundColor Green
Write-Host ""
Write-Host "Structure:"
Write-Host ""

tree factory /F

Write-Host ""
Write-Host "🎉 Bootstrap completed."
Write-Host ""