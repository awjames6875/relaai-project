# Set Android and Java environment variables
$env:ANDROID_HOME = "C:\Users\1alph\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:PATH"

# Navigate to mobile directory
Set-Location -Path "c:\Users\1alph\OneDrive\Desktop\relaai-project\mobile"

Write-Host "🧹 Cleaning build folders..." -ForegroundColor Yellow

# Clear Android build
Remove-Item -Path "android/app/build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android/build" -Recurse -Force -ErrorAction SilentlyContinue

# Clean Gradle
Set-Location -Path "android"
.\gradlew.bat clean
Set-Location -Path ".."

Write-Host "✅ Clean complete!" -ForegroundColor Green
Write-Host "🚀 Starting Metro and building Android app..." -ForegroundColor Cyan

# Run the Android app
npm run android
