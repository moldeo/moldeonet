moldeoplayersdl2 -mol /home/pi/moldeoinstaller/moldeosamples/basic/09_OpenCV/09_OpenCV.mol &
MOLDEO=$!
echo $MOLDEO > moldeo.id
sleep 30
kill -9 $MOLDEO
