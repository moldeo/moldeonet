gst-launch-1.0 -e v4l2src do-timestamp=true ! video/x-raw,format=RGB,width=160,height=120,framerate=30/1 ! decodebin ! videoconvert  ! ximagesink sync=false
