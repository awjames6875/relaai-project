#!/bin/bash

# Android Studio Setup Checker for RelaAI
# This script helps diagnose Android Studio configuration issues

echo "🤖 RelaAI - Android Studio Setup Checker"
echo "=========================================="
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    echo "  ✅ Node.js $(node --version) found"
else
    echo "  ❌ Node.js not found - install from https://nodejs.org"
fi
echo ""

# Check npm
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    echo "  ✅ npm $(npm --version) found"
else
    echo "  ❌ npm not found"
fi
echo ""

# Check Java
echo "✓ Checking Java..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -1)
    echo "  ✅ Java found: $JAVA_VERSION"
else
    echo "  ❌ Java not found - install JDK 11 or later"
fi
echo ""

# Check ANDROID_HOME
echo "✓ Checking ANDROID_HOME..."
if [ -z "$ANDROID_HOME" ]; then
    echo "  ❌ ANDROID_HOME not set"
    echo "     Add to ~/.zshrc or ~/.bashrc:"
    echo "     export ANDROID_HOME=\$HOME/Library/Android/sdk  # macOS"
    echo "     export ANDROID_HOME=\$HOME/Android/Sdk         # Linux"
else
    echo "  ✅ ANDROID_HOME=$ANDROID_HOME"

    if [ -d "$ANDROID_HOME" ]; then
        echo "  ✅ Android SDK directory exists"
    else
        echo "  ❌ Android SDK directory not found at $ANDROID_HOME"
    fi
fi
echo ""

# Check adb
echo "✓ Checking adb (Android Debug Bridge)..."
if command -v adb &> /dev/null; then
    echo "  ✅ adb $(adb --version | head -1) found"
else
    echo "  ❌ adb not found"
    echo "     Add to PATH: export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
fi
echo ""

# Check emulator
echo "✓ Checking Android emulator..."
if command -v emulator &> /dev/null; then
    echo "  ✅ emulator found"
    echo "  Available AVDs:"
    emulator -list-avds | sed 's/^/     - /'
else
    echo "  ❌ emulator not found"
    echo "     Add to PATH: export PATH=\$PATH:\$ANDROID_HOME/emulator"
fi
echo ""

# Check running devices
echo "✓ Checking connected devices/emulators..."
if command -v adb &> /dev/null; then
    DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l)
    if [ "$DEVICES" -gt 0 ]; then
        echo "  ✅ $DEVICES device(s) connected:"
        adb devices | grep "device" | sed 's/^/     /'
    else
        echo "  ⚠️  No devices connected"
        echo "     Start an emulator or connect a physical device"
    fi
else
    echo "  ⚠️  Cannot check (adb not found)"
fi
echo ""

# Check sdkmanager
echo "✓ Checking sdkmanager..."
if [ -f "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "  ✅ sdkmanager found"
else
    echo "  ❌ sdkmanager not found"
    echo "     Install 'Android SDK Command-line Tools' in Android Studio"
fi
echo ""

# Summary
echo "=========================================="
echo "📋 Summary"
echo "=========================================="
echo ""

if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ] && command -v adb &> /dev/null && command -v emulator &> /dev/null; then
    echo "✅ Your Android Studio setup looks good!"
    echo ""
    echo "Next steps:"
    echo "  1. Start an emulator or connect a device"
    echo "  2. Run: cd mobile && npm run android"
    echo "  3. See ANDROID-STUDIO-GUIDE.md for details"
else
    echo "⚠️  Some issues found - see ANDROID-STUDIO-GUIDE.md for fixes"
    echo ""
    echo "Common fixes:"
    if [ -z "$ANDROID_HOME" ]; then
        echo "  • Set ANDROID_HOME in your shell config"
    fi
    if ! command -v adb &> /dev/null; then
        echo "  • Add platform-tools to PATH"
    fi
    if ! command -v emulator &> /dev/null; then
        echo "  • Add emulator to PATH"
    fi
fi
echo ""
