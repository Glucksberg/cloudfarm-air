@echo off
echo.
echo ========================================
echo   CloudFarm Air - APK Build Script
echo ========================================
echo.

echo [1/5] Building web assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Web build failed!
    pause
    exit /b 1
)

echo.
echo [2/5] Copying web assets to Android...
call npx cap copy android
if %errorlevel% neq 0 (
    echo ERROR: Copy failed!
    pause
    exit /b 1
)

echo.
echo [3/5] Syncing Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Sync failed!
    pause
    exit /b 1
)

echo.
echo [4/5] Opening Android Studio...
call npx cap open android

echo.
echo [5/5] Build Instructions:
echo ========================================
echo 1. Android Studio should now be open
echo 2. Wait for Gradle sync to complete
echo 3. Go to Build > Generate Signed Bundle / APK
echo 4. Choose APK and click Next
echo 5. Create or select your keystore
echo 6. Build the release APK
echo.
echo Your APK will be in:
echo android/app/build/outputs/apk/release/
echo ========================================
echo.
pause 