# Quick Fix Android Build - All Issues Combined
# This script fixes Gradle locks, react-native-reanimated version, and rebuilds the app

Write-Host "🚀 Starting Quick Fix for Android Build..." -ForegroundColor Cyan
Write-Host ""

# Set environment variables
$env:ANDROID_HOME = "C:\Users\1alph\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:PATH"

# Navigate to project root
Set-Location -Path "c:\Users\1alph\OneDrive\Desktop\relaai-project"

Write-Host "1️⃣ Stopping all processes..." -ForegroundColor Yellow

# Stop Gradle daemons
Write-Host "   Stopping Gradle daemons..." -ForegroundColor Gray
try {
    Set-Location -Path "mobile\android"
    & ".\gradlew.bat" --stop 2>&1 | Out-Null
    Set-Location -Path "..\.."
} catch {
    Write-Host "   (Gradle daemon not running)" -ForegroundColor Gray
}

# Kill Java processes (Gradle/Android related)
Write-Host "   Killing Java/Gradle processes..." -ForegroundColor Gray
Get-Process -Name "java" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*gradle*" -or $_.CommandLine -like "*android*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Kill Metro bundler
Write-Host "   Stopping Metro bundler..." -ForegroundColor Gray
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*metro*" -or $_.CommandLine -like "*react-native*" } | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "✅ Processes stopped" -ForegroundColor Green
Write-Host ""

# Fix react-native-reanimated version
Write-Host "2️⃣ Fixing react-native-reanimated version..." -ForegroundColor Yellow
$packageJsonPath = "mobile\package.json"
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
$packageJson.dependencies.'react-native-reanimated' = "~3.10.1"
$packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
Write-Host "   Updated to ~3.10.1" -ForegroundColor Gray
Write-Host "✅ Version fixed" -ForegroundColor Green
Write-Host ""

# Nuclear clean
Write-Host "3️⃣ Cleaning all build directories..." -ForegroundColor Yellow

$cleanPaths = @(
    "mobile\node_modules",
    "mobile\android\.gradle",
    "mobile\android\app\build",
    "mobile\android\build",
    "mobile\node_modules\@react-native\gradle-plugin\build"
)

foreach ($path in $cleanPaths) {
    if (Test-Path $path) {
        Write-Host "   Removing: $path" -ForegroundColor Gray
        try {
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "   ⚠️  Could not remove $path (may be locked)" -ForegroundColor Yellow
        }
    }
}

Write-Host "✅ Clean complete" -ForegroundColor Green
Write-Host ""

# Reinstall dependencies
Write-Host "4️⃣ Reinstalling dependencies..." -ForegroundColor Yellow
Set-Location -Path "mobile"
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
npm install --legacy-peer-deps
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Clean Gradle
Write-Host "5️⃣ Cleaning Gradle build..." -ForegroundColor Yellow
Set-Location -Path "android"
& ".\gradlew.bat" clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Gradle clean had issues, continuing anyway..." -ForegroundColor Yellow
}
Set-Location -Path ".."
Write-Host "✅ Gradle clean complete" -ForegroundColor Green
Write-Host ""

# Rebuild
Write-Host "6️⃣ Building Android app..." -ForegroundColor Yellow
Write-Host "   This may take 3-5 minutes..." -ForegroundColor Gray
npm run android

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅✅✅ SUCCESS! App should be running now! ✅✅✅" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Build failed. Check the error messages above." -ForegroundColor Red
    Write-Host "   You may need to restart your computer to clear file locks." -ForegroundColor Yellow
}

