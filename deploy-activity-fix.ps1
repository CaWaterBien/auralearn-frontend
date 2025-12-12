# Deploy Activity Page Fix to Vercel
Write-Host "============================================" -ForegroundColor Green
Write-Host "DEPLOYING ACTIVITY PAGE FIX TO VERCEL" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

# Add and commit changes
Write-Host "`n📝 Adding changes..." -ForegroundColor Yellow
git add -A

Write-Host "`n📦 Committing changes..." -ForegroundColor Yellow
git commit -m "Fix React hooks error in activity page

- Fixed React Error #321 (useRef called incorrectly)
- Moved feedbackCount calculation after conditional returns
- All hooks are now called before any conditional returns
- Fixes 'Cannot read properties of undefined' error
- Activities should now load properly"

# Push to Vercel
Write-Host "`n🚀 Pushing to Vercel..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Deployment initiated!" -ForegroundColor Green
Write-Host "`n📋 The fix addresses:" -ForegroundColor Yellow
Write-Host "- React Error #321 when opening activities" -ForegroundColor White
Write-Host "- 'Cannot read properties of undefined (reading query)' error" -ForegroundColor White
Write-Host "- Activities not loading (Something went wrong page)" -ForegroundColor White

Write-Host "`n⏰ Vercel deployment usually takes 1-2 minutes" -ForegroundColor Yellow
Write-Host "Monitor deployment at: https://vercel.com/dashboard" -ForegroundColor Cyan

# Open browser for testing
Write-Host "`n🌐 Opening activity page for testing in 60 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 60
Start-Process "https://www.auralearn.xyz/activity/1"
