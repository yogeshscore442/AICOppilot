@echo off
setlocal enabledelayedexpansion
title MediPilot - Healthcare Copilot
cd /d "%~dp0"

echo ================================================================
echo           MediPilot Healthcare Copilot - Document Reader
echo ================================================================
echo.

if not exist ".venv\Scripts\python.exe" goto setup_venv
goto select_mode

:setup_venv
echo [*] Virtual environment not found. Setting up...
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not found in PATH!
    echo Please install Python 3.10+ from python.org and add it to PATH.
    pause
    exit /b 1
)
echo [*] Creating virtual environment (.venv)...
python -m venv .venv
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create virtual environment!
    pause
    exit /b 1
)
echo [*] Installing dependencies from requirements_free.txt...
".venv\Scripts\pip.exe" install -r requirements_free.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Setup complete!
echo.

:select_mode
echo Select how you want to run the project:
echo   [1] Run MediPilot Web Application (Default - Port 8080)
echo   [2] Run Backend + React Vite Dev Server (Ports 8080 + 5173)
echo   [3] Reinstall or Repair Dependencies
echo.
choice /C 123 /N /T 5 /D 1 /M "Enter option [1, 2, or 3] (Auto-selecting 1 in 5s): "
set OPTION=%errorlevel%

if "%OPTION%"=="3" goto reinstall
if "%OPTION%"=="2" goto run_both
goto run_app

:reinstall
echo.
echo [*] Reinstalling dependencies...
".venv\Scripts\pip.exe" install --upgrade -r requirements_free.txt
echo [OK] Done.
pause
exit /b 0

:run_both
echo.
echo [*] Launching Backend and React Frontend...
start "MediPilot Backend" cmd /k "cd /d ""%~dp0"" && title MediPilot Backend && "".venv\Scripts\python.exe"" app_free.py"
timeout /t 2 >nul
start "MediPilot Vite Frontend" cmd /k "cd /d ""%~dp0frontend"" && title MediPilot Vite Dev && npm.cmd run dev"
timeout /t 3 >nul
start http://localhost:5173
exit /b 0

:run_app
echo.
echo [*] Starting MediPilot on http://127.0.0.1:8080 ...
echo [*] Opening default web browser in 2 seconds...
start /b cmd /c "timeout /t 2 >nul && start http://127.0.0.1:8080"
echo.
".venv\Scripts\python.exe" app_free.py
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Application exited with error code %errorlevel%.
    pause
)
