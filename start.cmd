@echo off
start cmd /c node ./bin/www

timeout 15
start http://localhost:3000/
