moldeoplayersdl2 -mol /home/pi/moldeoinstaller/moldeosamples/basic/08_Camera/08_Camera.mol &
MOLDEO=$!
echo $MOLDEO > moldeo.id
sleep 20
kill -9 $MOLDEO
