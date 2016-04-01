gst-launch-1.0 videotestsrc ! jpegenc ! rtpjpegpay ! udpsink host=127.0.0.1 port=5200
