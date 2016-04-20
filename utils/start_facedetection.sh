mkdir /tmp/dstblobs
moldeoplayersdl2 -mol /home/pi/moldeoinstaller/moldeosamples/basic/09_OpenCV/09_OpenCV.mol &
LD_LIBRARY_PATH=/usr/local/lib mjpg_streamer  -i "input_file.so -f /tmp/dstblobs -n dstblobs.jpg" -o "output_http.so -w /usr/local/www" &

