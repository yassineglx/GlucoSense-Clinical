@echo off
echo =======================================================
echo Starting GlucoSense Clinical Dashboard
echo =======================================================

echo Starting FastAPI Model Server (LightGBM)...
start cmd /k "cd /d %~dp0 && venv\Scripts\python -m uvicorn api.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Next.js Web Interface...
start cmd /k "cd /d %~dp0\ui && npm run dev"

echo.
echo Dashboard will be available at: http://localhost:3000
echo API will be available at: http://127.0.0.1:8000
echo.
echo Press any key to exit this launcher window...
pause >nul
