# Vercel Deployment Script with Environment Variables
# This script sets environment variables and deploys to Vercel

Write-Host "🚀 Deploying to Vercel with environment variables..." -ForegroundColor Green
Write-Host ""

# Set environment variables
$envVars = @(
    @{Key="NEXT_PUBLIC_API_BASE"; Value="https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"},
    @{Key="NEXT_PUBLIC_ADMIN_API_BASE"; Value="https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"},
    @{Key="NEXT_PUBLIC_USER_API_BASE"; Value="https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"},
    @{Key="NEXT_PUBLIC_APP_NAME"; Value="AuraLearn"}
)

$environments = @("production", "preview", "development")

foreach ($envVar in $envVars) {
    Write-Host "Setting $($envVar.Key)..." -ForegroundColor Yellow
    foreach ($env in $environments) {
        Write-Host "  - Adding to $env environment..." -ForegroundColor Gray
        # Use echo to pipe value to vercel env add
        $envVar.Value | vercel env add $envVar.Key $env --force 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    ✅ Added to $env" -ForegroundColor Green
        } else {
            Write-Host "    ⚠️  May already exist in $env, skipping..." -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "✅ Environment variables set!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
Write-Host ""

# Deploy to production
vercel --prod --yes

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your app should be live at: https://capstone-app-lyart.vercel.app" -ForegroundColor Cyan
Write-Host ""

