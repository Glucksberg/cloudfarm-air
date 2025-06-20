@echo off
echo.
echo ========================================
echo   CloudFarm Air - Ciclo de Desenvolvimento
echo ========================================
echo.

echo [1/4] Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Syncing to Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Sync failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Building APK Debug...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ERROR: APK build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [4/4] Installing on device...
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
if %errorlevel% neq 0 (
    echo WARNING: Install failed - check if device is connected
    echo You can install manually from: android/app/build/outputs/apk/debug/app-debug.apk
)

echo.
echo ========================================
echo ✅ DESENVOLVIMENTO COMPLETO!
echo ========================================
echo APK Debug: android/app/build/outputs/apk/debug/app-debug.apk
echo.
pause 