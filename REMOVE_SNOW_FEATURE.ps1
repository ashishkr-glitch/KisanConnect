# Snow Feature Removal Script
# One-click script to fully remove the snow feature from KisanConnect
# Run this from the project root directory: powershell .\REMOVE_SNOW_FEATURE.ps1

Write-Host "🔥 Starting Snow Feature Removal..." -ForegroundColor Cyan
Write-Host "This will delete files and remove related imports." -ForegroundColor Yellow
Write-Host ""

$ProjectRoot = Get-Location
$FrontendRoot = Join-Path $ProjectRoot "frontend"

# Step 1: Delete public/snowfall.js
Write-Host "Step 1: Removing public/snowfall.js..." -ForegroundColor Magenta
$SnowfallFile = Join-Path $FrontendRoot "public\snowfall.js"
if (Test-Path $SnowfallFile) {
    Remove-Item $SnowfallFile -Force
    Write-Host "  ✓ Deleted public/snowfall.js" -ForegroundColor Green
} else {
    Write-Host "  ⚠ File not found: public/snowfall.js" -ForegroundColor Yellow
}

# Step 2: Remove script tag from public/index.html
Write-Host "Step 2: Removing script tag from public/index.html..." -ForegroundColor Magenta
$IndexHtmlFile = Join-Path $FrontendRoot "public\index.html"
if (Test-Path $IndexHtmlFile) {
    $content = Get-Content $IndexHtmlFile -Raw
    $updatedContent = $content -replace '<script\s+src="/snowfall\.js"><\/script>\s*', ''
    if ($content -ne $updatedContent) {
        Set-Content $IndexHtmlFile $updatedContent -NoNewline
        Write-Host "  ✓ Removed snowfall.js script tag from public/index.html" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Script tag not found in index.html" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ File not found: public/index.html" -ForegroundColor Yellow
}

# Step 3: Delete src/components/SnowToggle.js
Write-Host "Step 3: Removing src/components/SnowToggle.js..." -ForegroundColor Magenta
$SnowToggleFile = Join-Path $FrontendRoot "src\components\SnowToggle.js"
if (Test-Path $SnowToggleFile) {
    Remove-Item $SnowToggleFile -Force
    Write-Host "  ✓ Deleted src/components/SnowToggle.js" -ForegroundColor Green
} else {
    Write-Host "  ⚠ File not found: src/components/SnowToggle.js" -ForegroundColor Yellow
}

# Step 4: Remove SnowToggle from Header.js
Write-Host "Step 4: Removing SnowToggle from Header.js..." -ForegroundColor Magenta
$HeaderFile = Join-Path $FrontendRoot "src\layout\Header.js"
if (-not (Test-Path $HeaderFile)) {
    $HeaderFile = Join-Path $FrontendRoot "src\components\Header.js"
}
if (Test-Path $HeaderFile) {
    $content = Get-Content $HeaderFile -Raw
    $updatedContent = $content -replace "import SnowToggle from ['\"].*?SnowToggle['\"];?\s*", ""
    $updatedContent = $updatedContent -replace "<SnowToggle\s*/>", ""
    if ($content -ne $updatedContent) {
        Set-Content $HeaderFile $updatedContent -NoNewline
        Write-Host "  ✓ Removed SnowToggle from Header.js" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ SnowToggle not found in Header.js" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ Header.js not found" -ForegroundColor Yellow
}

# Step 5: Remove SnowToggle from Sidebar.js
Write-Host "Step 5: Removing SnowToggle from Sidebar.js..." -ForegroundColor Magenta
$SidebarFile = Join-Path $FrontendRoot "src\dashboard\Sidebar.js"
if (Test-Path $SidebarFile) {
    $content = Get-Content $SidebarFile -Raw
    $updatedContent = $content -replace "import.*?SnowToggle.*?['\"];?\s*", ""
    $updatedContent = $updatedContent -replace "<SnowToggle\s*/>", ""
    if ($content -ne $updatedContent) {
        Set-Content $SidebarFile $updatedContent -NoNewline
        Write-Host "  ✓ Removed SnowToggle from Sidebar.js" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ SnowToggle not found in Sidebar.js" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ File not found: src/dashboard/Sidebar.js" -ForegroundColor Yellow
}

# Step 6: Remove SnowToggle from Login.js
Write-Host "Step 6: Removing SnowToggle from Login.js..." -ForegroundColor Magenta
$LoginFile = Join-Path $FrontendRoot "src\auth\Login.js"
if (Test-Path $LoginFile) {
    $content = Get-Content $LoginFile -Raw
    $updatedContent = $content -replace "import.*?SnowToggle.*?['\"];?\s*", ""
    $updatedContent = $updatedContent -replace "<SnowToggle\s*/>", ""
    if ($content -ne $updatedContent) {
        Set-Content $LoginFile $updatedContent -NoNewline
        Write-Host "  ✓ Removed SnowToggle from Login.js" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ SnowToggle not found in Login.js" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ File not found: src/auth/Login.js" -ForegroundColor Yellow
}

# Step 7: Remove SnowToggle from Signup.js
Write-Host "Step 7: Removing SnowToggle from Signup.js..." -ForegroundColor Magenta
$SignupFile = Join-Path $FrontendRoot "src\auth\Signup.js"
if (Test-Path $SignupFile) {
    $content = Get-Content $SignupFile -Raw
    $updatedContent = $content -replace "import.*?SnowToggle.*?['\"];?\s*", ""
    $updatedContent = $updatedContent -replace "<SnowToggle\s*/>", ""
    if ($content -ne $updatedContent) {
        Set-Content $SignupFile $updatedContent -NoNewline
        Write-Host "  ✓ Removed SnowToggle from Signup.js" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ SnowToggle not found in Signup.js" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ File not found: src/auth/Signup.js" -ForegroundColor Yellow
}

# Step 8: Delete SnowControl page
Write-Host "Step 8: Removing SnowControl page..." -ForegroundColor Magenta
$SnowControlFile = Join-Path $FrontendRoot "src\pages\SnowControl.js"
$SnowControlCss = Join-Path $FrontendRoot "src\pages\SnowControl.css"
if (Test-Path $SnowControlFile) {
    Remove-Item $SnowControlFile -Force
    Write-Host "  ✓ Deleted src/pages/SnowControl.js" -ForegroundColor Green
}
if (Test-Path $SnowControlCss) {
    Remove-Item $SnowControlCss -Force
    Write-Host "  ✓ Deleted src/pages/SnowControl.css" -ForegroundColor Green
}
if (-not (Test-Path $SnowControlFile) -and -not (Test-Path $SnowControlCss)) {
    Write-Host "  ⚠ SnowControl files not found" -ForegroundColor Yellow
}

# Step 9: Remove /snow-control route from App.js
Write-Host "Step 9: Removing /snow-control route from App.js..." -ForegroundColor Magenta
$AppFile = Join-Path $FrontendRoot "src\App.js"
if (Test-Path $AppFile) {
    $content = Get-Content $AppFile -Raw
    $updatedContent = $content -replace "import.*?SnowControl.*?['\"];?\s*", ""
    $updatedContent = $updatedContent -replace "<Route\s+path=['\"]\/snow-control['\"].*?\/>\s*", ""
    if ($content -ne $updatedContent) {
        Set-Content $AppFile $updatedContent -NoNewline
        Write-Host "  ✓ Removed SnowControl route and import from App.js" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Route not found in App.js" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ⚠ File not found: src/App.js" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Snow Feature Removal Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review the changes: git status" -ForegroundColor White
Write-Host "  2. Check that the app still builds: npm start (from frontend/)" -ForegroundColor White
Write-Host "  3. Commit the changes:" -ForegroundColor White
Write-Host "     git add -A && git commit -m 'Remove snowfall feature'" -ForegroundColor White
Write-Host "  4. Push to GitHub: git push" -ForegroundColor White
Write-Host ""
Write-Host "If you see any errors above, review the specific file manually." -ForegroundColor Yellow
