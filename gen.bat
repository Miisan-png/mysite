@echo off
title Generate MySite
cd /d "%~dp0"

echo Stopping any existing local server...
taskkill /F /IM python.exe >nul 2>&1

echo Cleaning old build...
if exist public (
    rmdir /s /q public
)

echo Building site...
dotnet build --nologo -v quiet -clp:ErrorsOnly
if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b %errorlevel%
)

echo Running generator...
dotnet run --no-build

echo Copying CSS assets...
if not exist public\css mkdir public\css
xcopy /y /s "source\css" "public\css" >nul

echo Starting local server...
cd public
start "" http://localhost:8080
python -m http.server 8080
