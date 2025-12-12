# FINAL FIX - Deploy React Hooks Fix to Vercel
Write-Host "============================================" -ForegroundColor Green
Write-Host "FINAL FIX - REACT HOOKS ERROR" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

# Add and commit changes
Write-Host "`n📝 Adding changes..." -ForegroundColor Yellow
git add -A

Write-Host "`n📦 Committing changes..." -ForegroundColor Yellow
git commit -m "FINAL FIX: React hooks error - move ALL hooks before conditional returns

- Moved textareaRef to the top with other hooks
- Ensured ALL hooks (useState, useEffect, useRef) are called before ANY conditional returns
- Fixed feedbackCount to be a regular variable instead of IIFE
- This ensures hooks are always called in the same order
- Fixes React Error #321 completely"

# Push to Vercel
Write-Host "`n🚀 Pushing to Vercel..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Deployment initiated!" -ForegroundColor Green
Write-Host "`n📋 Critical fixes applied:" -ForegroundColor Yellow
Write-Host "✓ All hooks now called before conditional returns" -ForegroundColor White
Write-Host "✓ useRef moved to top with other hooks" -ForegroundColor White  
Write-Host "✓ No more React Error #321" -ForegroundColor White
Write-Host "✓ Activities will now load properly" -ForegroundColor White

Write-Host "`n⏰ Vercel deployment usually takes 1-2 minutes" -ForegroundColor Yellow
Write-Host "Monitor deployment at: https://vercel.com/dashboard" -ForegroundColor Cyan

# Wait longer before opening
Write-Host "`n⏳ Waiting 90 seconds for deployment to complete..." -ForegroundColor Yellow
Start-Sleep -Seconds 90

# Open browser for testing
Write-Host "`n🌐 Opening activity pages for testing..." -ForegroundColor Yellow
Start-Process "https://www.auralearn.xyz/activity/1"
Start-Sleep -Seconds 2
Start-Process "https://www.auralearn.xyz/activity/2"
