"C:\Program Files\TortoiseSVN\bin\svn.exe" export "D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\moldeonet\MoldeoControl" "D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\binaries\bin\win\MoldeoControl" --force
cp "D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\moldeonet\package.moldeocontrol.json"  "D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\binaries\bin\win\MoldeoControl\package.json"
cp "D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\moldeonet\config.init.js"  "D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\binaries\bin\win\MoldeoControl\config.init.js"
"D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\binaries\bin\win\7z.exe" a "D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\binaries\install\win\MoldeoControl.zip" "D:\0_DESARROLLO\0_MOLDEO\0_desarrollo\SVNSOURCEFORGE\binaries\bin\win\MoldeoControl\"
pause