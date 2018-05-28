@echo off
echo 运行app.js，更新SSR账户
node app.js
taskkill /im ShadowsocksR.exe /f
echo 运行 ShadowsocksR.exe
start "" "E:\工具\网络工具\梯子\ShadowsocksR\ShadowsocksR.exe"
@exit
