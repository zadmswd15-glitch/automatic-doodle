@echo off
chcp 65001 >nul
title Roro AI Server
color 0a
echo ================================================
echo Starting Roro AI Server...
echo ================================================

start "" http://localhost:5000
echo اني فتحت الموقع يا ابني اني احبك
python main_server.py

pause
