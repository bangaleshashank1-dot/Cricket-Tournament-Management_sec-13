@echo off
title CricPulse Pro - Cricket Tournament Management System
echo ===================================================================
echo     Starting CricPulse Pro (Cricket Tournament System)
echo ===================================================================
cd /d "%~dp0"

echo Checking node_modules...
if not exist "node_modules" (
    echo Installing dependencies, please wait...
    call npm install
)

echo.
echo Launching development server...
echo Open your browser at: http://localhost:3000
echo.

start http://localhost:3000
call npm run dev
pause
