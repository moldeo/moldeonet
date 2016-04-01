gst-launch-1.0 udpsrc port=5200 ! application/x-rtp,encoding-name=JPEG ! rtpjpegdepay ! jpegdec ! videoconvert ! ximagesink sync=false
