git archive --format zip --output MoldeoControl.zip HEAD:MoldeoControl/
mkdir z
7z.exe x -y MoldeoControl.zip -o./z/MoldeoControl
cp "package.moldeocontrol.json"  "./z/MoldeoControl/package.json"
cp "config.init.js"  "./z/MoldeoControl/config.init.js"
7z.exe a node_modules.zip ./MoldeoControl/node_modules
7z.exe x -y node_modules.zip -o./z/MoldeoControl

del MoldeoControl.zip
7z.exe a MoldeoControl.zip ./z/MoldeoControl
cp MoldeoControl.zip ../../packages/install/win
del node_modules.zip
rmdir z /s /q
pause