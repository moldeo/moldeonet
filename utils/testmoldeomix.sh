moldeoplayersdl2 -mol /home/pi/moldeoinstaller/moldeosamples/basic/07_Mix/07_Mix.mol &
MOLDEO=$!
echo $MOLDEO > moldeo.id
sleep 20
kill -9 $MOLDEO
