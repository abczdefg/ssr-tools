@echo off
echo 运行app.js，更新SSR账户
node app.js
taskkill /im ShadowsocksR.exe /f
echo 运行 ShadowsocksR.exe
start "" "%cd%\ShadowsocksR\ShadowsocksR.exe"
@exit
