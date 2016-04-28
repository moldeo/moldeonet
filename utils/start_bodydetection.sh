mkdir /tmp/dstblobs
moldeoplayersdl2 -mol /home/pi/moldeoinstaller/moldeosamples/basic/10_OpenCV/10_OpenCV.mol &
MOLDEO=$!
echo $MOLDEO > moldeo.id
LD_LIBRARY_PATH=/usr/local/lib mjpg_streamer  -i "input_file.so -f /tmp/dstblobs -n dstblobs.jpg" -o "output_http.so -w /usr/local/www" &
MJPGSTREAMER=$!
echo $MJPGSTREAMER > mjpgstreamer.id

