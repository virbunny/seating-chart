#!/bin/bash
cd "$(dirname "$0")"
echo "正在啟動米兔教室座位系統 PWA 本機測試..."
echo "若瀏覽器沒有自動開啟，請手動打開：http://localhost:5173/index.html"

if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server 5173 &
else
  python -m http.server 5173 &
fi

sleep 1
open "http://localhost:5173/index.html"
wait
