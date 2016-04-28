#!/bin/bash
SPEED=$1
echo "advance at " $SPEED
i2cset -y 1 0x08 0x05 $SPEED i && i2cset -y 1 0x08 0x08 $SPEED i
