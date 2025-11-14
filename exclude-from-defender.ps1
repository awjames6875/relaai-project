# Exclude folders from Windows Defender
Write-Host "Adding exclusions to Windows Defender..." -ForegroundColor Cyan

Add-MpPreference -ExclusionPath "C:\Users\1alph\OneDrive\Desktop\relaai-project"
Add-MpPreference -ExclusionPath "C:\Users\1alph\.gradle"

Write-Host "✅ Exclusions added successfully!" -ForegroundColor Green
Write-Host "Now restart Android Studio and try again." -ForegroundColor Yellow
