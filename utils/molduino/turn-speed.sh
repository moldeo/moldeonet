#!/bin/bash
SPEED1=$1
SPEED2=$(expr 255 - $SPEED1 )
echo "turn at " $SPEED1
i2cset -y 1 0x08 0x03 0x05 $SPEED1 i && i2cset -y 1 0x08 0x06 0x08 $SPEED2 i