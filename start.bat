@echo off
chcp 65001 >nul
echo ========================================
echo   Starting MyWebsite (Frontend + Backend)
echo ========================================
echo.

REM --- Kill all Python processes ---
echo [1/6] Stopping all Python processes...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM pythonw.exe >nul 2>&1
echo   Python processes stopped.

REM --- Clear frontend port 5173 ---
echo [2/6] Checking frontend port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo   Killing PID %%a on port 5173...
    taskkill /F /PID %%a >nul 2>&1
)
echo   Port 5173 is clear.

REM --- Clear backend port 8000 ---
echo [3/6] Checking backend port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo   Killing PID %%a on port 8000...
    taskkill /F /PID %%a >nul 2>&1
)
echo   Port 8000 is clear.

REM --- Clear Python cache ---
echo [4/6] Clearing Python bytecode cache...
for /d /r "%~dp0backend" %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d" 2>nul
del /s /q "%~dp0backend\*.pyc" 2>nul
echo   Cache cleared.

REM --- Start backend ---
echo [5/6] Starting backend (FastAPI on :8000)...
cd /d "%~dp0backend"
start "MyWebsite-Backend" cmd /c "python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"
cd /d "%~dp0"

REM --- Start frontend ---
echo [6/6] Starting frontend (Vite on :5173)...
start "MyWebsite-Frontend" cmd /c "npm run dev"

echo.
echo ========================================
echo   Backend:  http://127.0.0.1:8000
echo   Frontend: http://localhost:5173/MyWebsite/
echo.
echo   Test Chat: http://localhost:5173/MyWebsite/#/test-chat
echo   AI Assistant: http://localhost:5173/MyWebsite/#/dashboard/ai-chat
echo ========================================
echo.
echo Both services are starting. Close this window to stop all.
pause
