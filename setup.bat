@echo off
echo Fixing Folder Structure...

:: Step 1: Initialize Next.js (This takes a few minutes)
call npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

:: Step 2: Move into the new folder
cd frontend

:: Step 3: Create Nested Folders one by one
echo Creating directories...
mkdir src\app\admin
mkdir src\app\admin\login
mkdir src\app\api
mkdir src\app\api\update-company
mkdir src\components
mkdir src\lib

:: Step 4: Create the actual files
echo Creating files...
cd src\app\admin
type nul > page.tsx
cd login
type nul > page.tsx
cd ..\..\api\update-company
type nul > route.ts
cd ..\..\..\components
type nul > ProductCard.tsx
type nul > CompanyDetails.tsx
type nul > Navbar.tsx
cd ..\lib
type nul > supabase.ts
cd ..\..

:: Step 5: Install Dependencies
echo Installing libraries...
call npm install @supabase/supabase-js qrcode.react lucide-react

echo ---------------------------------------
echo Structure Fixed! 
pause