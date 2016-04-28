ps -ef | grep moldeoplayersdl2 | grep -v grep | awk '{print }' | xargs kill -9
ps -ef | grep mjpg_streamer | grep -v grep | awk '{print }' | xargs kill -9
