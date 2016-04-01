echo 'Check for volume'
amixer cget numid=1

echo 'Check for mute off/on'
amixer cget numid=2

echo 'Check output'
amixer cget numid=3

echo 'Set analog output'
amixer cset numid=3 1

echo 'Set volume'
amixer cset numid=1 400

echo 'Testing analog sound'
aplay /usr/share/sounds/alsa/Front_Center.wav
aplay /usr/share/sounds/alsa/Front_Left.wav
aplay /usr/share/sounds/alsa/Front_Right.wav

echo 'Testing digital sound'
omxplayer /usr/share/sounds/alsa/Front_Center.wav
omxplayer /usr/share/sounds/alsa/Front_Left.wav
omxplayer /usr/share/sounds/alsa/Front_Right.wav
