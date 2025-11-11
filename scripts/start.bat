@echo off
echo 🚀 workforceX402 Platform - Starting up...
echo ==============================================

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if server file exists
if not exist "workforce-server.js" (
    echo ❌ workforce-server.js not found. Please ensure you're in the correct directory.
    pause
    exit /b 1
)

REM Check if index.html exists
if not exist "index.html" (
    echo ❌ index.html not found. Please ensure you're in the correct directory.
    pause
    exit /b 1
)

REM Set default port
set PORT=%1
if "%PORT%"=="" set PORT=3003
echo 🔧 Using port: %PORT%

REM Check if port is already in use
netstat -an | find ":%PORT%" | find "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port %PORT% is already in use.
    set /p="Do you want to kill the existing process? (y/n): "
    if /i "%REPLY%"=="y" (
        echo 🛑 Killing existing process on port %PORT%...
        for /f "tokens=5" %%a in ('netstat -aon ^| find ":%PORT%" ^| find "LISTENING"') do (
            taskkill /f /pid %%a >nul 2>&1
        )
        timeout /t 2 >nul
    ) else (
        echo ❌ Aborting. Please use a different port: start.bat %PORT%
        pause
        exit /b 1
    )
)

REM Start the server
echo 🚀 Starting workforceX402 server on port %PORT%...
set PORT=%PORT%

if "%2"=="background" (
    echo 🔄 Running in background mode...
    start /b node workforce-server.js > server.log 2>&1
    echo ✅ Server started in background
    echo 📄 Logs will be written to: server.log
    echo 🛑 To stop server, close this window or check Task Manager
) else (
    echo 🌐 Starting in foreground mode...
    echo 🌍 Access the platform at: http://localhost:%PORT%
    echo 💡 Press Ctrl+C to stop the server
    echo.
    node workforce-server.js
)