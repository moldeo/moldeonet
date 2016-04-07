#!/bin/bash
SPEED=$(expr 255 - 50 )
echo "reverse at 50 ("$SPEED")"
i2cset -y 1 0x08 0x03 0x05 $SPEED i && i2cset -y 1 0x08 0x06 0x08 $SPEED i