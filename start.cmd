@echo off
start cmd /c node ./bin/www.js

timeout 15
start http://localhost:3000/
