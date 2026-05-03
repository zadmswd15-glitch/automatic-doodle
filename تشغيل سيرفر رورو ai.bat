@echo off
chcp 65001 >nul
title Roro AI Server - Zaid Edition
color 0b
echo ================================================
echo 🚀 Starting Roro AI Server (Zaid Edition)...
echo ================================================

:: تشغيل السيرفر في نافذة جديدة
start "Roro Backend" python main_server.py

:: الانتظار قليلاً ليتأكد من عمل السيرفر
timeout /t 3 /nobreak >nul

:: فتح المتصفح
start "" http://localhost:5000

echo.
echo ✅ Server is running at http://localhost:5000
echo ✅ Site should open in your browser now.
echo.
pause
