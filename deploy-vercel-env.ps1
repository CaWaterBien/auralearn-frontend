# Vercel Environment Variables Setup and Deployment Script
# This script sets all required environment variables and deploys to Vercel

$ErrorActionPreference = "Continue"

Write-Host "🚀 Setting up Vercel environment variables and deploying..." -ForegroundColor Green
Write-Host ""

# Environment variables configuration
$envVars = @{
    "NEXT_PUBLIC_API_BASE" = "https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"
    "NEXT_PUBLIC_ADMIN_API_BASE" = "https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"
    "NEXT_PUBLIC_USER_API_BASE" = "https://limitless-caverns-03788-f84f5932a44c.herokuapp.com"
    "NEXT_PUBLIC_APP_NAME" = "AuraLearn"
}

$environments = @("production", "preview", "development")

# Function to set environment variable
function Set-VercelEnv {
    param(
        [string]$Key,
        [string]$Value,
        [string]$Environment
    )
    
    Write-Host "  Setting $Key for $Environment..." -ForegroundColor Gray -NoNewline
    
    try {
        # Create a temporary file with the value
        $tempFile = [System.IO.Path]::GetTempFileName()
        $Value | Out-File -FilePath $tempFile -Encoding utf8 -NoNewline
        
        # Use the file as input to vercel env add
        $process = Start-Process -FilePath "vercel" -ArgumentList "env", "add", $Key, $Environment, "--force" -NoNewWindow -Wait -PassThru -RedirectStandardInput $tempFile
        
        Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
        
        if ($process.ExitCode -eq 0) {
            Write-Host " ✅" -ForegroundColor Green
            return $true
        } else {
            Write-Host " ⚠️  (may already exist)" -ForegroundColor Yellow
            return $false
        }
    } catch {
        Write-Host " ❌ Error: $_" -ForegroundColor Red
        return $false
    }
}

# Set environment variables using Vercel CLI with API approach
Write-Host "📝 Setting environment variables via Vercel CLI..." -ForegroundColor Yellow
Write-Host ""

# Alternative approach: Use vercel env commands with stdin
foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Setting $key..." -ForegroundColor Cyan
    
    foreach ($env in $environments) {
        # Try to add the environment variable
        $command = "echo '$value' | vercel env add '$key' '$env' --force"
        
        try {
            # Use cmd to execute with pipe
            $result = cmd /c "$command" 2>&1
            if ($LASTEXITCODE -eq 0 -or $result -match "already exists" -or $result -match "Added") {
                Write-Host "  ✅ $env" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  $env - May need manual update" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ⚠️  $env - Error: $_" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

Write-Host "✅ Environment variables configuration attempted!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Note: If any variables failed, you may need to set them manually in Vercel dashboard:" -ForegroundColor Yellow
Write-Host "   https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel Production..." -ForegroundColor Green
Write-Host ""

# Deploy to production
$deployResult = vercel --prod --yes 2>&1
$deployExitCode = $LASTEXITCODE

if ($deployExitCode -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment initiated!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your app will be available at: https://capstone-app-lyart.vercel.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Yellow
    Write-Host "   1. Verify environment variables are set in Vercel dashboard" -ForegroundColor White
    Write-Host "   2. Wait for deployment to complete" -ForegroundColor White
    Write-Host "   3. Test your app at the URL above" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment may have issues. Check output above." -ForegroundColor Red
    Write-Host ""
    Write-Host "You can also deploy manually with: vercel --prod" -ForegroundColor Yellow
}

