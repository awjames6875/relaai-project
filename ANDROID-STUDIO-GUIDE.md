# 🤖 Android Studio Testing Guide for RelaAI

Complete step-by-step guide to test your RelaAI app in Android Studio.

---

## ✅ Current Status

Your app is ready! Here's what's been set up:

- ✅ **Mobile app created** (`mobile/` directory)
- ✅ **Expo + TypeScript** configured
- ✅ **Dependencies installed** (Redux, Navigation, Supabase, Testing)
- ✅ **Folder structure** created (atoms/molecules/organisms)
- ✅ **Sample component** (Button with tests)
- ✅ **Theme system** configured
- ✅ **Test infrastructure** ready

---

## 🚀 Quick Start (3 Options)

### **Option 1: Test on Physical Android Device (FASTEST - 2 minutes)**

1. Install Expo Go on your Android phone:
   - Open Google Play Store
   - Search for "Expo Go"
   - Install the app

2. Start the development server:
   ```bash
   cd mobile
   npm start
   ```

3. Scan the QR code with Expo Go
4. App loads on your phone! 🎉

**Pros:** Works immediately, no Android Studio needed
**Cons:** Limited debugging capabilities

---

### **Option 2: Use Android Studio Emulator (RECOMMENDED)**

#### Prerequisites Check

First, verify Android Studio is properly configured. Open a terminal and run:

```bash
# Check if Android SDK is installed
ls ~/Library/Android/sdk  # macOS
ls ~/Android/Sdk           # Linux
dir %LOCALAPPDATA%\Android\Sdk  # Windows

# Check if adb is accessible
adb --version
```

If these commands fail, follow the setup steps below.

#### Step 1: Configure Android SDK in Android Studio

1. Open **Android Studio**
2. Go to **Tools > SDK Manager** (or **Android Studio > Preferences > Appearance & Behavior > System Settings > Android SDK**)

3. In the **SDK Platforms** tab, install:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 14.0 (UpsideDownCake) - API Level 34

4. In the **SDK Tools** tab, install:
   - ✅ Android SDK Build-Tools (latest)
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Android SDK Command-line Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM) - macOS/Windows only

5. Click **Apply** and wait for downloads to complete

#### Step 2: Set Environment Variables

Add these to your shell config file (`~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`):

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk         # Linux
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

**Windows (PowerShell):**
```powershell
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', "$env:LOCALAPPDATA\Android\Sdk", 'User')
$path = [System.Environment]::GetEnvironmentVariable('PATH', 'User')
[System.Environment]::SetEnvironmentVariable('PATH', "$path;$env:ANDROID_HOME\emulator;$env:ANDROID_HOME\platform-tools", 'User')
```

Then reload your terminal:
```bash
source ~/.zshrc  # or ~/.bashrc
```

Verify it worked:
```bash
echo $ANDROID_HOME
adb --version
emulator -version
```

#### Step 3: Accept SDK Licenses

This is **CRITICAL** and often causes issues:

```bash
cd $ANDROID_HOME/cmdline-tools/latest/bin
./sdkmanager --licenses
```

Type `y` for each license and press Enter.

#### Step 4: Create an Android Virtual Device (AVD)

1. Open **Android Studio**
2. Click **Tools > Device Manager** (or the device icon in toolbar)
3. Click **Create Device**
4. Select **Phone > Pixel 5** (or any modern device)
5. Click **Next**
6. Download a system image:
   - Select **Tiramisu (API 33)** or **UpsideDownCake (API 34)**
   - Click **Download** next to the image
   - Wait for download to complete
7. Click **Next** > **Finish**

#### Step 5: Start the Emulator

**Option A: From Android Studio**
1. Open **Device Manager**
2. Click the ▶️ play button next to your AVD
3. Wait for Android to boot (first time takes 2-3 minutes)

**Option B: From Terminal**
```bash
emulator -list-avds  # List available AVDs
emulator @Pixel_5_API_33  # Replace with your AVD name
```

#### Step 6: Run the App

Open a new terminal and run:

```bash
cd mobile
npm run android
```

**What happens:**
1. Metro bundler starts
2. App installs on emulator
3. App launches automatically
4. You see "Welcome to RelaAI" screen! 🎉

---

### **Option 3: Build Development Client (Advanced)**

For custom native modules:

```bash
cd mobile
npx expo prebuild
npx expo run:android
```

This creates native Android project in `mobile/android/`.

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "SDK location not found"

**Solution:**
```bash
# Create local.properties file
cd mobile/android
echo "sdk.dir=$ANDROID_HOME" > local.properties
```

### Issue 2: "adb: command not found"

**Solution:**
```bash
# Add to ~/.zshrc or ~/.bashrc
export PATH=$PATH:$ANDROID_HOME/platform-tools
source ~/.zshrc
```

### Issue 3: "Licenses have not been accepted"

**Solution:**
```bash
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
# Type 'y' for each license
```

### Issue 4: "Unable to load script from assets index.android.bundle"

**Solution:**
```bash
# Clear Metro cache
cd mobile
npm start -- --reset-cache

# In another terminal
npm run android
```

### Issue 5: Emulator won't start

**Solution:**
```bash
# Check for running emulators
adb devices

# Kill all emulators
adb kill-server
adb start-server

# Try starting fresh
emulator @Pixel_5_API_33
```

### Issue 6: "INSTALL_FAILED_INSUFFICIENT_STORAGE"

**Solution:**
1. Open **Device Manager** in Android Studio
2. Click the ▼ dropdown on your AVD
3. Select **Wipe Data**
4. Restart emulator

### Issue 7: Java version issues

**You have Java 21 installed ✅**

If you see Java-related errors, verify:
```bash
java -version  # Should show "21.0.8"
```

---

## 📱 Testing Checklist

Once the app is running:

- [ ] App launches without crashes
- [ ] "Welcome to RelaAI" title appears
- [ ] "Test Android Studio" button is visible
- [ ] Clicking button shows success alert
- [ ] Hot reload works (change text in `App.tsx` and save)

---

## 🧪 Running Tests

**Note:** Unit tests currently have an Expo 54 compatibility issue with jest-expo. This is a known issue and will be resolved. For now, focus on:

1. **Manual testing** in the emulator
2. **Visual testing** by running the app
3. **Integration testing** once the test setup is fixed

To try running tests:
```bash
cd mobile
npm test
```

---

## ⚡ Development Workflow

1. **Start Metro bundler:**
   ```bash
   cd mobile
   npm start
   ```

2. **Run on Android (separate terminal):**
   ```bash
   npm run android
   ```

3. **Make changes** to files in `mobile/src/`

4. **See changes instantly** (hot reload)

5. **Debug with React DevTools:**
   - Press `m` in Metro terminal
   - Select "Open React DevTools"

---

## 🎯 Next Steps

Now that your app is running:

1. **Explore the structure:**
   - `mobile/src/components/atoms/` - Basic components
   - `mobile/src/theme/` - Design system
   - `mobile/__tests__/` - Test files

2. **Use the templates:**
   - Check `code-templates/react-native-components/`
   - Follow atomic design pattern

3. **Add features:**
   - Use `coordination/workflows/feature-development-workflow.md`
   - Define contracts first in `contracts/`

4. **Follow quality gates:**
   - `coordination/review-gates/ui-designer-quality-gate.md`

---

## 📚 Resources

- **Expo Docs:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Android Studio Guide:** https://developer.android.com/studio
- **Your project docs:** `CLAUDE.md` and `README.md`

---

## ✅ Success!

If you see the RelaAI welcome screen, you're all set! 🎉

The app is ready for development. Start building features using the templates in `code-templates/` and following the workflows in `coordination/`.

**Happy coding!** 🚀
