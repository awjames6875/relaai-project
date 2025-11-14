# Set Android and Java environment variables
$env:ANDROID_HOME = "C:\Users\1alph\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin;$env:PATH"

# Navigate to mobile directory
Set-Location -Path "c:\Users\1alph\OneDrive\Desktop\relaai-project\mobile"

# Run the Android app
npm run android
