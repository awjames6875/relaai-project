# 🚀 START HERE - How to Run Your RelaAI App

## ✅ Simple 3-Step Guide

### **STEP 1: Open Terminal**

**On Windows:**
- Press `Win + R`
- Type `cmd` and press Enter

**On Mac:**
- Press `Cmd + Space`
- Type `terminal` and press Enter

**On Linux:**
- Press `Ctrl + Alt + T`

---

### **STEP 2: Navigate to Mobile Folder**

Copy and paste this command (adjust the path to where YOU downloaded the project):

**Windows:**
```cmd
cd C:\Users\YourUsername\relaai-project\mobile
```

**Mac/Linux:**
```bash
cd ~/relaai-project/mobile
```

Or wherever you cloned the repository.

---

### **STEP 3: Start the App**

Type this command:

```bash
npm start
```

Press Enter and wait 10-20 seconds.

---

## 🎯 What Happens Next?

You'll see a menu:

```
› Press a │ open Android
› Press i │ open iOS
› Press w │ open web
```

---

## 📱 Choose Your Testing Method:

### **Method 1: Test on Your Phone (EASIEST - NO ANDROID STUDIO NEEDED)**

1. On your Android phone:
   - Open Google Play Store
   - Search for "Expo Go"
   - Install it

2. In the terminal, you'll see a QR code

3. Open Expo Go app on your phone

4. Tap "Scan QR Code"

5. Point camera at the QR code in terminal

6. **App loads on your phone!** ✅

**This is the fastest way and requires ZERO Android Studio setup!**

---

### **Method 2: Use Android Studio Emulator**

#### **A. First, Start Your Emulator:**

1. Open Android Studio

2. Look for the Device Manager icon (phone icon) in the top toolbar
   - OR go to: Tools → Device Manager

3. You should see a list of virtual devices

4. Click the green ▶️ play button next to any device

5. Wait 1-2 minutes for Android to fully boot (you'll see the home screen)

#### **B. Then Run the App:**

Go back to your terminal and press the letter **`a`**

The app will install and launch on the emulator!

---

## 🐛 Troubleshooting

### Problem: "npm: command not found"

**Solution:** Node.js is not installed

1. Go to: https://nodejs.org
2. Download the LTS version
3. Install it
4. Close and reopen terminal
5. Try again

---

### Problem: "Cannot find module 'mobile'"

**Solution:** You're in the wrong folder

Run this command to check where you are:
```bash
pwd
```

You should see something ending with `/mobile` or `\mobile`

If not, navigate to the mobile folder first.

---

### Problem: Terminal shows errors about "ANDROID_HOME" or "SDK"

**Solution:** This only matters if you're using Android Studio emulator

If you're testing on your phone with Expo Go, **ignore these errors** - they don't affect you!

If you want to use the emulator, see ANDROID-STUDIO-GUIDE.md

---

### Problem: "Expo start" worked, but pressing 'a' does nothing

**Solution:** Your emulator isn't running

1. Go to Android Studio
2. Start an emulator first (Device Manager → ▶️ play button)
3. Wait for it to fully boot
4. Then press `a` in terminal

---

### Problem: QR code doesn't appear

**Solution:**

Try this command instead:
```bash
npm start -- --tunnel
```

This creates a shareable link you can type into Expo Go manually.

---

## ✨ Quick Test - No Android Studio Needed!

**Want to see the app RIGHT NOW?** Do this:

1. **Install Expo Go on your phone** (from Play Store)

2. **Run this in terminal:**
   ```bash
   cd mobile
   npm start
   ```

3. **Scan QR code with Expo Go app**

4. **Done!** Your app is running on your phone! 🎉

---

## 📚 More Help

- **Android Studio setup:** See `ANDROID-STUDIO-GUIDE.md`
- **Full documentation:** See `CLAUDE.md`
- **Troubleshooting:** See `ANDROID-STUDIO-GUIDE.md` → Troubleshooting section

---

## 🎯 Recommended Path

1. ✅ **Start with Expo Go on your phone** (easiest, works in 2 minutes)
2. ✅ **Then set up Android Studio emulator** (if you need it)
3. ✅ **Start building features!**

---

## ❓ Still Stuck?

Tell me:
1. What command did you run?
2. What error message appeared?
3. Are you on Windows, Mac, or Linux?

I'll help you fix it!

---

**Ready? Run:**
```bash
cd mobile
npm start
```

**Then press `a` for Android emulator OR scan QR code with Expo Go!**
