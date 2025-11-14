# Set Android and Java environment variables
$env:ANDROID_HOME = "C:\Users\1alph\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

Write-Host "Building Android APK..." -ForegroundColor Cyan

# Navigate to android directory
Set-Location -Path "c:\Users\1alph\OneDrive\Desktop\relaai-project\mobile\android"

# Build debug APK
.\gradlew.bat assembleDebug

Write-Host "Installing APK on emulator..." -ForegroundColor Cyan
& "$env:ANDROID_HOME\platform-tools\adb.exe" install -r "app\build\outputs\apk\debug\app-debug.apk"

Write-Host "Launching app..." -ForegroundColor Cyan
& "$env:ANDROID_HOME\platform-tools\adb.exe" shell am start -n com.relaai/.MainActivity
