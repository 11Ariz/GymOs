@echo off
setlocal
echo.
echo  [1] Start Local (Node + Vite)
echo  [2] Start Docker (Containers)
echo.
set /p choice="Select startup mode [1/2]: "

if "%choice%"=="2" (
    echo Starting Docker containers...
    docker compose up --build -d
    echo.
    echo Containers are starting...
    echo Backend: http://localhost:3001
    echo Frontend: http://localhost
    goto end
)

:local
echo Starting Local Services...
:: Start the backend in a new window
start "GymOS Backend" cmd /k "cd /d c:\app\server && node index.js"
:: Wait a moment for backend to boot
timeout /t 2 /nobreak >nul
:: Start the frontend in a new window
start "GymOS Frontend" cmd /k "cd /d c:\app && npm run dev"
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173

:end
pause
