# Simple Vercel Deployment Script
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
Write-Host ""

# Change to the project directory
Set-Location $PSScriptRoot

# Deploy to production
Write-Host "📦 Building and deploying to Vercel Production..." -ForegroundColor Yellow
Write-Host ""

vercel --prod --yes

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: You need to set environment variables in Vercel dashboard:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Go to: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "   2. Click on your project: capstone-app" -ForegroundColor Cyan
Write-Host "   3. Go to: Settings -> Environment Variables" -ForegroundColor Cyan
Write-Host "   4. Add these 4 variables:" -ForegroundColor Cyan
Write-Host ""
Write-Host "      NEXT_PUBLIC_API_BASE=https://limitless-caverns-03788-f84f5932a44c.herokuapp.com" -ForegroundColor White
Write-Host "      NEXT_PUBLIC_ADMIN_API_BASE=https://limitless-caverns-03788-f84f5932a44c.herokuapp.com" -ForegroundColor White
Write-Host "      NEXT_PUBLIC_USER_API_BASE=https://limitless-caverns-03788-f84f5932a44c.herokuapp.com" -ForegroundColor White
Write-Host "      NEXT_PUBLIC_APP_NAME=AuraLearn" -ForegroundColor White
Write-Host ""
Write-Host "   5. Enable for: Production, Preview, Development" -ForegroundColor Cyan
Write-Host "   6. Redeploy after setting variables" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Your app: https://capstone-app-lyart.vercel.app" -ForegroundColor Cyan
Write-Host ""

