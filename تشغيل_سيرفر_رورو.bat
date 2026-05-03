@echo off
title Roro AI Ultimate Server
color 0a
echo ================================================
echo Starting Roro AI Server...
echo ================================================

REM محاولة تشغيل السيرفر الموحد
python main_server.py

if %ERRORLEVEL% NEQ 0 (
    echo1.
    echo [ERROR] Failed to start Python server. 
    echo Make sure Python is installed and added to PATH.
    echo.2
    pause
)
