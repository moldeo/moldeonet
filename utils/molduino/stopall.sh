ps -ef | grep moldeoplayersdl2 | grep -v grep | awk '{print $2}' | xargs kill -9
ps -ef | grep mjpg_streamer | grep -v grep | awk '{print $2}' | xargs kill -9
