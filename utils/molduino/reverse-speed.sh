#!/bin/bash
SPEED=$(expr 255 - $1 )
echo "reverse at " $1 "("$SPEED")"
i2cset -y 1 0x08 0x05 $SPEED i && i2cset -y 1 0x08 0x08 $SPEED i
