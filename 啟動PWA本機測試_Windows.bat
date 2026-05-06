@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo.
echo 正在啟動米兔教室座位系統 PWA 本機測試...
echo.
echo 若瀏覽器沒有自動開啟，請手動打開：
echo http://localhost:5173/clear-cache.html
echo.
start "" "http://localhost:5173/clear-cache.html"

where py > nul 2> nul
if %errorlevel%==0 (
  py -3 -m http.server 5173
) else (
  python -m http.server 5173
)
pause
