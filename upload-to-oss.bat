@echo off
chcp 65001 >nul
echo ========================================
echo   托福报名系统 - OSS上传工具
echo ========================================
echo.

REM 配置信息
set BUCKET_NAME=toefl-neea-frontend
set REGION=oss-cn-hangzhou

echo 请确保：
echo 1. 已经创建了OSS Bucket: %BUCKET_NAME%
echo 2. 已经下载并配置了 ossutil 工具
echo.
echo 如果还没有配置，请先运行: ossutil config
echo.

pause

echo.
echo [1/6] 上传HTML文件...
ossutil cp index.html oss://%BUCKET_NAME%/ -f
ossutil cp login.html oss://%BUCKET_NAME%/ -f
ossutil cp example.html oss://%BUCKET_NAME%/ -f
ossutil cp topper.html oss://%BUCKET_NAME%/ -f
ossutil cp footer.html oss://%BUCKET_NAME%/ -f
ossutil cp newsList.html oss://%BUCKET_NAME%/ -f
ossutil cp queryAdminDate.html oss://%BUCKET_NAME%/ -f
ossutil cp favicon.ico oss://%BUCKET_NAME%/ -f

echo.
echo [2/6] 上传static目录...
ossutil cp -r static oss://%BUCKET_NAME%/static -f

echo.
echo [3/6] 上传myHome目录...
ossutil cp -r myHome oss://%BUCKET_NAME%/myHome -f

echo.
echo [4/6] 上传JR1bm4k4XGH4目录...
if exist "JR1bm4k4XGH4" (
    ossutil cp -r JR1bm4k4XGH4 oss://%BUCKET_NAME%/JR1bm4k4XGH4 -f
)

echo.
echo [5/6] 设置文件权限为公共读...
ossutil set-acl oss://%BUCKET_NAME% public-read -r -f

echo.
echo [6/6] 上传完成！
echo.
echo ========================================
echo   上传成功！
echo ========================================
echo.
echo 访问地址:
echo http://%BUCKET_NAME%.%REGION%.aliyuncs.com/index.html
echo.
echo 或者:
echo http://%BUCKET_NAME%.%REGION%.aliyuncs.com/login.html
echo.

pause


