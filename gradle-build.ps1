# Simple Gradle build script
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:ANDROID_HOME = "C:\Users\1alph\AppData\Local\Android\Sdk"

Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Cyan

Set-Location "c:\Users\1alph\OneDrive\Desktop\relaai-project\mobile\android"

Write-Host "Building Android APK..." -ForegroundColor Green
& ".\gradlew.bat" assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green

    Write-Host "Installing APK..." -ForegroundColor Cyan
    & "$env:ANDROID_HOME\platform-tools\adb.exe" install -r "app\build\outputs\apk\debug\app-debug.apk"

    Write-Host "Launching app..." -ForegroundColor Cyan
    & "$env:ANDROID_HOME\platform-tools\adb.exe" shell am start -n com.relaai/.MainActivity
} else {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
