#!/bin/bash
SPEED2=$1
SPEED1=$(expr 255 - $SPEED2 )
echo "turn right at " $SPEED2
i2cset -y 1 0x08 0x03 0x05 $SPEED1 i && i2cset -y 1 0x08 0x06 0x08 $SPEED2 i
